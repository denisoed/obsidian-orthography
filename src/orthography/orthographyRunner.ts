import { Notice, Events } from 'obsidian';
import { OrthographySettings } from 'src/settings';
import { OrthographyChecker } from './orthographyChecker';
import { OrthographyGrammar } from './orthographyGrammar';
import { O_RUNNER_ICON, O_RUNNER_ICON_CLEAR } from '../constants';
import type { App } from 'obsidian';
import {
  O_RUNNER,
  O_RUNNER_ACTIVE,
  O_RUNNER_CLEAR,
  O_RUNNER_HIDDEN
} from '../cssClasses';

interface IOrthographyRunner {
  init(): void;
}

export class OrthographyRunner implements IOrthographyRunner {
  private app: App;
  private settings: OrthographySettings;
  private isActive: boolean;
  private isCompleted: boolean;
  private orthography: OrthographyChecker;
  private grammar: OrthographyGrammar;
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
    this.grammar = new OrthographyGrammar(this.app, this.settings);
    this.orthography = new OrthographyChecker(this.app, this.settings);
    this.emitter.on('onUpdateWordPos', this.checkIfIsCompleted.bind(this));
  }

  public destroy(): void {
    this.emitter.off('onUpdateWordPos', this.checkIfIsCompleted.bind(this));
    this.runner.removeEventListener('click', this.onClickByBtn);
    this.orthography.clear();
    const runners = document.querySelectorAll('.' + O_RUNNER);
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
    const runner = document.querySelector('.' + O_RUNNER);
    runner.classList.remove(O_RUNNER_HIDDEN);
  }

  public hide(): void {
    const runner = document.querySelector('.' + O_RUNNER);
    runner.classList.add(O_RUNNER_HIDDEN);
  }

  private createRunner() {
    const runner = this.createButton(O_RUNNER_ICON);
    document.body.appendChild(runner);
  }

  private async setButtonClear() {
    this.isActive = true;
    const runner = document.querySelector('.' + O_RUNNER);

    if (!runner) return;

    const runnerIcon = document.querySelector('.' + O_RUNNER + ' span');
    runner.classList.add(O_RUNNER_ACTIVE);

    try {
      let response;
      if (this.settings.useGrammar) {
        try {
          response = await this.grammar.check();
        } catch (error) {
          this.returnButtonCheck();
          return new Notice(
            'No connection to the server. Please, check your internet connection.'
          );
        }
      }
      if (!this.settings.useGrammar) {
        response = await this.orthography.check();
      }
      this.isActive = false;
      runner.classList.remove(O_RUNNER_ACTIVE);
      if (response) {
        this.isCompleted = true;
        runnerIcon.textContent = O_RUNNER_ICON_CLEAR;
        runnerIcon.classList.add(O_RUNNER_CLEAR);
      } else {
        new Notice('No spelling errors found.');
      }
    } catch (error) {
      new Notice(error);
    }
  }

  private returnButtonCheck() {
    this.isActive = true;
    this.isCompleted = false;

    const runner = document.querySelector('.' + O_RUNNER);

    if (!runner) return;

    const runnerIcon = document.querySelector('.' + O_RUNNER + ' span');
    runnerIcon.classList.remove(O_RUNNER_CLEAR);
    runner.classList.add(O_RUNNER_ACTIVE);
    localStorage.removeItem('obsidian-orthography');

    // Delay for button animation
    setTimeout(() => {
      this.isActive = false;
      runnerIcon.textContent = O_RUNNER_ICON;
      runner.classList.remove(O_RUNNER_ACTIVE);
      this.orthography.clear();
      this.grammar.destroy();
    }, 250);
  }

  private createButton(text: string) {
    this.runner = document.createElement('button');
    const icon = document.createElement('span');
    icon.innerText = text;
    this.runner.classList.add(O_RUNNER);
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
