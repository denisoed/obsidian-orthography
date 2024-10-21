import { App, Events, Notice } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import {
  O_POPUP,
  O_POPUP_DISABLED,
  O_POPUP_CONTROLS,
  O_POPUP_ITEM,
  O_POPUP_RESIZED,
  O_POPUP_ITEM_OPENED,
  O_POPUP_WORD_TO_REPLACE,
  O_HIGHLIGHT_FOCUSED,
  O_POPUP_IGNORE_BUTTON
} from '../cssClasses';
import { O_NOT_OPEN_FILE } from '../constants';
import { IAlert } from '../interfaces';

import UIBar from './UIElements/UIBar';
import {
  PersonalDictionary,
  PersonalDictionaryTab
} from './personalDictionary';

let self: any;

export class OrthographyPopup {
  private app: App;
  private settings: OrthographySettings;
  private emitter: any;
  private sizer: any;
  private mover: any;
  private closer: any;
  private reloader: any;
  private runner: any;
  private checker: any;
  private dictionaryOpener: any;
  private popupOffset: number[] = [0, 0];
  private moverSelected = false;
  private created = false;
  private personalDictionary: PersonalDictionary;
  private personalDictionaryTab: PersonalDictionaryTab;

  constructor(
    app: App,
    settings: OrthographySettings,
    emitter: Events,
    personalDictionary: PersonalDictionary
  ) {
    this.app = app;
    this.settings = settings;
    this.emitter = emitter;
    this.personalDictionary = personalDictionary;
    this.personalDictionaryTab = new PersonalDictionaryTab(
      this,
      personalDictionary
    );
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
    self.personalDictionaryTab.destroy();
    const popup = document.getElementById(O_POPUP);
    if (popup) popup.remove();
  }

  public update(
    data: IAlert,
    loading?: boolean,
    showDictionary: boolean = false
  ): void {
    self.removeListeners();
    const dictionary = this.personalDictionary
      ? this.personalDictionary.dictionary
      : [];
    const bar = UIBar(data, loading, showDictionary, dictionary);
    self.popup.innerHTML = bar;
    self.setListeners();
    showDictionary
      ? self.personalDictionaryTab.update()
      : self.personalDictionaryTab.destroy();
  }

  public setLoader(): void {
    this.update(null, true);
  }

  public removeLoader(): void {
    this.update(null, false);
  }

  public disable(): void {
    const hints = document.querySelector(`#${O_POPUP}`);
    if (hints) {
      hints.classList.add(O_POPUP_DISABLED);
    }
  }

  public enable(): void {
    const hints = document.querySelector(`#${O_POPUP}`);
    if (hints) {
      hints.classList.remove(O_POPUP_DISABLED);
    }
  }

  private setListeners() {
    const minicards = document.querySelectorAll(`.${O_POPUP_ITEM}`);
    minicards.forEach((mc) => mc.addEventListener('click', self.onClickByHint));
    minicards.forEach((mc) =>
      mc.addEventListener('mouseover', self.onFocusWord)
    );
    minicards.forEach((mc) =>
      mc.addEventListener('mouseout', self.onRemoveFocusWord)
    );
    const replacements = document.querySelectorAll(
      `.${O_POPUP_WORD_TO_REPLACE}`
    );
    replacements.forEach((rp) =>
      rp.addEventListener('click', self.onReplaceWord)
    );
    const ignoreButtons = document.querySelectorAll(
      `.${O_POPUP_IGNORE_BUTTON}`
    );
    ignoreButtons.forEach((button) =>
      button.addEventListener('click', self.onIgnore)
    );
    self.reloader = document.getElementById('reloader');
    if (self.reloader) {
      self.reloader.addEventListener('click', self.onRun);
    }
    self.dictionaryOpener = document.getElementById('dictionary-opener');
    if (self.dictionaryOpener) {
      self.dictionaryOpener.addEventListener('click', self.onOpenDictionary);
    }
    self.runner = document.getElementById('runner');
    if (self.runner) {
      self.runner.addEventListener('click', self.onRun);
    }
    self.checker = document.getElementById('checker');
    if (self.checker) {
      self.checker.addEventListener('click', self.onRun);
    }
    self.sizer = document.getElementById('sizer');
    if (self.sizer) {
      self.sizer.addEventListener('click', self.onResize);
    }
    self.closer = document.getElementById('closer');
    if (self.closer) {
      self.closer.addEventListener('click', self.onClose);
    }
    self.mover = document.querySelector(`.${O_POPUP_CONTROLS}`);
    if (self.mover) {
      self.mover.addEventListener('mousedown', self.moverIsDown);
    }
    document.addEventListener('mouseup', self.onMouseUp);
    document.addEventListener('mousemove', self.onMouseMove);
  }

  private removeListeners() {
    const minicards = document.querySelectorAll(`.${O_POPUP_ITEM}`);
    minicards.forEach((mc) =>
      mc.removeEventListener('click', self.onClickByHint)
    );
    minicards.forEach((mc) =>
      mc.removeEventListener('mouseover', self.onFocusWord)
    );
    minicards.forEach((mc) =>
      mc.removeEventListener('mouseout', self.onRemoveFocusWord)
    );
    const replacements = document.querySelectorAll(
      `.${O_POPUP_WORD_TO_REPLACE}`
    );
    replacements.forEach((rp) =>
      rp.removeEventListener('click', self.onReplaceWord)
    );
    const ignoreButtons = document.querySelectorAll(
      `.${O_POPUP_IGNORE_BUTTON}`
    );
    ignoreButtons.forEach((button) =>
      button.removeEventListener('click', self.onIgnore)
    );
    if (self.reloader) self.reloader.removeEventListener('click', self.onRun);
    if (self.dictionaryOpener)
      self.dictionaryOpener.removeEventListener('click', self.onOpenDictionary);
    if (self.checker) self.checker.removeEventListener('click', self.onRun);
    if (self.runner) self.runner.removeEventListener('click', self.onRun);
    if (self.sizer) self.sizer.removeEventListener('click', self.onResize);
    if (self.closer) self.closer.removeEventListener('click', self.onClose);
    if (self.mover)
      self.mover.removeEventListener('mousedown', self.moverIsDown);
    document.removeEventListener('mouseup', self.onMouseUp);
    document.removeEventListener('mousemove', self.onMouseMove);
  }

  private onClickByHint(e: any): void {
    const opened = document.querySelectorAll(`.${O_POPUP_ITEM_OPENED}`);
    opened.forEach((o) => o.classList.remove(O_POPUP_ITEM_OPENED));
    if (e.currentTarget.classList.contains(O_POPUP_ITEM_OPENED)) {
      e.currentTarget.classList.remove(O_POPUP_ITEM_OPENED);
    } else {
      e.currentTarget.classList.add(O_POPUP_ITEM_OPENED);
    }

    const begin = e.currentTarget.dataset.begin;
    if (begin) {
      self.scrollToWord(begin);
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

  private onClose() {
    self.emitter.trigger('orthography:close');
  }

  private onFocusWord(e: any) {
    const begin = e.currentTarget.dataset.begin;
    const word = document.querySelector(`.begin-${begin}`);
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
    if (selectedItem) selectedItem.remove();
    if (!document.querySelectorAll(`.${O_POPUP_ITEM}`).length) {
      self.removeLoader();
    }
  }

  private onIgnore(event: any) {
    self.emitter.trigger('orthography:ignore', event);
    const { index } = event.currentTarget.dataset;
    const selectedItem = document.getElementById(`${O_POPUP_ITEM}-${index}`);
    if (selectedItem) selectedItem.remove();
    if (!document.querySelectorAll(`.${O_POPUP_ITEM}`).length) {
      self.removeLoader();
    }
  }

  private onOpenDictionary() {
    self.update(null, false, true);
  }

  private onOpenCard(event: any) {
    const { value: begin } = event.currentTarget.attributes.begin;
    const popup: any = document.querySelector(`.${O_POPUP}`);
    const opened = document.querySelectorAll(`.${O_POPUP_ITEM_OPENED}`);
    opened.forEach((o) => o.classList.remove(O_POPUP_ITEM_OPENED));
    const selected: any = document.querySelector(`[data-begin="${begin}"]`);
    selected.classList.add(O_POPUP_ITEM_OPENED);
    popup.scrollTop = selected.offsetTop;
  }

  private scrollToWord(begin: number) {
    const activeEditor = self.getEditor();
    if (activeEditor) {
      activeEditor.scrollTo(0, +begin - 300);
    } else {
      self.onClose();
      new Notice(O_NOT_OPEN_FILE);
    }
  }

  private getEditor() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const sourceMode = activeLeaf.view.sourceMode;
    if (!sourceMode) return null;
    return activeLeaf.view.sourceMode.cmEditor;
  }
}
