import type OrthographyPlugin from '../main';

interface SettingsData {
  displayRunner: boolean;
  language: string;
}

function getDefaultData(): SettingsData {
  return {
    displayRunner: true,
    language: 'en, ru, uk'
  };
}

export class OrthographySettings {
  private data: SettingsData;
  private callback: any;

  get displayRunner(): boolean {
    const { data } = this;
    return data.displayRunner;
  }

  set displayRunner(value: boolean) {
    const { data } = this;
    data.displayRunner = value;
    this.callback(this.data);
  }

  get language(): string {
    const { data } = this;
    return data.language;
  }

  set language(value: string) {
    const { data } = this;
    data.language = value;
    this.callback(this.data);
  }

  constructor(private plugin: OrthographyPlugin, callback: () => void) {
    this.data = getDefaultData();
    this.callback = callback;
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
