import {
  TOOLTIP_CSS_CLASS,
  TOOLTIP_VISIBLE_CSS_CLASS,
  HIGHLIGHT_CSS_CLASS
} from './constants';

interface IOrthographyTooltip {
  init(): void;
}

export class OrthographyTooltip
  implements IOrthographyTooltip {
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
    const hints = data.find((d: any) => word === d.word ? d : null);
    if (hints.hasOwnProperty('s')) {
      this.createHintButton(hints.s);
    }
  }

  private toggleTooltip(event: any): void {
    if (event.type === 'mouseover') {
      if (event.target.className.trim() === HIGHLIGHT_CSS_CLASS) {
        this.setDataToTooltip(event.target.innerText);
        this.tooltip.classList.add(TOOLTIP_VISIBLE_CSS_CLASS);
        this.tooltip.style.left = this.getLeftPos(event);
        this.tooltip.style.top = this.getTopPos(event);
      }
    }
    if (event.type === 'mouseout') {
      this.tooltip.classList.remove(TOOLTIP_VISIBLE_CSS_CLASS);
      this.tooltip.innerHTML = '';
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

  private createHintButton(hints: []) {
    hints.forEach((h: string) => {
      const hint = document.createElement('button');
      hint.innerText = h;
      this.tooltip.appendChild(hint);
    });
  }
}
