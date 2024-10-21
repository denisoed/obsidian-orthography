import { PersonalDictionary } from './personalDictionary';
import { OrthographyPopup } from '../orthographyPopup';
import { O_DICT_WORD_CHECKBOX } from '../../cssClasses';

interface IPersonalDictionaryTab {
  init(): void;
}

let self: any;

export class PersonalDictionaryTab implements IPersonalDictionaryTab {
  private dictionary: PersonalDictionary;
  private removeSelectedBtn: any;
  private selectAllBtn: any;
  private orthographyPopup: OrthographyPopup;

  constructor(
    orthographyPopup: OrthographyPopup,
    dictionary: PersonalDictionary
  ) {
    this.orthographyPopup = orthographyPopup;
    this.dictionary = dictionary;

    this.init();
  }

  public init(): void {
    self = this;
  }

  create() {
    self.setListeners();
  }

  destroy() {
    self.removeListeners();
  }

  update() {
    self.removeListeners();
    self.setListeners();
  }

  setListeners(): void {
    self.selectAllBtn = document.getElementById('select-all-button');
    if (self.selectAllBtn) {
      self.selectAllBtn.addEventListener(
        'click',
        self.onSelectAllCheckboxes.bind(self)
      );
    }

    self.removeSelectedBtn = document.getElementById('remove-selected-button');
    if (self.removeSelectedBtn) {
      self.removeSelectedBtn.addEventListener(
        'click',
        self.onRemoveSelected.bind(self)
      );
    }
  }

  removeListeners(): void {
    self.selectAllBtn = document.getElementById('select-all-button');
    if (self.selectAllBtn) {
      self.selectAllBtn.removeEventListener(
        'click',
        self.onSelectAllCheckboxes.bind(self)
      );
    }

    self.removeSelectedBtn = document.getElementById(
      'obsidian-orthography-remove-selected-button'
    );
    if (self.removeSelectedBtn) {
      self.removeSelectedBtn.removeEventListener(
        'click',
        self.onRemoveSelected.bind(self)
      );
    }
  }

  private onSelectAllCheckboxes() {
    const checkboxes = document.querySelectorAll(`.${O_DICT_WORD_CHECKBOX}`);
    const allChecked = Array.from(checkboxes).every(
      (checkbox: HTMLInputElement) => checkbox.checked
    );

    checkboxes.forEach((checkbox: HTMLInputElement) => {
      checkbox.checked = !allChecked;
    });
  }

  private onRemoveSelected() {
    const checkboxes = document.querySelectorAll(
      `.${O_DICT_WORD_CHECKBOX}:checked`
    );
    const wordsToRemove = Array.from(checkboxes).map(
      (checkbox: HTMLInputElement) => checkbox.value
    );
    self.dictionary.remove(wordsToRemove);
    self.orthographyPopup.update(null, false, true);
  }
}
