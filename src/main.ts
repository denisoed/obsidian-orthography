import { Plugin, Events, Notice } from 'obsidian';
import { OrthographySettings } from './settings';
import {
  OrthographyEditor,
  OrthographyPopup,
  OrthographyToggler
} from './orthography';
import debounce from './orthography/helpers/debounce';
import { sortAlerts, formatAlerts } from './orthography/helpers/formatters';
import { API_URL_GRAMMAR } from './config';
import { O_NOT_OPEN_FILE, O_SERVER_ERROR, O_NO_ERROR } from './constants';

// Use self in events callbacks
let self: any;

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private popup: any;
  private toggler: any;
  private editor: any;
  private emitter: any;
  private activeEditor: any;
  private aborter: any;
  private hints: any;
  private debounceGetDataFunc = debounce(this.onChangeText.bind(this), 500);
  private getDataFunc = debounce(this.onRunFromPopup.bind(this), 0);

  async onload(): Promise<void> {
    // ------ Init -------- //
    self = this;
    this.emitter = new Events();

    const settings = new OrthographySettings(this, this.emitter);
    await settings.loadSettings();
    this.settings = settings;

    // this.addSettingTab(new OrthographySettingTab(this.app, settings, this));

    this.initOrthographyToggler();
    this.initOrthographyPopup();
    this.initOrthographyEditor();

    // ------- Events -------- //
    this.emitter.on('orthography:open', this.onPopupOpen);
    this.emitter.on('orthography:close', this.onPopupClose);
    this.emitter.on('orthography:run', this.getDataFunc);
    this.emitter.on('orthography:replace', this.onReplaceWord);

    // NOTE: find a better way to do this
    // Listen to changes in the editor
    this.registerDomEvent(document, 'click', () => {
      if (!this.activeEditor) return;
      this.activeEditor.off('change', this.debounceGetDataFunc);
      this.activeEditor = this.getEditor();
      this.activeEditor.on('change', this.debounceGetDataFunc);
    });
  }

  onunload(): void {
    this.emitter.off('orthography:open', this.onPopupOpen);
    this.emitter.off('orthography:close', this.onPopupClose);
    this.emitter.off('orthography:run', this.onRunFromPopup);
    this.emitter.off('orthography:replace', this.onReplaceWord);
    if (this.activeEditor)
      this.activeEditor.off('change', this.debounceGetDataFunc);
    this.toggler.destroy();
    this.popup.destroy();
    this.editor.destroy();
    this.hints = null;
    this.activeEditor = null;
  }

  private initOrthographyToggler(): void {
    const { app, settings, emitter } = this;
    this.toggler = new OrthographyToggler(app, settings, emitter);
    this.toggler.init();
  }

  private initOrthographyPopup(): void {
    const { app, settings, emitter } = this;
    this.popup = new OrthographyPopup(app, settings, emitter);
    this.popup.init();
  }

  private initOrthographyEditor(): void {
    const { app, settings } = this;
    this.editor = new OrthographyEditor(app, settings);
    this.editor.init();
  }

  private getEditor() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const sourceMode = activeLeaf.view.sourceMode;
    return sourceMode ? sourceMode.cmEditor : null;
  }

  private async onChangeText() {
    if (!this.popup.created) return;
    this.runChecker();
  }

  private async onRunFromPopup() {
    if (!this.popup.created) return;
    this.editor.destroy();
    this.popup.setLoader();
    this.activeEditor = this.getEditor();
    if (this.activeEditor) {
      this.runChecker();
    } else {
      new Notice(O_NOT_OPEN_FILE);
      this.onPopupClose();
    }
  }

  private async runChecker() {
    this.toggler.setLoading();
    if (!this.activeEditor) return;
    const text = this.activeEditor.getValue();
    this.hints = await this.fetchData(text);
    if (this.hints instanceof TypeError) {
      this.popup.removeLoader();
      this.toggler.removeLoading();
      new Notice(O_SERVER_ERROR);
      return;
    }
    if (this.hints && this.hints.alerts && this.hints.alerts.length) {
      const alerts = formatAlerts(this.hints.alerts);
      this.editor.highlightWords(this.activeEditor, alerts);
      this.popup.update({
        alerts: sortAlerts(alerts)
      });
    } else {
      new Notice(O_NO_ERROR);
      this.popup.removeLoader();
    }
    this.toggler.removeLoading();
  }

  private onPopupOpen() {
    self.popup.create();
  }

  private onPopupClose() {
    self.editor.destroy();
    if (self.activeEditor)
      self.activeEditor.doc.getAllMarks().forEach((m: any) => m.clear());
    self.popup.destroy();
    self.toggler.reset();
    if (self.aborter) {
      self.aborter.abort();
      self.aborter = null;
    }
  }

  private onReplaceWord(event: any) {
    const origWordLen = event.currentTarget.dataset.text.length;
    const newWord = event.currentTarget.dataset.toreplace;
    const begin = event.currentTarget.dataset.begin;
    const end = begin + origWordLen;
    self.editor.replaceWord(
      self.activeEditor,
      {
        begin: +begin,
        end: +end,
        len: +origWordLen
      },
      newWord
    );
  }

  private async fetchData(text: string): Promise<JSON> {
    if (self.aborter) self.aborter.abort();
    self.popup.disable();

    self.aborter = new AbortController();
    const { signal } = self.aborter;

    const url: any = new URL(API_URL_GRAMMAR);
    const params: any = { text };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    try {
      const response = await fetch(url, {
        method: 'GET',
        signal
      });
      self.aborter = null;
      return await response.json();
    } catch (error) {
      return error;
    } finally {
      self.popup.enable();
    }
  }
}
