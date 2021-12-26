import { OrthographySettings } from '../settings';
import type { App } from 'obsidian';
import { O_HIGHLIGHT } from '../cssClasses';
import { API_URL_GRAMMAR } from '../config';

interface IOrthographyData {
  init(): void;
}

let self: any;

export class OrthographyData implements IOrthographyData {
  private app: App;
  private settings: OrthographySettings;
  private markers: any[] = [];
  private aborter: any;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public init(): void {
    self = this;
  }

  public destroy(): void {
    self.clearHighlightWords();
  }

  public async fetchData(text: string): Promise<JSON> {
    if (self.aborter) self.aborter.abort();

    self.aborter = new AbortController();
    const { signal } = self.aborter;

    const url: any = new URL(API_URL_GRAMMAR);
    const params: any = { text };
    Object.keys(params).forEach((key) =>
      url.searchParams.append(key, params[key])
    );
    const response = await fetch(url, {
      method: 'GET',
      signal
    });
    self.aborter = null;
    return await response.json();
  }

  public highlightWords(editor: any, data: any, key: string): void {
    const searchQuery = new RegExp(self.createSearchQuery(data, key));
    const cursor = editor.getSearchCursor(searchQuery);
    while (cursor.findNext()) {
      const from = cursor.from();
      const to = cursor.to();
      self.markers.push(
        editor.markText(from, to, {
          className: O_HIGHLIGHT
        })
      );
    }
  }

  public clearHighlightWords(): void {
    const highlightWords = document.querySelectorAll(`.${O_HIGHLIGHT}`);
    highlightWords.forEach((span) => {
      span.removeAttribute('class');
    });
    self.markers.forEach((marker: any) => marker.clear());
  }

  private createSearchQuery(data: [], key: string): RegExp {
    if (!data.length) return new RegExp(/^/gi);

    const words = data.map(function (item: any) {
      return item[key];
    });
    const searchRequest = new RegExp(words.join('|'), 'gi');
    return searchRequest;
  }
}
