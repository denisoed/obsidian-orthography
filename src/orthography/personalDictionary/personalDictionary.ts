import type OrthographyPlugin from '../../main';
import { Notice } from 'obsidian';

export class PersonalDictionary {
  private data: { dictionary: string[] } = { dictionary: [] };
  private category: string = 'Misspelled';
  constructor(private plugin: OrthographyPlugin) {
    this.plugin = plugin;
  }
  async loadDictionary(): Promise<void> {
    const filePath = this.getDictionaryFilePath();

    try {
      if (await this.plugin.app.vault.adapter.exists(filePath)) {
        const storedData = await this.plugin.app.vault.adapter.read(filePath);
        const parsedData = JSON.parse(storedData);

        if (parsedData && Array.isArray(parsedData.dictionary)) {
          this.data.dictionary = parsedData.dictionary;
        } else {
          this.data.dictionary = [];
        }
      } else {
        this.data.dictionary = [];
        await this.saveDictionary();
      }
    } catch (error) {
      new Notice('Error loading personal dictionary');
    }
  }

  async addWord(word: string): Promise<void> {
    word = word.toLowerCase();

    if (!this.data.dictionary.includes(word)) {
      this.data.dictionary.push(word);
      await this.saveDictionary();
    }
  }

  filterAlerts(alerts: any[]): any[] {
    return alerts.filter((alert: any) => {
      if (alert && alert.text && alert.category) {
        if (alert.category === this.category) {
          return !this.containsWord(alert.text);
        }
      }
      return true;
    });
  }

  private containsWord(word: string): boolean {
    return this.data.dictionary.includes(word.toLowerCase());
  }

  private getDictionaryFilePath(): string {
    return `${this.plugin.app.vault.configDir}/plugins/obsidian-orthography/dictionary.json`;
  }

  private async saveDictionary(): Promise<void> {
    const filePath = this.getDictionaryFilePath();

    try {
      const dataToSave = JSON.stringify(
        { dictionary: this.data.dictionary },
        null,
        1
      );
      await this.plugin.app.vault.adapter.write(filePath, dataToSave);
    } catch (error) {
      new Notice('Error saving personal dictionary');
    }
  }
}