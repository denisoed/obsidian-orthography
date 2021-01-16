import { Plugin } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import {
  Orthography,
  OrthographyRunner,
  OrthographyTooltip
} from './orthography';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private orthography: any;

  async onload(): Promise<void> {
    const settings = new OrthographySettings(this);
    await settings.loadSettings();
    this.settings = settings;

    this.addSettingTab(new OrthographySettingTab(this.app, this, settings));

    this.initOrthography();

    this.initOrthographyTooltip();

    this.initOrthographyRunner();

    this.addCommand({
      id: 'check-orthography',
      name: 'Check Orthography',
      callback: () => this.orthography.check(),
      hotkeys: [
        {
          modifiers: ['Mod', 'Shift'],
          key: 'l'
        }
      ]
    });
  }

  private initOrthography() {
    let { orthography } = this;
    const { app, settings } = this;

    if (orthography) {
      return orthography;
    }

    orthography = new Orthography(app, settings);
    this.orthography = orthography;
    return orthography;
  }

  private initOrthographyTooltip(): void {
    const tooltip = new OrthographyTooltip();
    tooltip.init();
  }

  private initOrthographyRunner(): void {
    const { app, settings } = this;
    const runner = new OrthographyRunner(app, settings);
    runner.init();
  }
}
