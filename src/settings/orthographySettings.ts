import type OrthographyPlugin from '../main';

interface Config {
  // command to enable filtering of open editors
  editorListCommand: string;
  // command to enable filtering of file symbols
  symbolListCommand: string;
  // types of open views to hide from the suggestion list
  excludeViewTypes: string[];
}

export const DefaultConfig: Config = {
  editorListCommand: 'edt ',
  symbolListCommand: '@',
  excludeViewTypes: ['empty']
};

interface SettingsData {
  alwaysNewPaneForSymbols: boolean;
  language: string;
}

function getDefaultData(): SettingsData {
  return {
    alwaysNewPaneForSymbols: false,
    language: ''
  };
}

export class OrthographySettings {
  private data: SettingsData;

  get alwaysNewPaneForSymbols(): boolean {
    const { data } = this;
    return data.alwaysNewPaneForSymbols;
  }

  set alwaysNewPaneForSymbols(value: boolean) {
    const { data } = this;
    data.alwaysNewPaneForSymbols = value;
  }

  get language(): string {
    const { data } = this;
    return data.language;
  }

  set language(value: string) {
    const { data } = this;
    data.language = value;
  }

  constructor(private plugin: OrthographyPlugin) {
    this.data = getDefaultData();
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
