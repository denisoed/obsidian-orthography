import type { Events } from 'obsidian';
import type OrthographyPlugin from '../main';

interface SettingsData {
  displayRunner: boolean;
  useGrammar: boolean;
  language: string;
}

function getDefaultData(): SettingsData {
  return {
    displayRunner: true,
    useGrammar: false,
    language: 'en, ru, uk'
  };
}

export class OrthographySettings {
  private data: SettingsData;
  private emitter: any;

  constructor(private plugin: OrthographyPlugin, emitter: Events) {
    this.data = getDefaultData();
    this.emitter = emitter;
  }

  get displayRunner(): boolean {
    const { data } = this;
    return data.displayRunner;
  }

  set displayRunner(value: boolean) {
    const { data } = this;
    data.displayRunner = value;
    this.emitter.trigger('onUpdateSettings', this.data);
  }

  get useGrammar(): boolean {
    const { data } = this;
    return data.useGrammar;
  }

  set useGrammar(value: boolean) {
    const { data } = this;
    data.useGrammar = value;
    this.emitter.trigger('onUpdateSettings', this.data);
  }

  get language(): string {
    const { data } = this;
    return data.language;
  }

  set language(value: string) {
    const { data } = this;
    data.language = value;
    this.emitter.trigger('onUpdateSettings', this.data);
  }

  async loadSettings(): Promise<void> {
    const { plugin } = this;
    this.data = Object.assign(getDefaultData(), await plugin.loadData());
  }

  async saveSettings(): Promise<void> {
    const { plugin, data } = this;
    if (plugin && data) {
      await plugin.saveData(data);
    }
  }
}
