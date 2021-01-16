import {
  TOOLTIP_CSS_CLASS,
  TOOLTIP_VISIBLE_CSS_CLASS,
  TOOLTIP_HINT_CSS_CLASS,
  HIGHLIGHT_CSS_CLASS
} from './constants';

interface IOrthographyTooltip {
  init(): void;
}

export class OrthographyTooltip implements IOrthographyTooltip {
  private tooltip: any;

  public init(): void {
    this.createTooltip();
  }

  private createTooltip(): void {
    const tooltip = document.createElement('div');
    tooltip.classList.add(TOOLTIP_CSS_CLASS);
    document.body.appendChild(tooltip);
    this.tooltip = document.querySelector('.' + TOOLTIP_CSS_CLASS);
    document.onmouseover = document.onmouseout = this.toggleTooltip.bind(this);
  }

  private setDataToTooltip(word: string): void {
    const data = JSON.parse(localStorage.getItem('obsidian-orthography'));
    const hints = data.find((d: any) => (word === d.word ? d : null));
    if (hints.hasOwnProperty('s')) {
      this.appendHintButton(hints.s);
    }
  }

  private toggleTooltip(event: any): void {
    if (event.type === 'mouseover') {
      if (event.target.className.trim() === HIGHLIGHT_CSS_CLASS) {
        this.tooltip.innerHTML = '';
        this.setDataToTooltip(event.target.innerText);
        this.tooltip.classList.add(TOOLTIP_VISIBLE_CSS_CLASS);
        this.tooltip.style.left = this.getLeftPos(event);
        this.tooltip.style.top = this.getTopPos(event);
      }
    }
    if (
      !event.target.className.trim().includes(TOOLTIP_CSS_CLASS) &&
      event.target.className.trim() !== HIGHLIGHT_CSS_CLASS
    ) {
      this.tooltip.classList.remove(TOOLTIP_VISIBLE_CSS_CLASS);
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

  private appendHintButton(hints: []) {
    hints.forEach((h: string) => {
      const hint = document.createElement('button');
      hint.classList.add(TOOLTIP_HINT_CSS_CLASS);
      hint.innerText = h;
      this.tooltip.appendChild(hint);
    });
  }
}
