import { OrthographyEditor } from '../../src/orthography/orthographyEditor';

const _OrthographyEditor = new OrthographyEditor(null, null);
const editor = {
  eachLine: () => {
    return;
  },
  getDoc: () => {
    return {
      replaceRange: () => {
        return;
      }
    };
  },
  markText: () => {
    return;
  }
};
const originalWord = {
  begin: 0,
  end: 5,
  len: 5
};

describe('OrthographyEditor', () => {
  it('should be defined', () => {
    expect(OrthographyEditor).toBeDefined();
  });

  describe('getColRow', () => {
    it('if not provide editor and originalWord args will return undefined', () => {
      const result = _OrthographyEditor.getColRow(undefined, undefined);
      expect(result).toBeUndefined();
    });

    it('if not provide originalWord args will return undefined', () => {
      const result = _OrthographyEditor.getColRow(editor, undefined);
      expect(result).toBeUndefined();
    });

    it('if not provide editor args will return undefined', () => {
      const result = _OrthographyEditor.getColRow(undefined, originalWord);
      expect(result).toBeUndefined();
    });
  });
});
