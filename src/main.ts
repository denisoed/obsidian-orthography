import { Plugin, Events } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import { OrthographyPopup, OrthographyToggler } from './orthography';
import debounce from './orthography/helpers/debounce';
import { API_URL_GRAMMAR } from './config';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private grammar: any;
  private emitter: any;
  private toggler: any;
  private activeEditor: any;
  private debounceFunc = debounce(this.onChange.bind(this), 1000);
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
    this.emitter.on('orthography:open', this.grammar.create);
    this.emitter.on('orthography:close', this.grammar.destroy);

    // ---- Get active editor ---- //
    // NOTE: find a better way to do this
    this.registerDomEvent(document, 'click', () => {
      if (this.activeEditor) this.activeEditor.off('change', this.debounceFunc);
      this.activeEditor = this.getEditor();
      this.activeEditor.on('change', this.debounceFunc);
    });
  }

  onunload(): void {
    this.emitter.off('orthography:open', this.grammar.create);
    this.emitter.off('orthography:close', this.grammar.destroy);
    this.toggler.destroy();
  }

  private initOrthographyToggler(): void {
    const { app, settings, emitter } = this;
    this.toggler = new OrthographyToggler(app, settings, emitter);
    this.toggler.init();
  }

  private initOrthographyPopup(): void {
    const { app, settings } = this;
    this.grammar = new OrthographyPopup(app, settings);
    this.grammar.init();
  }

  private getEditor() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    return activeLeaf.view.sourceMode.cmEditor;
  }

  private async onChange(editor: any) {
    this.grammar.setLoader();
    const text = editor.doc.getValue();
    const data = await this.getData(text);
    this.grammar.update(data);
  }

  private async getData(text: string) {
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
