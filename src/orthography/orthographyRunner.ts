import { Orthography } from './orthography';
import { RUNNER_CSS_CLASS, RUNNER_ACTIVE_CSS_CLASS } from './constants';

interface IOrthographyRunner {
  init(): void;
}

export class OrthographyRunner
  extends Orthography
  implements IOrthographyRunner {
  private isActive: boolean = false;

  public init(): void {
    this.createRunner();
  }

  private createRunner() {
    const runner = document.createElement('button');
    const icon = document.createElement('span');
    icon.innerText = '⌘';
    runner.classList.add(RUNNER_CSS_CLASS);
    runner.appendChild(icon);
    document.body.appendChild(runner);

    runner.addEventListener('click', this.runCheck.bind(this));
  }
  
  private runCheck() {
    if (!this.isActive) {
      this.isActive = true;
      const runner = document.querySelector('.' + RUNNER_CSS_CLASS);
      runner.classList.add(RUNNER_ACTIVE_CSS_CLASS);
      this.check().then(() => {
        this.isActive = false;
        runner.classList.remove(RUNNER_ACTIVE_CSS_CLASS);
      });
    }
  }
}
