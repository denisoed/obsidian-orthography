import UIControls from './UIControls';
import { IAlert, IData } from '../../interfaces';

const UIBar = (data: IAlert): string => {
  const { alerts } = data;
  if (alerts && alerts.length) {
    const controls: string = UIControls();
    const cards: string = data.alerts
      .map((card: IData) => {
        const {
          impact,
          highlightText,
          minicardTitle,
          group,
          replacements,
          explanation,
          cardLayout
        } = card;
        return `
          <div class="orthography-grammar-item ${impact}">
            <div class="orthography-grammar-minicard">
              <div>${highlightText || ''}</div>
              ${
                minicardTitle
                  ? `<div class="orthography-grammar-item-sugg">${minicardTitle}</div>`
                  : ''
              }
              <div class="orthography-grammar-arrows">
                <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
                <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
              </div>
            </div>
            <div class="orthography-grammar-card">
              <div>${cardLayout.group || ''}</div>
              <div>
                <span class="${
                  group === 'Punctuation' || group === 'Style'
                    ? 'orthography-grammar-hightligh--red'
                    : ''
                }">${highlightText || ''}</span>
                ${
                  group !== 'Punctuation' &&
                  group !== 'Style' &&
                  replacements &&
                  replacements.length
                    ? `<span class="orthography-grammar-replacements">${replacements[0]}</span>`
                    : ''
                }
              </div>
              <div>${explanation || ''}</div>
            </div>
          </div>
        `;
      })
      .join('');
    return `${controls}${cards}`;
  }
  return '';
};

export default UIBar;
