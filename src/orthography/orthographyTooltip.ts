import type { App, Events } from 'obsidian';
import { OrthographyChecker } from './orthographyChecker';
import { OrthographySettings } from 'src/settings';
import {
  O_TOOLTIP,
  O_TOOLTIP_VISIBLE,
  O_TOOLTIP_HINT,
  O_HIGHLIGHT
} from '../cssClasses';

interface IOrthographyTooltip {
  init(): void;
}

export class OrthographyTooltip implements IOrthographyTooltip {
  private app: App;
  private settings: OrthographySettings;
  private tooltip: any;
  private checker: OrthographyChecker;
  private emitter: any;
  private editor: any;
  private eventUdpateWordPos: any;
  private eventTooltipToggle: any;
  private eventReplaceWord: any;

  constructor(app: App, settings: OrthographySettings, emitter: Events) {
    this.app = app;
    this.settings = settings;
    this.emitter = emitter;
  }

  public init(): void {
    this.createTooltip();
    this.checker = new OrthographyChecker(this.app, this.settings);
    this.getEditor();
  }

  public destroy(): void {
    document.removeEventListener('mouseover', this.eventTooltipToggle);
    this.tooltip.removeEventListener('click', this.eventReplaceWord);
    const tooltips = document.querySelectorAll('.' + O_TOOLTIP);
    if (tooltips) tooltips.forEach((tooltip: any) => tooltip.remove());
  }

  private createTooltip(): void {
    const tooltip = document.createElement('div');
    tooltip.classList.add(O_TOOLTIP);
    document.body.appendChild(tooltip);
    this.eventTooltipToggle = this.toggleTooltip.bind(this);
    document.addEventListener('mouseover', this.eventTooltipToggle);
    this.tooltip = document.querySelector('.' + O_TOOLTIP);
    this.eventReplaceWord = this.replaceWord.bind(this);
    this.tooltip.addEventListener('click', this.eventReplaceWord);
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
      if (event.target.className.includes(O_HIGHLIGHT)) {
        this.setDataToTooltip(event.target);
        this.tooltip.classList.add(O_TOOLTIP_VISIBLE);
        this.tooltip.style.left = this.getLeftPos(event);
        this.tooltip.style.top = this.getTopPos(event);
      }
    }
    if (
      !event.target.className.includes(O_TOOLTIP) &&
      !event.target.className.includes(O_HIGHLIGHT)
    ) {
      this.tooltip.classList.remove(O_TOOLTIP_VISIBLE);
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
      this.tooltip.innerHTML = '';
      hint.s.forEach((h: string) => {
        const button = document.createElement('button');
        button.classList.add(O_TOOLTIP_HINT);
        button.setAttribute('data-pos', hint.row + '-' + hint.col);
        button.innerText = h;
        this.tooltip.appendChild(button);
      });
    }
  }

  private replaceWord(event: any) {
    if (event.target.className.includes(O_TOOLTIP_HINT)) {
      const data = JSON.parse(localStorage.getItem('obsidian-orthography'));
      const word = data.find((pos: any) =>
        new RegExp('\\b' + (pos.row + '-' + pos.col) + '\\b').test(
          event.target.getAttribute('data-pos')
        )
          ? pos
          : null
      );

      if (!word) return;

      this.editor.off('change', this.eventUdpateWordPos);

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
      this.checker.updateDataPos();
      this.editor.on('change', this.eventUdpateWordPos);
    }
  }

  private getEditor() {
    setTimeout(() => {
      const activeLeaf: any = this.app.workspace.activeLeaf;
      this.editor = activeLeaf.view.sourceMode.cmEditor;
      this.eventUdpateWordPos = this.onUpdateWordPos.bind(this);
      this.editor.on('change', this.eventUdpateWordPos);
    }, 1000);
  }

  private onUpdateWordPos() {
    this.emitter.trigger('onUpdateWordPos');
    this.checker.clear();
  }
}
