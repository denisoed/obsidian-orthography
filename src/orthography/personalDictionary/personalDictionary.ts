import { App, Notice } from 'obsidian';

export class PersonalDictionary {
  private static instance: PersonalDictionary | null = null;
  private data: { dictionary: string[] } = { dictionary: [] };
  private category = 'Misspelled';
  private app: App;

  constructor(app: App) {
    this.app = app;
  }

  get dictionary(): string[] {
    return this.data.dictionary || [];
  }

  async loadDictionary(): Promise<void> {
    const filePath = this.getDictionaryFilePath();

    try {
      if (await this.app.vault.adapter.exists(filePath)) {
        const storedData = await this.app.vault.adapter.read(filePath);
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

  async remove(wordsToRemove: string[]): Promise<void> {
    this.data.dictionary = this.data.dictionary.filter((word) => {
      word = word.toLowerCase();
      return !wordsToRemove.includes(word);
    });
    await this.saveDictionary();
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
    return `${this.app.vault.configDir}/plugins/obsidian-orthography/dictionary.json`;
  }

  private async saveDictionary(): Promise<void> {
    const filePath = this.getDictionaryFilePath();

    try {
      const dataToSave = JSON.stringify(
        { dictionary: this.data.dictionary },
        null,
        1
      );
      await this.app.vault.adapter.write(filePath, dataToSave);
    } catch (error) {
      new Notice('Error saving personal dictionary');
    }
  }
}
