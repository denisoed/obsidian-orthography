import { App, Events } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import {
  O_POPUP,
  O_POPUP_ITEM,
  O_POPUP_RESIZED,
  O_POPUP_ITEM_OPENED,
  O_POPUP_REPLACEMENT,
  O_HIGHLIGHT,
  O_HIGHLIGHT_FOCUSED
} from '../cssClasses';
import { IAlert } from '../interfaces';

import UIBar from './UIElements/UIBar';

let self: any;

export class OrthographyPopup {
  private app: App;
  private settings: OrthographySettings;
  private emitter: any;
  private sizer: any;
  private mover: any;
  private reloader: any;
  private runner: any;
  private popupOffset: number[] = [0, 0];
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
    self.popup = document.createElement('div');
    self.popup.classList.add(O_POPUP);
    self.popup.id = O_POPUP;
    const bar = UIBar(null, false);
    self.popup.innerHTML = bar;
    document.body.appendChild(self.popup);
    self.setListeners();
  }

  public destroy(): void {
    self.created = false;
    self.removeListeners();
    if (self.popup) document.getElementById(O_POPUP).remove();
  }

  public update(data: IAlert, loading?: boolean): void {
    self.removeListeners();
    const bar = UIBar(data, loading);
    self.popup.innerHTML = bar;
    self.setListeners();
  }

  public setLoader(): void {
    this.update(null, true);
  }

  public removeLoader(): void {
    this.update(null, false);
  }

  private setListeners() {
    const highlightedWords = document.querySelectorAll(`.${O_HIGHLIGHT}`);
    highlightedWords.forEach((h) =>
      h.addEventListener('click', self.onOpenCard)
    );
    const minicards = document.querySelectorAll(`.${O_POPUP_ITEM}`);
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
    document.addEventListener('mouseup', self.onMouseUp);
    document.addEventListener('mousemove', self.onMouseMove);
  }

  private removeListeners() {
    const highlightedWords = document.querySelectorAll(`.${O_HIGHLIGHT}`);
    highlightedWords.forEach((h) =>
      h.removeEventListener('click', self.onOpenCard)
    );
    const minicards = document.querySelectorAll(`.${O_POPUP_ITEM}`);
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
    document.removeEventListener('mouseup', self.onMouseUp);
    document.removeEventListener('mousemove', self.onMouseMove);
  }

  private toggleCard(e: any): void {
    const opened = document.querySelectorAll(`.${O_POPUP_ITEM_OPENED}`);
    opened.forEach((o) => o.classList.remove(O_POPUP_ITEM_OPENED));
    if (e.currentTarget.classList.contains(O_POPUP_ITEM_OPENED)) {
      e.currentTarget.classList.remove(O_POPUP_ITEM_OPENED);
    } else {
      e.currentTarget.classList.add(O_POPUP_ITEM_OPENED);
    }
  }

  private moverIsDown(e: any) {
    self.moverSelected = true;
    self.popupOffset = [
      self.popup.offsetLeft - e.clientX,
      self.popup.offsetTop - e.clientY
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
      self.popup.style.left = `${mousePosition.x + self.popupOffset[0]}px`;
      self.popup.style.top = `${mousePosition.y + self.popupOffset[1]}px`;
    }
  }

  private onResize() {
    if (self.popup.className.contains(O_POPUP_RESIZED)) {
      self.popup.classList.remove(O_POPUP_RESIZED);
    } else {
      self.popup.classList.add(O_POPUP_RESIZED);
    }
  }

  private onFocusWord(e: any) {
    const p = e.currentTarget.dataset.position;
    const word = document.querySelector(`[position="${p}"]`);
    if (word) {
      word.classList.add(O_HIGHLIGHT_FOCUSED);
    }
  }

  private onRemoveFocusWord() {
    const words = document.querySelectorAll(`.${O_HIGHLIGHT_FOCUSED}`);
    words.forEach((w) => w.classList.remove(O_HIGHLIGHT_FOCUSED));
  }

  private onRun() {
    self.emitter.trigger('orthography:run');
  }

  private onReplaceWord(event: any) {
    self.emitter.trigger('orthography:replace', event);
    const { index } = event.currentTarget.dataset;
    const selectedItem = document.getElementById(`${O_POPUP_ITEM}-${index}`);
    selectedItem.remove();
    if (!document.querySelectorAll(`.${O_POPUP_ITEM}`).length) {
      self.removeLoader();
    }
  }

  private onOpenCard(event: any) {
    const { value: position } = event.currentTarget.attributes.position;
    const popup: any = document.querySelector(`.${O_POPUP}`);
    const opened = document.querySelectorAll(`.${O_POPUP_ITEM_OPENED}`);
    opened.forEach((o) => o.classList.remove(O_POPUP_ITEM_OPENED));
    const selected: any = document.querySelector(
      `[data-position="${position}"]`
    );
    selected.classList.add(O_POPUP_ITEM_OPENED);
    popup.scrollTop = selected.offsetTop;
  }
}
