import { Plugin, Events } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import { OrthographyGrammarly, OrthographyToggler } from './orthography';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private grammar: any;
  private emitter: any;
  private toggler: any;

  async onload(): Promise<void> {
    // ------ Init -------- //
    this.emitter = new Events();

    const settings = new OrthographySettings(this, this.emitter);
    await settings.loadSettings();
    this.settings = settings;

    this.addSettingTab(new OrthographySettingTab(this.app, settings, this));

    this.initOrthographyToggler();
    this.initOrthographyGrammarly();

    // ------- Events -------- //
    this.emitter.on('orthography:open', this.grammar.create);
    this.emitter.on('orthography:close', this.grammar.destroy);
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

  private initOrthographyGrammarly(): void {
    const { app, settings } = this;
    this.grammar = new OrthographyGrammarly(app, settings);
    this.grammar.init();
  }
}
