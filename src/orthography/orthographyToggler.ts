import { Events } from 'obsidian';
import type { App } from 'obsidian';
import { OrthographySettings } from '../settings';
import { O_RUNNER_ICON, O_RUNNER_ICON_CLEAR } from '../constants';
import { O_RUNNER, O_RUNNER_HIDDEN, O_RUNNER_LOADING } from '../cssClasses';

interface IOrthographyToggler {
  init(): void;
}

let self: any;

export class OrthographyToggler implements IOrthographyToggler {
  private app: App;
  private settings: OrthographySettings;
  private emitter: any;
  private toggler: any;
  private showed: false;

  constructor(app: App, settings: OrthographySettings, emitter: Events) {
    this.app = app;
    this.settings = settings;
    this.emitter = emitter;
  }

  public init(): void {
    self = this;
    this.createButton(O_RUNNER_ICON);
  }

  public destroy(): void {
    this.removeLoading();
    this.toggler.removeEventListener('click', this.toggle);
    this.removeButton();
  }

  public toggle(): void {
    self.showed = !self.showed;
    if (self.showed) {
      self.updateButtonText(O_RUNNER_ICON_CLEAR);
      self.emitter.trigger('orthography:open');
    } else {
      self.updateButtonText(O_RUNNER_ICON);
      self.removeLoading();
      self.emitter.trigger('orthography:close');
    }
  }

  public hide(): void {
    const runner = document.querySelector('.' + O_RUNNER);
    runner.classList.add(O_RUNNER_HIDDEN);
  }

  public setLoading(): void {
    this.toggler.classList.add(O_RUNNER_LOADING);
  }

  public removeLoading(): void {
    this.toggler.classList.remove(O_RUNNER_LOADING);
  }

  public reset(): void {
    this.showed = false;
    this.removeLoading();
    this.updateButtonText(O_RUNNER_ICON);
  }

  private createButton(text: string) {
    this.toggler = document.createElement('button');
    const icon = document.createElement('span');
    icon.innerText = text;
    this.toggler.classList.add(O_RUNNER);
    this.toggler.appendChild(icon);
    document.body.appendChild(this.toggler);
    this.toggler.addEventListener('click', this.toggle);
  }

  private updateButtonText(text: string) {
    const toggler: HTMLElement = document.querySelector(`.${O_RUNNER} span`);
    if (toggler) toggler.innerText = text;
  }

  private removeButton() {
    const toggler: HTMLElement = document.querySelector(`.${O_RUNNER}`);
    if (toggler) toggler.remove();
  }
}
