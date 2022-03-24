import { OrthographyEditor } from '../../src/orthography/orthographyEditor';

const _OrthographyEditor = new OrthographyEditor(null, null);

describe('OrthographyEditor', () => {
  it('should be defined', () => {
    expect(OrthographyEditor).toBeDefined();
  });

  describe('getColRow', () => {
    it('if not provide editor and originalWord args will return undefined', () => {
      const result = _OrthographyEditor.getColRow(undefined, undefined);
      expect(result).toBeUndefined();
    });
  });
});
