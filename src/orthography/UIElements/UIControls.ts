import { moveIcon, collapseIcon, horizontalSizeIcon } from './UIIcons';

const UIControls = (hasData: boolean): string => {
  return `
      <div class="obsidian-orthography-grammar-controls">
        <div id="horizontalSizeIcon" class="obsidian-orthography-grammar-horizontalSize" title="Change the size of the bar">${horizontalSizeIcon}</div>
        ${
          hasData
            ? '<button id="reloader" class="obsidian-orthography-grammar-reload" title="Reload">Reload</button>'
            : ''
        }
        <div id="mover" class="obsidian-orthography-grammar-mover" title="Move bar">${moveIcon}</div>
        <div id="collapse" class="obsidian-orthography-grammar-collapse" title="Collapse opened cards">${collapseIcon}</div>
      </div>
    `;
};

export default UIControls;
