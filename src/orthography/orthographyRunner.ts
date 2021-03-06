import { Notice, Events } from 'obsidian';
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
  private onClickByBtn: any;
  private runner: any;

  constructor(app: App, settings: OrthographySettings, emitter: Events) {
    this.app = app;
    this.settings = settings;
    this.emitter = emitter;
  }

  public init(): void {
    this.createRunner();
    this.orthography = new OrthographyChecker(this.app, this.settings);
    this.emitter.on('onUpdateWordPos', this.checkIfIsCompleted.bind(this));
  }

  public destroy(): void {
    this.emitter.off('onUpdateWordPos', this.checkIfIsCompleted.bind(this));
    this.runner.removeEventListener('click', this.onClickByBtn);
    this.orthography.clear();
    const runners = document.querySelectorAll('.' + RUNNER_CSS_CLASS);
    if (runners) runners.forEach((runner: any) => runner.remove());
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

    if (!runner) return;

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

    if (!runner) return;

    const runnerIcon = document.querySelector('.' + RUNNER_CSS_CLASS + ' span');
    runnerIcon.classList.remove(RUNNER_CLEAR_CSS_CLASS);
    runner.classList.add(RUNNER_ACTIVE_CSS_CLASS);

    // Delay for button animation
    setTimeout(() => {
      this.isActive = false;
      runnerIcon.textContent = '⌘';
      runner.classList.remove(RUNNER_ACTIVE_CSS_CLASS);
      this.orthography.clear();
    }, 250);
  }

  private createButton(text: string) {
    this.runner = document.createElement('button');
    const icon = document.createElement('span');
    icon.innerText = text;
    this.runner.classList.add(RUNNER_CSS_CLASS);
    this.runner.appendChild(icon);
    this.onClickByBtn = this.run.bind(this);
    this.runner.addEventListener('click', this.onClickByBtn);
    return this.runner;
  }

  private checkIfIsCompleted(): void {
    if (this.isCompleted) {
      this.returnButtonCheck();
    }
  }
}
