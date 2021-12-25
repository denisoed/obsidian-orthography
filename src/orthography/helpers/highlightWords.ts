import { O_HIGHLIGHT } from '../../cssClasses';

const createSearchQuery = (data: [], key: string) => {
  if (!data.length) return new RegExp(/^/gi);

  const words = data.map(function (item: any) {
    return item[key];
  });
  const searchRequest = new RegExp(words.join('|'), 'gi');
  return searchRequest;
};

const highlightWords = (editor: any, data: any, key: string): void => {
  const markers = [];
  const searchQuery = new RegExp(createSearchQuery(data, key));
  const cursor = editor.getSearchCursor(searchQuery);
  while (cursor.findNext()) {
    const from = cursor.from();
    const to = cursor.to();
    markers.push(
      editor.markText(from, to, {
        className: O_HIGHLIGHT,
        attributes: {
          'data-pos': from.line + '-' + from.ch
        }
      })
    );
  }
};

export default highlightWords;
