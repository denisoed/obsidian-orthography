import { Plugin, Events } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import { OrthographyPopup, OrthographyToggler } from './orthography';
import debounce from './orthography/helpers/debounce';
import { API_URL_GRAMMAR } from './config';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private popup: any;
  private emitter: any;
  private toggler: any;
  private activeEditor: any;
  private debounceGetDataFunc = debounce(this.handleEvents.bind(this), 1000);
  private getDataFunc = debounce(this.handleEvents.bind(this), 0);
  private aborter: any;

  async onload(): Promise<void> {
    // ------ Init -------- //
    this.emitter = new Events();

    const settings = new OrthographySettings(this, this.emitter);
    await settings.loadSettings();
    this.settings = settings;

    this.addSettingTab(new OrthographySettingTab(this.app, settings, this));

    this.initOrthographyToggler();
    this.initOrthographyPopup();

    // ------- Events -------- //
    this.emitter.on('orthography:open', this.popup.create);
    this.emitter.on('orthography:close', this.popup.destroy);
    this.emitter.on('orthography:run', this.getDataFunc);

    // ---- Get active editor ---- //
    // NOTE: find a better way to do this
    this.registerDomEvent(document, 'click', () => {
      if (this.activeEditor)
        this.activeEditor.off('change', this.debounceGetDataFunc);
      this.activeEditor = this.getEditor();
      this.activeEditor.on('change', this.debounceGetDataFunc);
    });
  }

  onunload(): void {
    this.emitter.off('orthography:open', this.popup.create);
    this.emitter.off('orthography:close', this.popup.destroy);
    this.emitter.of('orthography:run', this.handleEvents);
    this.toggler.destroy();
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

  private getEditor() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    return activeLeaf.view.sourceMode.cmEditor;
  }

  private async handleEvents() {
    if (!this.popup.created) return;
    this.popup.setLoader();
    const text = this.activeEditor.getValue();
    const data = await this.fetchData(text);
    this.popup.update(data);
  }

  private async fetchData(text: string) {
    if (this.aborter) this.aborter.abort();

    this.aborter = new AbortController();
    const { signal } = this.aborter;

    const url: any = new URL(API_URL_GRAMMAR);
    const params: any = { text };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    const response = await fetch(url, {
      method: 'GET',
      signal
    });
    this.aborter = null;
    return await response.json();
  }
}
