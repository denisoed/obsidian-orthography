import { OrthographySettings } from 'src/settings';
import type { App } from 'obsidian';
import { API_URL } from '../config';

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
        className: 'obsidian-orthography-highlight'
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

export class OrthographyTooltip implements IOrthographyTooltip {
  public init(): void {
    this.createTooltip();
  }

  private createTooltip() {
    const tooltips = document.querySelectorAll(
      '.obsidian-orthography-highlight'
    );
    for (let i = 0; i < tooltips.length; i++) {
      tooltips[i].addEventListener('mouseover', this.showTooltip);
    }

    const tooltip = document.createElement('div');
    tooltip.classList.add('tooltip');
    document.body.appendChild(tooltip);
  }

  private showTooltip(e: any) {
    const tooltip: any = document.querySelector('.tooltip');
    tooltip.style.left =
      e.pageX + tooltip.clientWidth + 10 < document.body.clientWidth
        ? e.pageX + 10 + 'px'
        : document.body.clientWidth + 5 - tooltip.clientWidth + 'px';
    tooltip.style.top =
      e.pageY + tooltip.clientHeight + 10 < document.body.clientHeight
        ? e.pageY + 10 + 'px'
        : document.body.clientHeight + 5 - tooltip.clientHeight + 'px';
  }
}

export class OrthographyRunner extends Orthography implements IOrthographyRunner {
  public init(): void {
    this.createRunner();
  }

  private createRunner() {
    const runner = document.createElement('button');
    runner.classList.add('obsidian-orthography-runner');
    runner.innerText = '⌘';
    document.body.appendChild(runner);

    runner.addEventListener('click', this.runCheck.bind(this));
  }

  private runCheck() {
    this.check();
  }
}
