import { IData } from '../../interfaces';

const renderHints = (card: IData, index: number): string => {
  const { replacements, text, begin, highlightText } = card;
  if (card.category === 'Determiners') {
    return replacements
      .map((item: string) => {
        return `
          <span
            data-toreplace="${item}"
            data-index="${index}"
            data-position="${begin}"
            data-text="${text}"
            class="obsidian-orthography-word-to-replace obsidian-orthography-popup-replacement"
            title="Click to correct your spelling">
              <b>${item}</b>&nbsp${highlightText}
          </span>`;
      })
      .join('or');
  }
  if (card.category === 'Formatting' || card.category === 'BasicPunct') {
    return `
      <span
        data-position="${begin}"
        data-text="${text}"
        data-toreplace="${replacements[0]}"
        class="obsidian-orthography-word-to-replace obsidian-orthography-popup-hightligh--red">${
          highlightText || ''
        }
      </span>
    `;
  }
  if (card.category === 'Prepositions') {
    return replacements
      .map((item: string) => {
        return `
        <span
          data-toreplace="${item}"
          data-index="${index}"
          data-position="${begin}"
          data-text="${text}"
          class="obsidian-orthography-word-to-replace obsidian-orthography-popup-replacement"
          title="Click to correct your spelling"
        >
          <b>${item}</b>&nbsp${highlightText}
        </span>`;
      })
      .join('or');
  }
  return replacements
    .map((item: string) => {
      return `
        <span class="obsidian-orthography-popup-card--line-through">${highlightText}</span>
        <span
          data-toreplace="${item}"
          data-index="${index}"
          data-position="${begin}"
          data-text="${text}"
          class="obsidian-orthography-word-to-replace obsidian-orthography-popup-replacement"
          title="Click to correct your spelling"
        >
          ${item}
        </span>`;
    })
    .join('or');
};

const UIHints = (alerts: IData[]): string => {
  if (!alerts || !alerts.length) return '';
  return alerts
    .map((card: IData, index: number) => {
      const {
        impact,
        highlightText,
        minicardTitle,
        explanation,
        cardLayout,
        begin
      } = card;
      return `
          <div data-position="${begin}" id="obsidian-orthography-popup-item-${index}" class="obsidian-orthography-popup-item ${impact}">
            <div class="obsidian-orthography-popup-minicard">
              <div>${highlightText || ''}</div>
              ${
                minicardTitle
                  ? `<div class="obsidian-orthography-popup-item-sugg">${minicardTitle}</div>`
                  : ''
              }
              <div class="obsidian-orthography-popup-arrows">
                <svg width="10" viewBox="0 0 10 10"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
                <svg width="10" viewBox="0 0 10 10"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
              </div>
            </div>
            <div class="obsidian-orthography-popup-card">
              <div>${cardLayout.group || ''}</div>
              <div>
                ${renderHints(card, index)}
              </div>
              <div>${explanation || ''}</div>
            </div>
          </div>
        `;
    })
    .join('');
};

export default UIHints;
