import { App } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import { API_URL_GRAMMAR } from '../config';
import highlightWords from './helpers/highlightWords';

import UIBar from './UIElements/UIBar';

let self: any;

export class OrthographyGrammar {
  private app: App;
  private settings: OrthographySettings;
  private grammar: any;
  private mover: any;
  private collapse: any;
  private grammarOffset: any = [0, 0];
  private moverSelected = false;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public init(): void {
    self = this;
    setTimeout(() => {
      const text = this.getEditorText();
      this.getData(text).then(res => {
        localStorage.setItem(
          'obsidian-orthography-hints',
          JSON.stringify(res)
        );
        this.createBar();
      });
    }, 1000);
  }
  
  public destroy(): void {
    const minicards = document.querySelectorAll('.orthography-grammar-item');
    minicards.forEach(mc => mc.removeEventListener('click', this.toggleCard));
    this.mover.removeEventListener('mousedown', this.moverIsDown);
    this.collapse.removeEventListener('mousedown', this.closeOpenedCards);
    document.removeEventListener('mouseup', () => this.moverSelected = false);
    document.removeEventListener('mousemove', this.moveMover);
  }

  private createBar() {
    this.grammar = document.createElement('div');
    this.grammar.classList.add('orthography-grammar');
    this.grammar.id = 'orthography-grammar';
    const data: any = JSON.parse(localStorage.getItem('obsidian-orthography-hints'));
    const bar = UIBar(data);
    this.grammar.innerHTML = bar;
    document.body.appendChild(this.grammar);

    highlightWords(this.app, data.alerts, 'highlightText');

    const minicards = document.querySelectorAll('.orthography-grammar-item');
    minicards.forEach(mc => mc.addEventListener('click', this.toggleCard));
    this.mover = document.getElementById('mover');
    this.mover.addEventListener('mousedown', this.moverIsDown);
    this.collapse = document.getElementById('collapse');
    this.collapse.addEventListener('mousedown', this.closeOpenedCards);
    document.addEventListener('mouseup', () => this.moverSelected = false);
    document.addEventListener('mousemove', this.moveMover);
  }

  private toggleCard(e: any): void {
    if (e.currentTarget.className.contains('orthography-grammar-item--opened')) {
      e.currentTarget.classList.remove('orthography-grammar-item--opened');
    } else {
      e.currentTarget.classList.add('orthography-grammar-item--opened');
    }
  }

  private moverIsDown(e: any) {
    self.moverSelected = true;
    self.grammarOffset = [
      self.grammar.offsetLeft - e.clientX,
      self.grammar.offsetTop - e.clientY
    ];
  }

  private moveMover(e: any) {
    e.preventDefault();
    if (self.moverSelected) {
      const mousePosition = {
        x: e.clientX,
        y: e.clientY
      };
      self.grammar.style.left = `${(mousePosition.x + self.grammarOffset[0])}px`;
      self.grammar.style.top = `${(mousePosition.y + self.grammarOffset[1])}px`;
    }
  }

  private closeOpenedCards() {
    const minicards = document.querySelectorAll('.orthography-grammar-item');
    minicards.forEach(mc => mc.classList.remove('orthography-grammar-item--opened'));
  }

  private async getData(text: string) {
    const url: any = new URL(API_URL_GRAMMAR);
    const  params: any = { text }
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    const response = await fetch(url, {
      method: 'GET'
    });
    return await response.json();
  }

  private getEditorText() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const editor = activeLeaf.view.sourceMode.cmEditor;
    return editor.getValue();
  }
}
