import { OrthographySettings } from '../settings';
import type { App } from 'obsidian';
import { O_HIGHLIGHT } from '../cssClasses';
import { API_URL_GRAMMAR } from '../config';
import { IPosition, IData } from 'src/interfaces';

interface IOrthographyWord {
  init(): void;
}

let self: any;

export class OrthographyWord implements IOrthographyWord {
  private app: App;
  private settings: OrthographySettings;
  private aborter: any;
  private highlightedWords: any;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public init(): void {
    self = this;
  }

  public destroy(): void {
    self.clearHighlightWords();
    if (self.aborter) {
      self.aborter.abort();
      self.aborter = null;
    }
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

  public highlightWords(editor: any, alerts: IData[]): void {
    this.clearHighlightWords();

    alerts.forEach((alert: any) => {
      const wordPosition = { begin: alert.begin, end: alert.end };
      this.highlightWord(editor, wordPosition);
    });
  }

  private highlightWord(
    editor: any,
    position: { begin: number; end: number }
  ): void {
    let ttl = 0;
    let line = 0;
    const { begin, end } = position;

    editor.eachLine((l: any) => {
      const s = ttl === 0 ? ttl : ttl + 1;
      const lineTextLength = l.text.length;
      ttl += lineTextLength;

      if (line > 0) {
        ttl++;
      }

      if (begin >= s && begin <= ttl) {
        const diff = ttl - lineTextLength;
        const posAdjA = begin - diff;
        const posAdjB = end - diff;
        this.highlightedWords = editor.markText(
          { line: line, ch: posAdjA },
          { line: line, ch: posAdjB },
          { className: O_HIGHLIGHT }
        );
      }
      line++;
    });
  }

  public replaceWord(editor: any, position: IPosition, word: string): void {
    if (!position) return;

    const doc = editor.getDoc();

    const from = {
      line: position.row,
      ch: position.col
    };
    const to = {
      line: position.row,
      ch: position.col + position.len
    };

    doc.replaceRange(word, from, to);
  }

  public clearHighlightWords(): void {
    if (typeof self.highlightedWords === 'object') {
      self.highlightedWords.clear();
    }
    const highlightWords = document.querySelectorAll(`.${O_HIGHLIGHT}`);
    highlightWords.forEach((span) => {
      span.removeAttribute('class');
    });
  }
}
