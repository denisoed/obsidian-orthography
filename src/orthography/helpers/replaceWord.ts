import type { App } from 'obsidian';

/**
 * Replace word by position
 * @param app - Obsidian App import { App } from 'obsidian';
 * @param position - Word position in editor { row: number, col: number }
 * @param word - New word
 */
const replaceWord = (app: App, position: any, word: string): void => {
  if (!position) return;

  const activeLeaf: any = app.workspace.activeLeaf;
  const editor = activeLeaf.view.sourceMode.cmEditor;

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
};

export default replaceWord;
