import { App } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import {
  O_GRAMMAR,
  O_GRAMMAR_ITEM,
  O_GRAMMAR_ITEM_OPENED
} from '../cssClasses';
import { IAlert } from '../interfaces';

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
  }

  public create(): void {
    self.grammar = document.createElement('div');
    self.grammar.classList.add(O_GRAMMAR);
    self.grammar.id = O_GRAMMAR;
    const bar = UIBar(null, false);
    self.grammar.innerHTML = bar;
    document.body.appendChild(self.grammar);
    self.setListeners();
  }

  public destroy(): void {
    self.removeListeners();
    if (self.grammar) document.getElementById(O_GRAMMAR).remove();
  }

  public update(data: IAlert, loading?: boolean): void {
    self.removeListeners();
    const bar = UIBar(data, loading);
    self.grammar.innerHTML = bar;
    self.setListeners();
  }

  public setLoader(): void {
    this.update(null, true);
  }

  public removeLoader(): void {
    this.update(null, false);
  }

  private setListeners() {
    const minicards = document.querySelectorAll(`.${O_GRAMMAR_ITEM}`);
    minicards.forEach((mc) => mc.addEventListener('click', self.toggleCard));
    self.mover = document.getElementById('mover');
    self.mover.addEventListener('mousedown', self.moverIsDown);
    self.collapse = document.getElementById('collapse');
    self.collapse.addEventListener('mousedown', self.closeOpenedCards);
    document.addEventListener('mouseup', () => (self.moverSelected = false));
    document.addEventListener('mousemove', self.moveMover);
  }

  private removeListeners() {
    const minicards = document.querySelectorAll(`.${O_GRAMMAR_ITEM}`);
    minicards.forEach((mc) => mc.removeEventListener('click', self.toggleCard));
    if (self.mover)
      self.mover.removeEventListener('mousedown', self.moverIsDown);
    if (self.collapse)
      self.collapse.removeEventListener('mousedown', self.closeOpenedCards);
    document.removeEventListener('mouseup', () => (self.moverSelected = false));
    document.removeEventListener('mousemove', self.moveMover);
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
}
