import { Plugin, Events, Notice } from 'obsidian';
import { OrthographySettings } from './settings';
import {
  OrthographyPopup,
  OrthographyToggler,
  OrthographyWord
} from './orthography';
import debounce from './orthography/helpers/debounce';
import { sortAlerts, formatAlerts } from './orthography/helpers/formatters';

// Use self in events callbacks
let self: any;

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private popup: any;
  private toggler: any;
  private word: any;
  private emitter: any;
  private activeEditor: any;
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
    this.initOrthographyWord();

    // ------- Events -------- //
    this.emitter.on('orthography:open', this.onPopupOpen);
    this.emitter.on('orthography:close', this.onPopupClose);
    this.emitter.on('orthography:run', this.getDataFunc);
    this.emitter.on('orthography:replace', this.onReplaceWord);

    // NOTE: find a better way to do this
    // Listen to changes in the editor
    this.registerDomEvent(document, 'click', () => {
      if (this.activeEditor)
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
    this.word.destroy();
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

  private initOrthographyWord(): void {
    const { app, settings } = this;
    this.word = new OrthographyWord(app, settings);
    this.word.init();
  }

  private getEditor() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    return activeLeaf.view.sourceMode.cmEditor;
  }

  private async onChangeText() {
    if (!this.popup.created) return;
    this.runChecker();
  }

  private async onRunFromPopup() {
    if (!this.popup.created) return;
    this.word.destroy();
    this.popup.setLoader();
    this.activeEditor = this.getEditor();
    this.runChecker();
  }

  private async runChecker() {
    this.toggler.setLoading();
    const text = this.activeEditor.getValue();
    this.hints = await this.word.fetchData(text);
    if (this.hints && this.hints.alerts && this.hints.alerts.length) {
      const alerts = formatAlerts(this.hints.alerts);
      this.word.highlightWords(this.activeEditor, alerts);
      this.popup.update({
        alerts: sortAlerts(alerts)
      });
    } else {
      new Notice('Spelling errors not found!');
      this.popup.removeLoader();
    }
    this.toggler.removeLoading();
  }

  private onPopupOpen() {
    self.popup.create();
  }

  private onPopupClose() {
    self.word.destroy();
    self.popup.destroy();
  }

  private onReplaceWord(event: any) {
    const origWordLen = event.currentTarget.dataset.text.length;
    const newWord = event.currentTarget.dataset.toreplace;
    const begin = event.currentTarget.dataset.position;
    const end = begin + origWordLen;
    self.word.replaceWord(
      self.activeEditor,
      {
        begin: +begin,
        end: +end,
        len: +origWordLen
      },
      newWord
    );
  }
}
