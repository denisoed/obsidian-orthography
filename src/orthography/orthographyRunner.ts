import { Notice } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import { OrthographyChecker } from './orthographyChecker';
import type { App } from 'obsidian';
import {
  RUNNER_CSS_CLASS,
  RUNNER_ACTIVE_CSS_CLASS,
  RUNNER_CLEAR_CSS_CLASS,
  RUNNER_HIDDEN_CSS_CLASS
} from '../constants';

interface IOrthographyRunner {
  init(): void;
}

export class OrthographyRunner implements IOrthographyRunner {
  private app: App;
  private settings: OrthographySettings;
  private isActive: boolean;
  private isCompleted: boolean;
  private orthography: OrthographyChecker;
  private emitter: any;

  constructor(app: App, settings: OrthographySettings, emitter: any) {
    this.app = app;
    this.settings = settings;
    this.emitter = emitter;
  }

  public init(): void {
    this.createRunner();
    this.orthography = new OrthographyChecker(this.app, this.settings);
  }

  public run(): void {
    if (!this.isCompleted) {
      if (!this.isActive) {
        this.setButtonClear();
      }
    } else {
      if (!this.isActive) {
        this.returnButtonCheck();
      }
    }
  }

  public show(): void {
    const runner = document.querySelector('.' + RUNNER_CSS_CLASS);
    runner.classList.remove(RUNNER_HIDDEN_CSS_CLASS);
  }

  public hide(): void {
    const runner = document.querySelector('.' + RUNNER_CSS_CLASS);
    runner.classList.add(RUNNER_HIDDEN_CSS_CLASS);
  }

  private createRunner() {
    const runner = this.createButton('⌘');
    document.body.appendChild(runner);
  }

  private setButtonClear() {
    this.isActive = true;

    const runner = document.querySelector('.' + RUNNER_CSS_CLASS);
    const runnerIcon = document.querySelector('.' + RUNNER_CSS_CLASS + ' span');
    runner.classList.add(RUNNER_ACTIVE_CSS_CLASS);

    this.orthography.check().then((hints: []) => {
      this.isActive = false;
      runner.classList.remove(RUNNER_ACTIVE_CSS_CLASS);
      if (hints && hints.length) {
        this.isCompleted = true;
        runnerIcon.textContent = '✕';
        runnerIcon.classList.add(RUNNER_CLEAR_CSS_CLASS);
      } else {
        new Notice('Orthography errors not found!');
      }
    });
  }

  private returnButtonCheck() {
    this.isActive = true;
    this.isCompleted = false;

    const runner = document.querySelector('.' + RUNNER_CSS_CLASS);
    const runnerIcon = document.querySelector('.' + RUNNER_CSS_CLASS + ' span');
    runnerIcon.classList.remove(RUNNER_CLEAR_CSS_CLASS);
    runner.classList.add(RUNNER_ACTIVE_CSS_CLASS);
    localStorage.removeItem('obsidian-orthography');

    // Delay for button animation
    setTimeout(() => {
      this.isActive = false;
      runnerIcon.textContent = '⌘';
      runner.classList.remove(RUNNER_ACTIVE_CSS_CLASS);
      this.orthography.clear();
    }, 250);
  }

  private createButton(text: string) {
    const runner = document.createElement('button');
    const icon = document.createElement('span');
    icon.innerText = text;
    runner.classList.add(RUNNER_CSS_CLASS);
    runner.appendChild(icon);
    runner.addEventListener('click', this.run.bind(this));
    return runner;
  }
}
