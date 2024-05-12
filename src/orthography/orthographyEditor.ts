import { OrthographySettings } from '../settings';
import type { App, Editor } from 'obsidian';
import { O_HIGHLIGHT } from '../cssClasses';
import { IOriginalWord, IData } from 'src/interfaces';

interface IOrthographyEditor {
  init(): void;
}

interface IGetColRowResult {
  col: number;
  row: number;
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

  public highlightWords(editor: Editor, alerts: IData[]): void {
    this.clearHighlightWords();

    if (!editor || !alerts || alerts.length === 0) return;

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
    editor: Editor,
    originalWord: { begin: number; end: number; len: number }
  ): void {
    if (!editor || !originalWord) return;
    const colRow = this.getColRow(editor, originalWord);

    if (!colRow) return;
    const { col, row } = colRow;

    console.log(col, row);

    editor.addHighlights(
      [
        {
          from: {
            line: row,
            ch: col
          },
          to: {
            line: row,
            ch: col + originalWord.len
          }
        }
      ],
      `${O_HIGHLIGHT} begin-${originalWord.begin}`
    );
  }

  public replaceWord(
    editor: Editor,
    originalWord: IOriginalWord,
    newWord: string
  ): void {
    if (!editor || !originalWord || !newWord) return;
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

  getColRow(editor: Editor, originalWord: IOriginalWord): IGetColRowResult {
    if (!editor || !originalWord) return;

    let ttl = 0;
    let row = 0;
    let result;
    const { begin } = originalWord;

    const lines = editor.lineCount();

    for (let i = 0; i < lines; i++) {
      const lineText = editor.getLine(i);
      const s = ttl === 0 ? ttl : ttl + 1;
      const lineTextLength = lineText.length;
      ttl += lineTextLength;

      if (row > 0) {
        ttl++;
      }
      if (begin >= s && begin <= ttl) {
        const diff = ttl - lineTextLength;
        const col = begin - diff;
        result = { col, row };
      }
      row++;
    }
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
