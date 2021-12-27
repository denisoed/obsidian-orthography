import { Plugin, Events, Notice } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import {
  OrthographyPopup,
  OrthographyToggler,
  OrthographyWord
} from './orthography';
import debounce from './orthography/helpers/debounce';

// Use self in events callbacks
let self: any;

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private popup: any;
  private toggler: any;
  private word: any;
  private emitter: any;
  private markers: any;
  private activeEditor: any;
  private hints: any;
  private debounceGetDataFunc = debounce(this.handleEvents.bind(this), 1000);
  private getDataFunc = debounce(this.handleEvents.bind(this), 0);

  async onload(): Promise<void> {
    // ------ Init -------- //
    self = this;
    this.emitter = new Events();

    const settings = new OrthographySettings(this, this.emitter);
    await settings.loadSettings();
    this.settings = settings;

    this.addSettingTab(new OrthographySettingTab(this.app, settings, this));

    this.initOrthographyToggler();
    this.initOrthographyPopup();
    this.initOrthographyWord();

    // ------- Events -------- //
    this.emitter.on('orthography:open', this.onPopupOpen);
    this.emitter.on('orthography:close', this.onPopupClose);
    this.emitter.on('orthography:run', this.getDataFunc);
    this.emitter.on('orthography:replace', this.onReplaceWord);
  }

  onunload(): void {
    this.emitter.off('orthography:open', this.onPopupOpen);
    this.emitter.off('orthography:close', this.onPopupClose);
    this.emitter.off('orthography:run', this.handleEvents);
    this.emitter.off('orthography:replace', this.onReplaceWord);
    this.toggler.destroy();
    this.popup.destroy();
    this.word.destroy();
    this.hints = null;
    this.markers = null;
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

  private async handleEvents() {
    if (!this.popup.created) return;
    this.activeEditor = this.getEditor();
    const text = this.activeEditor.getValue();
    this.word.destroy();
    this.popup.setLoader();
    this.markers = [];
    this.hints = await this.word.fetchData(text);
    if (this.hints && this.hints.alerts && this.hints.alerts.length) {
      this.markers = this.word.highlightWords(
        this.activeEditor,
        this.hints.alerts,
        'highlightText'
      );
      this.popup.update(this.hints);
    } else {
      new Notice('Spelling errors not found!');
      this.popup.removeLoader();
    }
  }

  private onPopupOpen() {
    self.popup.create();
  }

  private onPopupClose() {
    self.word.destroy();
    self.popup.destroy();
  }

  private onReplaceWord(event: any) {
    const index = event.target.getAttribute('data-index');
    const [row, col] = self.markers[index].attributes.position.split('-');
    const origWordLen = event.target.getAttribute('data-text').length;
    const newWord = event.target.innerText;
    self.word.replaceWord(
      self.activeEditor,
      {
        row: +row,
        col: +col,
        len: +origWordLen
      },
      newWord
    );
  }
}
