import { App } from 'obsidian';
import { HIGHLIGHT_CSS_CLASS } from '../../constants';

const createSearchQuery = (data: [], key: string) => {
  if (!data.length) return new RegExp(/^/gi);

  const words = data.map(function (item: any) {
    return item[key];
  });
  const searchRequest = new RegExp(words.join('|'), 'gi');
  return searchRequest;
}

const highlightWords = (app: App, data: any, key: string): void => {
  const markers = [];
  const activeLeaf: any = app.workspace.activeLeaf;
  const editor = activeLeaf.view.sourceMode.cmEditor;
  const searchQuery = new RegExp(createSearchQuery(data, key));
  const cursor = editor.getSearchCursor(searchQuery);
  while (cursor.findNext()) {
    const from = cursor.from();
    const to = cursor.to();
    markers.push(
      editor.markText(from, to, {
        className: HIGHLIGHT_CSS_CLASS,
        attributes: {
          'data-pos': from.line + '-' + from.ch
        }
      })
    );
  }
}

export default highlightWords;
