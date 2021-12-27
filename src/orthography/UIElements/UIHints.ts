import { IData } from '../../interfaces';

const UIHints = (alerts: IData[]): string => {
  if (!alerts || !alerts.length) return '';
  return alerts
    .map((card: IData, index: number) => {
      const {
        impact,
        highlightText,
        minicardTitle,
        group,
        replacements,
        explanation,
        cardLayout,
        text
      } = card;
      return `
          <div class="obsidian-orthography-popup-item ${impact}">
            <div class="obsidian-orthography-popup-minicard">
              <div>${highlightText || ''}</div>
              ${
                minicardTitle
                  ? `<div class="obsidian-orthography-popup-item-sugg">${minicardTitle}</div>`
                  : ''
              }
              <div class="obsidian-orthography-popup-arrows">
                <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
                <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
              </div>
            </div>
            <div class="obsidian-orthography-popup-card">
              <div>${cardLayout.group || ''}</div>
              <div>
                <span class="${
                  group === 'Punctuation' || group === 'Style'
                    ? 'obsidian-orthography-popup-hightligh--red'
                    : ''
                }">${highlightText || ''}</span>
                ${
                  group !== 'Punctuation' &&
                  group !== 'Style' &&
                  replacements &&
                  replacements.length
                    ? `<span data-text="${text}" data-index="${index}" class="obsidian-orthography-popup-replacement">${replacements[0]}</span>`
                    : ''
                }
              </div>
              <div>${explanation || ''}</div>
            </div>
          </div>
        `;
    })
    .join('');
};

export default UIHints;
