import { Orthography } from './orthography';
import { RUNNER_CSS_CLASS } from './constants';

interface IOrthographyRunner {
  init(): void;
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
