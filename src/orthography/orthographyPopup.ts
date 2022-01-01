import { App, Events } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import {
  O_GRAMMAR,
  O_GRAMMAR_ITEM,
  O_GRAMMAR_RESIZED,
  O_GRAMMAR_ITEM_OPENED,
  O_POPUP_REPLACEMENT,
  O_HIGHLIGHT_FOCUSED
} from '../cssClasses';
import { IAlert } from '../interfaces';

import UIBar from './UIElements/UIBar';

let self: any;

export class OrthographyPopup {
  private app: App;
  private settings: OrthographySettings;
  private emitter: any;
  private grammar: any;
  private sizer: any;
  private mover: any;
  private reloader: any;
  private runner: any;
  private collapse: any;
  private grammarOffset: number[] = [0, 0];
  private moverSelected = false;
  private created = false;

  constructor(app: App, settings: OrthographySettings, emitter: Events) {
    this.app = app;
    this.settings = settings;
    this.emitter = emitter;
  }

  public init(): void {
    self = this;
  }

  public create(): void {
    self.created = true;
    self.grammar = document.createElement('div');
    self.grammar.classList.add(O_GRAMMAR);
    self.grammar.id = O_GRAMMAR;
    const bar = UIBar(null, false);
    self.grammar.innerHTML = bar;
    document.body.appendChild(self.grammar);
    self.setListeners();
  }

  public destroy(): void {
    self.created = false;
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
    minicards.forEach((mc) =>
      mc.addEventListener('mouseover', self.onFocusWord)
    );
    minicards.forEach((mc) =>
      mc.addEventListener('mouseout', self.onRemoveFocusWord)
    );
    const replacements = document.querySelectorAll(`.${O_POPUP_REPLACEMENT}`);
    replacements.forEach((rp) =>
      rp.addEventListener('click', self.onReplaceWord)
    );
    self.reloader = document.getElementById('reloader');
    if (self.reloader) {
      self.reloader.addEventListener('click', self.onRun);
    }
    self.runner = document.getElementById('runner');
    if (self.runner) {
      self.runner.addEventListener('click', self.onRun);
    }
    self.sizer = document.getElementById('sizer');
    if (self.sizer) {
      self.sizer.addEventListener('click', self.onResize);
    }
    self.mover = document.getElementById('mover');
    self.mover.addEventListener('mousedown', self.moverIsDown);
    self.collapse = document.getElementById('collapse');
    self.collapse.addEventListener('mousedown', self.closeOpenedCards);
    document.addEventListener('mouseup', self.onMouseUp);
    document.addEventListener('mousemove', self.onMouseMove);
  }

  private removeListeners() {
    const minicards = document.querySelectorAll(`.${O_GRAMMAR_ITEM}`);
    minicards.forEach((mc) => mc.removeEventListener('click', self.toggleCard));
    minicards.forEach((mc) =>
      mc.removeEventListener('mouseover', self.onFocusWord)
    );
    minicards.forEach((mc) =>
      mc.removeEventListener('mouseout', self.onRemoveFocusWord)
    );
    const replacements = document.querySelectorAll(`.${O_POPUP_REPLACEMENT}`);
    replacements.forEach((rp) =>
      rp.removeEventListener('click', self.onReplaceWord)
    );
    if (self.reloader) self.reloader.removeEventListener('click', self.onRun);
    if (self.runner) self.runner.removeEventListener('click', self.onRun);
    if (self.sizer) self.sizer.removeEventListener('click', self.onResize);
    if (self.mover)
      self.mover.removeEventListener('mousedown', self.moverIsDown);
    if (self.collapse)
      self.collapse.removeEventListener('mousedown', self.closeOpenedCards);
    document.removeEventListener('mouseup', self.onMouseUp);
    document.removeEventListener('mousemove', self.onMouseMove);
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

  private onMouseUp() {
    self.moverSelected = false;
  }

  private onMouseMove(e: any) {
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

  private onResize() {
    if (self.grammar.className.contains(O_GRAMMAR_RESIZED)) {
      self.grammar.classList.remove(O_GRAMMAR_RESIZED);
    } else {
      self.grammar.classList.add(O_GRAMMAR_RESIZED);
    }
  }

  private onFocusWord(e: any) {
    const p = e.currentTarget.dataset.position;
    const word = document.querySelector(`[position="${p}"]`);
    word.classList.add(O_HIGHLIGHT_FOCUSED);
  }

  private onRemoveFocusWord() {
    const words = document.querySelectorAll(`.${O_HIGHLIGHT_FOCUSED}`);
    words.forEach((w) => w.classList.remove(O_HIGHLIGHT_FOCUSED));
  }

  private onRun() {
    self.emitter.trigger('orthography:run');
  }

  private closeOpenedCards() {
    const minicards = document.querySelectorAll(`.${O_GRAMMAR_ITEM}`);
    minicards.forEach((mc) => mc.classList.remove(O_GRAMMAR_ITEM_OPENED));
  }

  private onReplaceWord(event: any) {
    self.emitter.trigger('orthography:replace', event);
    const { index } = event.currentTarget.dataset;
    const selectedItem = document.getElementById(`${O_GRAMMAR_ITEM}-${index}`);
    selectedItem.remove();
    if (!document.querySelectorAll(`.${O_GRAMMAR_ITEM}`).length) {
      self.removeLoader();
    }
  }
}
