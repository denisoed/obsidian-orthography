import { Plugin } from 'obsidian';
import { OrthographySettings, OrthographySettingTab } from './settings';
import { Orthography } from 'src/orthography';

export default class OrthographyPlugin extends Plugin {
  private settings: OrthographySettings;
  private orthography: any;

  async onload(): Promise<void> {
    const settings = new OrthographySettings(this);
    await settings.loadSettings();
    this.settings = settings;

    this.addSettingTab(new OrthographySettingTab(this.app, this, settings));

    this.setOrthographyChecker();

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

  private setOrthographyChecker() {
    let { orthography } = this;
    const { app, settings } = this;

    if (orthography) {
      return orthography;
    }

    orthography = new Orthography(app, settings);
    this.orthography = orthography;
    return orthography;
  }
}
