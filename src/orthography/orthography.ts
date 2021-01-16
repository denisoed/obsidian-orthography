import { OrthographySettings } from 'src/settings';
import type { App } from 'obsidian';
import { API_URL } from '../config';
import {
  TOOLTIP_CSS_CLASS,
  TOOLTIP_VISIBLE_CSS_CLASS,
  HIGHLIGHT_CSS_CLASS,
  RUNNER_CSS_CLASS
} from './constants';

interface IOrthography {
  check(): void;
}

interface IOrthographyRunner {
  init(): void;
}

interface IOrthographyTooltip {
  init(): void;
}

export class Orthography implements IOrthography {
  private app: App;
  private settings: OrthographySettings;

  constructor(app: App, settings: OrthographySettings) {
    this.app = app;
    this.settings = settings;
  }

  public check(): void {
    this.validateText();
  }

  private async validateText() {
    const text = this.getEditortext();
    const formData = new FormData();
    formData.append('text', text);
    const validatedData = await this.postData(API_URL, formData);

    if (!validatedData.length) return false;

    const regex = this.createSearchQuery(validatedData);
    this.highlightWords(regex);
  }

  private getEditortext() {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const editor = activeLeaf.view.sourceMode.cmEditor;
    return editor.getValue();
  }

  private highlightWords(regex: RegExp): void {
    const activeLeaf: any = this.app.workspace.activeLeaf;
    const editor = activeLeaf.view.sourceMode.cmEditor;
    const searchQuery = new RegExp(regex);
    const cursor = editor.getSearchCursor(searchQuery);
    while (cursor.findNext()) {
      editor.markText(cursor.from(), cursor.to(), {
        className: HIGHLIGHT_CSS_CLASS
      });
    }
  }

  private createSearchQuery(list: []) {
    const words = list.map(function (item: any) {
      return item['word'];
    });
    const searchRequest = new RegExp(words.join('|'), 'gi');
    return searchRequest;
  }

  private async postData(url: string, formData: FormData) {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
    });
    return await response.json();
  }
}

export class OrthographyTooltip
  extends Orthography
  implements IOrthographyTooltip {
  private tooltip: any;

  public init(): void {
    this.createTooltip();
  }

  private createTooltip() {
    const tooltip = document.createElement('div');
    tooltip.classList.add(TOOLTIP_CSS_CLASS);
    document.body.appendChild(tooltip);
    this.tooltip = document.querySelector('.' + TOOLTIP_CSS_CLASS);
    document.onmouseover = document.onmouseout = this.toggleTooltip.bind(this);
  }

  private toggleTooltip(event: any): void {
    if (event.type === 'mouseover') {
      if (event.target.className.trim() === HIGHLIGHT_CSS_CLASS) {
        this.tooltip.classList.add(TOOLTIP_VISIBLE_CSS_CLASS);
        this.tooltip.style.left = this.getLeftPos(event);
        this.tooltip.style.top = this.getTopPos(event);
      }
    }
    if (event.type === 'mouseout') {
      this.tooltip.classList.remove(TOOLTIP_VISIBLE_CSS_CLASS);
    }
  }

  private getLeftPos(event: any) {
    if (
      event.pageX + this.tooltip.clientWidth + 10 <
      document.body.clientWidth
    ) {
      return event.pageX + 10 + 'px';
    }
    return document.body.clientWidth + 5 - this.tooltip.clientWidth + 'px';
  }

  private getTopPos(event: any) {
    if (
      event.pageY + this.tooltip.clientHeight + 10 <
      document.body.clientHeight
    ) {
      return event.pageY + 10 + 'px';
    }
    return document.body.clientHeight + 5 - this.tooltip.clientHeight + 'px';
  }
}

export class OrthographyRunner
  extends Orthography
  implements IOrthographyRunner {
  public init(): void {
    this.createRunner();
  }

  private createRunner() {
    const runner = document.createElement('button');
    runner.classList.add(RUNNER_CSS_CLASS);
    runner.innerText = '⌘';
    document.body.appendChild(runner);

    runner.addEventListener('click', this.runCheck.bind(this));
  }

  private runCheck() {
    this.check();
  }
}
