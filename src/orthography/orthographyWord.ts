import { OrthographySettings } from '../settings';
import type { App } from 'obsidian';
import { O_HIGHLIGHT } from '../cssClasses';
import { API_URL_GRAMMAR } from '../config';
import { IOriginalWord, IData } from 'src/interfaces';

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
      const originalWord = {
        begin: alert.begin,
        end: alert.end,
        len: alert.text.length
      };
      this.highlightWord(editor, originalWord);
    });
  }

  private highlightWord(
    editor: any,
    originalWord: { begin: number; end: number; len: number }
  ): void {
    const colRow = this.getColRow(editor, originalWord);
    if (!colRow) return;
    const { col, row } = colRow;

    this.highlightedWords = editor.markText(
      { line: row, ch: col },
      { line: row, ch: col + originalWord.len },
      { className: O_HIGHLIGHT }
    );
  }

  public replaceWord(
    editor: any,
    originalWord: IOriginalWord,
    newWord: string
  ): void {
    if (!originalWord) return;
    const colRow = this.getColRow(editor, originalWord);
    if (!colRow) return;
    const { col, row } = colRow;

    const doc = editor.getDoc();

    const from = {
      line: row,
      ch: col
    };
    const to = {
      line: row,
      ch: col + originalWord.len
    };

    doc.replaceRange(newWord, from, to);
  }

  private getColRow(
    editor: any,
    originalWord: IOriginalWord
  ): { col: number; row: number } {
    let ttl = 0;
    let row = 0;
    let result = null;
    const { begin } = originalWord;

    editor.eachLine((l: any) => {
      const s = ttl === 0 ? ttl : ttl + 1;
      const lineTextLength = l.text.length;
      ttl += lineTextLength;

      if (row > 0) {
        ttl++;
      }
      if (begin >= s && begin <= ttl) {
        const diff = ttl - lineTextLength;
        const col = begin - diff;
        result = { col, row };
        return;
      }
      row++;
    });
    return result;
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
