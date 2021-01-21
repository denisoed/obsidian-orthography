import { Plugin } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import { OrthographyRunner, OrthographyTooltip } from './orthography';
import Dispatcher from 'src/dispatcher/dispatcher';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private runner: any;
  private emitter: any;

  async onload(): Promise<void> {
    const settings = new OrthographySettings(
      this,
      this.onUpdateSettings.bind(this)
    );
    await settings.loadSettings();
    this.settings = settings;

    this.emitter = new Dispatcher();

    this.addSettingTab(new OrthographySettingTab(this.app, this, settings));

    this.initOrthographyTooltip();

    if (settings.displayRunner) this.initOrthographyRunner();

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
    const tooltip = new OrthographyTooltip(app, settings, emitter);
    tooltip.init();
  }

  private initOrthographyRunner(): void {
    const { app, settings, emitter } = this;
    this.runner = new OrthographyRunner(app, settings, emitter);
    this.runner.init();
  }
}
