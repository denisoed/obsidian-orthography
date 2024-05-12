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
  private editor: Editor;

  constructor(app: App, settings: OrthographySettings, editor: Editor) {
    this.app = app;
    this.settings = settings;
    this.editor = editor;
  }

  public init(): void {
    self = this;
  }

  public destroy(): void {
    this.clearHighlightWords();
  }

  public highlightWords(alerts: IData[]): void {
    this.clearHighlightWords();

    if (!this.editor || !alerts || alerts.length === 0) return;

    alerts.forEach((alert: any) => {
      const textLength = alert.text.length || alert.highlightText.length;
      const originalWord = {
        begin: alert.begin,
        end: alert.end,
        len: textLength
      };
      this.highlightWord(originalWord);
    });
  }

  private highlightWord(originalWord: {
    begin: number;
    end: number;
    len: number;
  }): void {
    if (!this.editor || !originalWord) return;
    const colRow = this.getColRow(originalWord);

    if (!colRow) return;
    const { col, row } = colRow;

    this.editor.addHighlights(
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

  public replaceWord(originalWord: IOriginalWord, newWord: string): void {
    if (!this.editor || !originalWord || !newWord) return;
    const colRow = this.getColRow(originalWord);
    if (!colRow) return;
    const { col, row } = colRow;

    const doc = this.editor.getDoc();

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

  getColRow(originalWord: IOriginalWord): IGetColRowResult {
    if (!this.editor || !originalWord) return;

    let ttl = 0;
    let row = 0;
    let result;
    const { begin } = originalWord;

    const lines = this.editor.lineCount();

    for (let i = 0; i < lines; i++) {
      const lineText = this.editor.getLine(i);
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
    const highlightWords = document.querySelectorAll(`.${O_HIGHLIGHT}`);
    highlightWords.forEach((span) => {
      this.editor.removeHighlights(span.className);
    });
  }
}
