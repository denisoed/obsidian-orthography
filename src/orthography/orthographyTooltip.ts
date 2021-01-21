import type { App } from 'obsidian';
import { Orthography } from './orthography';
import { OrthographySettings } from 'src/settings';
import {
  TOOLTIP_CSS_CLASS,
  TOOLTIP_VISIBLE_CSS_CLASS,
  TOOLTIP_HINT_CSS_CLASS,
  HIGHLIGHT_CSS_CLASS
} from './constants';

interface IOrthographyTooltip {
  init(): void;
}

export class OrthographyTooltip implements IOrthographyTooltip {
  private app: App;
  private settings: OrthographySettings;
  private tooltip: any;
  private orthography: Orthography;
  private emitter: any;

  constructor(app: App, settings: OrthographySettings, emitter: any) {
    this.app = app;
    this.settings = settings;
    this.emitter = emitter;
  }

  public init(): void {
    this.createTooltip();
    this.orthography = new Orthography(this.app, this.settings);
  }

  private createTooltip(): void {
    const tooltip = document.createElement('div');
    tooltip.classList.add(TOOLTIP_CSS_CLASS);
    document.body.appendChild(tooltip);
    document.addEventListener('mouseover', this.toggleTooltip.bind(this));
    this.tooltip = document.querySelector('.' + TOOLTIP_CSS_CLASS);
    this.tooltip.addEventListener('click', this.replaceWord.bind(this));
  }

  private setDataToTooltip(element: any): void {
    const data = JSON.parse(localStorage.getItem('obsidian-orthography'));
    const word = data.find((item: any) =>
      new RegExp('\\b' + (item.row + '-' + item.col) + '\\b').test(
        element.getAttribute('data-pos')
      )
        ? item
        : null
    );
    if (word && Object.prototype.hasOwnProperty.call(word, 's')) {
      this.appendHintButton(word);
    }
  }

  private toggleTooltip(event: any): void {
    if (event.type === 'mouseover') {
      if (event.target.className.includes(HIGHLIGHT_CSS_CLASS)) {
        this.tooltip.innerHTML = '';
        this.setDataToTooltip(event.target);
        this.tooltip.classList.add(TOOLTIP_VISIBLE_CSS_CLASS);
        this.tooltip.style.left = this.getLeftPos(event);
        this.tooltip.style.top = this.getTopPos(event);
      }
    }
    if (
      !event.target.className.includes(TOOLTIP_CSS_CLASS) &&
      !event.target.className.includes(HIGHLIGHT_CSS_CLASS)
    ) {
      this.tooltip.classList.remove(TOOLTIP_VISIBLE_CSS_CLASS);
      this.tooltip.innerHTML = '';
    }
  }

  private getLeftPos(event: any) {
    const word = event.target.getBoundingClientRect();
    if (word.x + this.tooltip.clientWidth + 10 < document.body.clientWidth) {
      return word.x + 'px';
    }
    return document.body.clientWidth + 5 - this.tooltip.clientWidth + 'px';
  }

  private getTopPos(event: any) {
    const word = event.target.getBoundingClientRect();
    if (
      word.y + this.tooltip.clientHeight + word.height <
      document.body.clientHeight
    ) {
      return word.y + word.height + 'px';
    }
    return document.body.clientHeight + 10 - this.tooltip.clientHeight + 'px';
  }

  private appendHintButton(hint: any) {
    if (hint && hint.s && hint.s.length) {
      hint.s.forEach((h: string) => {
        const button = document.createElement('button');
        button.classList.add(TOOLTIP_HINT_CSS_CLASS);
        button.setAttribute('data-pos', hint.row + '-' + hint.col);
        button.innerText = h;
        this.tooltip.appendChild(button);
      });
    }
  }

  private replaceWord(event: any) {
    if (event.target.className.includes(TOOLTIP_HINT_CSS_CLASS)) {
      const data = JSON.parse(localStorage.getItem('obsidian-orthography'));
      const word = data.find((pos: any) =>
        new RegExp('\\b' + (pos.row + '-' + pos.col) + '\\b').test(
          event.target.getAttribute('data-pos')
        )
          ? pos
          : null
      );

      if (!word) return;

      const activeLeaf: any = this.app.workspace.activeLeaf;
      const editor = activeLeaf.view.sourceMode.cmEditor;

      const doc = editor.getDoc();

      const from = {
        line: word.row,
        ch: word.col
      };
      const to = {
        line: word.row,
        ch: word.col + word.len
      };

      doc.replaceRange(event.target.innerText, from, to);

      // Updating data pos for highlight words
      this.orthography.updateDataPos();
    }
  }
}
