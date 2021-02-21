import { moveIcon, collapseIcon, horizontalSizeIcon } from './UIIcons';

const UIBar = (data: any) => {
  if (data && data.alerts) {
    const controls: string = `
      <div class="orthography-grammar-controls">
        <div id="horizontalSizeIcon" class="orthography-grammar-horizontalSize" title="Change the size of the bar">${horizontalSizeIcon}</div>
        <div id="mover" class="orthography-grammar-mover" title="Move bar">${moveIcon}</div>
        <div id="collapse" class="orthography-grammar-collapse" title="Collapse opened cards">${collapseIcon}</div>
      </div>
    `;
    const cards: string = data.alerts.map((el: any) => {
      return `
          <div class="orthography-grammar-item ${el.impact}">
            <div class="orthography-grammar-minicard">
              <div>${el.highlightText || ''}</div>
              ${el.minicardTitle ? `<div class="orthography-grammar-item-sugg">${el.minicardTitle}</div>` : ''}
              <div class="orthography-grammar-arrows">
                <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
                <svg width="10" viewBox="0 0 10 10" class="_05a56408-icon-holder"><path d="M5 4.3L.85.14c-.2-.2-.5-.2-.7 0-.2.2-.2.5 0 .7L5 5.7 9.85.87c.2-.2.2-.5 0-.7-.2-.2-.5-.2-.7 0L5 4.28z" stroke="none" transform="translate(0 3) rotate(0)"></path></svg>
              </div>
            </div>
            <div class="orthography-grammar-card">
              <div>${el.cardLayout.group || ''}</div>
              <div>
                <span class="${(el.group === 'Punctuation' || el.group === 'Style') ? 'orthography-grammar-hightligh--red' : ''}">${el.highlightText || ''}</span>
                ${(el.group !== 'Punctuation' && el.group !== 'Style') &&
        el.replacements && el.replacements.length ?
        `<span class="orthography-grammar-replacements">${el.replacements[0]}</span>` : ''
      }
              </div>
              <div>${el.explanation || ''}</div>
            </div>
          </div>
        `;
    }).join('');
    return `${controls}${cards}`;
  }
  return '';
};

export default UIBar;
