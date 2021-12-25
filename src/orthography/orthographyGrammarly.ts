import { App } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import { API_URL_GRAMMAR } from '../config';
import {
  O_GRAMMAR,
  O_GRAMMAR_ITEM,
  O_GRAMMAR_ITEM_OPENED
} from '../cssClasses';

import UIBar from './UIElements/UIBar';

let self: any;

export class OrthographyGrammarly {
  private app: App;
  private settings: OrthographySettings;
  private grammar: any;
  private mover: any;
  private collapse: any;
  private grammarOffset: number[] = [0, 0];
  private moverSelected = false;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public init(): void {
    self = this;
    // setTimeout(() => {
    //   const activeEditor = this.getEditor();
    //   activeEditor.on('change', (editor: any) => {
    //     const text = editor.doc.getValue();
    //     console.log(text);
    //   });
    // }, 1000);
  }

  public create(): void {
    self.grammar = document.createElement('div');
    self.grammar.classList.add(O_GRAMMAR);
    self.grammar.id = O_GRAMMAR;
    const bar = UIBar(null);
    self.grammar.innerHTML = bar;
    document.body.appendChild(self.grammar);
    self.setListeners();
  }

  public destroy(): void {
    const minicards = document.querySelectorAll(`.${O_GRAMMAR_ITEM}`);
    minicards.forEach((mc) => mc.removeEventListener('click', self.toggleCard));
    if (self.mover)
      self.mover.removeEventListener('mousedown', self.moverIsDown);
    if (self.collapse)
      self.collapse.removeEventListener('mousedown', self.closeOpenedCards);
    document.removeEventListener('mouseup', () => (self.moverSelected = false));
    document.removeEventListener('mousemove', self.moveMover);
    if (self.grammar) document.getElementById(O_GRAMMAR).remove();
  }

  private setListeners() {
    const minicards = document.querySelectorAll(`.${O_GRAMMAR_ITEM}`);
    minicards.forEach((mc) => mc.addEventListener('click', this.toggleCard));
    this.mover = document.getElementById('mover');
    this.mover.addEventListener('mousedown', this.moverIsDown);
    this.collapse = document.getElementById('collapse');
    this.collapse.addEventListener('mousedown', this.closeOpenedCards);
    document.addEventListener('mouseup', () => (self.moverSelected = false));
    document.addEventListener('mousemove', this.moveMover);
  }

  private toggleCard(e: any): void {
    if (e.currentTarget.className.contains(O_GRAMMAR_ITEM_OPENED)) {
      e.currentTarget.classList.remove(O_GRAMMAR_ITEM_OPENED);
    } else {
      e.currentTarget.classList.add(O_GRAMMAR_ITEM_OPENED);
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
      self.grammar.style.left = `${mousePosition.x + self.grammarOffset[0]}px`;
      self.grammar.style.top = `${mousePosition.y + self.grammarOffset[1]}px`;
    }
  }

  private closeOpenedCards() {
    const minicards = document.querySelectorAll(`.${O_GRAMMAR_ITEM}`);
    minicards.forEach((mc) => mc.classList.remove(O_GRAMMAR_ITEM_OPENED));
  }

  private async getData(text: string) {
    const url: any = new URL(API_URL_GRAMMAR);
    const params: any = { text };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    const response = await fetch(url, {
      method: 'GET'
    });
    return await response.json();
  }

  private getEditor() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    return activeLeaf.view.sourceMode.cmEditor;
  }

  private getEditorText() {
    return this.getEditor().getValue();
  }
}
