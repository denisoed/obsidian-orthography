import { OrthographySettings } from '../settings';
import type { App } from 'obsidian';
import { O_HIGHLIGHT } from '../cssClasses';
import { IOriginalWord, IData } from 'src/interfaces';

interface IOrthographyEditor {
  init(): void;
}

let self: any;

export class OrthographyEditor implements IOrthographyEditor {
  private app: App;
  private settings: OrthographySettings;
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
  }

  public highlightWords(editor: any, alerts: IData[]): void {
    this.clearHighlightWords();

    alerts.forEach((alert: any) => {
      const textLength = alert.text.length || alert.highlightText.length;
      const originalWord = {
        begin: alert.begin,
        end: alert.end,
        len: textLength
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
      {
        className: O_HIGHLIGHT,
        attributes: {
          position: originalWord.begin
        }
      }
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

  private clearHighlightWords(): void {
    if (typeof self.highlightedWords === 'object') {
      self.highlightedWords.clear();
    }
    const highlightWords = document.querySelectorAll(`.${O_HIGHLIGHT}`);
    highlightWords.forEach((span) => {
      span.removeAttribute('class');
    });
  }
}
