import { Plugin, Events } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import { OrthographyRunner, OrthographyTooltip, OrthographyGrammar } from './orthography';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private runner: any;
  private tooltip: any;
  private grammar: any;
  private emitter: any;

  async onload(): Promise<void> {
    // ------ Init -------- //
    this.emitter = new Events();

    const settings = new OrthographySettings(this, this.emitter);
    await settings.loadSettings();
    this.settings = settings;

    this.addSettingTab(new OrthographySettingTab(this.app, settings, this));

    if (!settings.useGrammar) this.initOrthographyTooltip();

    if (settings.displayRunner) this.initOrthographyRunner();

    // if (settings.useGrammar) this.initOrthographyGrammar();

    // ------- Events -------- //
    this.emitter.on('onUpdateSettings', this.onUpdateSettings.bind(this));

    this.addCommand({
      id: 'check-orthography',
      name: 'Check Orthography',
      callback: () => this.runner.run(),
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 'l'
        }
      ]
    });
  }

  onunload(): void {
    this.emitter.off('onUpdateSettings', this.onUpdateSettings.bind(this));
    this.runner.destroy();
    this.tooltip.destroy();
  }

  private onUpdateSettings(data: any) {
    if (data.displayRunner) {
      if (!this.runner) {
        this.initOrthographyRunner();
      } else {
        this.runner.show();
      }
    } else {
      this.runner.hide();
    }
  }

  private initOrthographyTooltip(): void {
    const { app, settings, emitter } = this;
    this.tooltip = new OrthographyTooltip(app, settings, emitter);
    this.tooltip.init();
  }

  private initOrthographyRunner(): void {
    const { app, settings, emitter } = this;
    this.runner = new OrthographyRunner(app, settings, emitter);
    this.runner.init();
  }

  private initOrthographyGrammar(): void {
    const { app, settings } = this;
    this.grammar = new OrthographyGrammar(app, settings);
    this.grammar.init();
  }
}
