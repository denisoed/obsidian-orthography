import { App } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import { API_URL_SPELLER } from '../config';
import { HIGHLIGHT_CSS_CLASS } from '../constants';
import highlightWords from './helpers/highlightWords';

interface IOrthographyChecker {
  check(): void;
}

export class OrthographyChecker implements IOrthographyChecker {
  private app: App;
  private settings: OrthographySettings;
  private markers: any = [];

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public check(): Promise<any> {
    return this.validateText();
  }

  public clear(): void {
    this.clearHighlightWords();
  }

  public getHintsFromServer(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const text = this.getEditorText();
      const formData = new FormData();
      formData.append('text', text);
      this.postData(API_URL_SPELLER, formData)
        .then((hintsData) => {
          localStorage.setItem(
            'obsidian-orthography',
            JSON.stringify(hintsData)
          );
          resolve(hintsData);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private validateText() {
    return new Promise<any>((resolve, reject) => {
      this.getHintsFromServer()
        .then((hints) => {
          if (hints && hints.length) {
            highlightWords(this.app, hints, 'word');
          }
          resolve(hints);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getEditorText() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const editor = activeLeaf.view.sourceMode.cmEditor;
    return editor.getValue();
  }

  public updateDataPos(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.getHintsFromServer()
        .then((hints) => {
          if (hints && hints.length) {
            this.markers.forEach((marker: any) => marker.clear());
            const regex = this.createSearchQuery(hints);
            const activeLeaf: any = this.app.workspace.activeLeaf;
            const editor = activeLeaf.view.sourceMode.cmEditor;
            const searchQuery = new RegExp(regex);
            const cursor = editor.getSearchCursor(searchQuery);
            while (cursor.findNext()) {
              const from = cursor.from();
              const to = cursor.to();
              this.markers.push(
                editor.markText(from, to, {
                  attributes: {
                    'data-pos': from.line + '-' + from.ch
                  }
                })
              );
            }
          }
          resolve(hints);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private clearHighlightWords() {
    const highlightWords = document.querySelectorAll('.' + HIGHLIGHT_CSS_CLASS);
    highlightWords.forEach((span) => {
      span.removeAttribute('class');
    });
    this.markers.forEach((marker: any) => marker.clear());
  }

  private createSearchQuery(list: []) {
    if (!list.length) return new RegExp(/^/gi);

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
}
