import { Orthography } from './orthography';
import { RUNNER_CSS_CLASS, RUNNER_ACTIVE_CSS_CLASS, RUNNER_CLEAR_CSS_CLASS } from './constants';

interface IOrthographyRunner {
  init(): void;
}

export class OrthographyRunner
  extends Orthography
  implements IOrthographyRunner {
  private isActive: boolean = false;
  private isCompleted: boolean = false;

  public init(): void {
    this.createRunner();
  }

  private createRunner() {
    const runner = this.createButton('⌘');
    document.body.appendChild(runner);
  }
  
  private run() {
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

  private setButtonClear() {
    this.isActive = true;
    this.isCompleted = true;

    const runner = document.querySelector('.' + RUNNER_CSS_CLASS);
    const runnerIcon = document.querySelector('.' + RUNNER_CSS_CLASS + ' span');
    runner.classList.add(RUNNER_ACTIVE_CSS_CLASS);

    this.check().then(() => {
      this.isActive = false;
      runnerIcon.textContent = '✕';
      runnerIcon.classList.add(RUNNER_CLEAR_CSS_CLASS);
      runner.classList.remove(RUNNER_ACTIVE_CSS_CLASS);
    });
  }

  private returnButtonCheck() {
    this.isActive = true;
    this.isCompleted = false;
    
    const runner = document.querySelector('.' + RUNNER_CSS_CLASS);
    const runnerIcon = document.querySelector('.' + RUNNER_CSS_CLASS + ' span');
    runnerIcon.classList.remove(RUNNER_CLEAR_CSS_CLASS);
    runner.classList.add(RUNNER_ACTIVE_CSS_CLASS);

    // Delay for button animation
    setTimeout(() => {
      this.isActive = false;
      runnerIcon.textContent = '⌘';
      runner.classList.remove(RUNNER_ACTIVE_CSS_CLASS);
      this.clear();
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
