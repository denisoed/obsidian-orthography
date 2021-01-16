import { OrthographySettings } from 'src/settings';
import type { App } from 'obsidian';
import { API_URL } from '../config';

interface IOrthography {
  check(): void;
}

export class Orthography implements IOrthography {
  private app: App;
  private settings: OrthographySettings;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public check(): void {
    this.validateText();
  }

  private async validateText() {
    const text = this.getEditortext();
    const formData = new FormData();
    formData.append('text', text);
    formData.append('lang', 'en');
    const validatedData = await this.postData(API_URL, formData);
    const regex = this.createSearchQuery(validatedData[0]);
    this.highlightWords(regex);
  }

  private getEditortext() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const editor = activeLeaf.view.sourceMode.cmEditor;
    return editor.getValue();
  }

  private highlightWords(regex: RegExp): void {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const editor = activeLeaf.view.sourceMode.cmEditor;
    const searchQuery = new RegExp(regex);
    const cursor = editor.getSearchCursor(searchQuery);
    while (cursor.findNext()) {
      editor.markText(cursor.from(), cursor.to(), {
        className: 'obsidian-orthography-highlight'
      });
    }
  }

  private createSearchQuery(list: []) {
    const words = list.map(function (item: any) {
      return item['word'];
    });
    const searchRequest = new RegExp(words.join('|'), 'gi');
    return searchRequest;
  }

  private async postData(url: string, formData: FormData) {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
};
