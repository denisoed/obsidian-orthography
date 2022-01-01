import { moveIcon, collapseIcon, horizontalSizeIcon } from './UIIcons';

const UIControls = (hasData: boolean): string => {
  return `
      <div class="obsidian-orthography-popup-controls">
        <div id="sizer" class="obsidian-orthography-popup-horizontalSize" title="Change the size of the bar">${horizontalSizeIcon}</div>
        ${
          hasData
            ? '<button id="reloader" class="obsidian-orthography-popup-reload" title="Restart the orthography checker">Reload</button>'
            : ''
        }
        <div id="mover" class="obsidian-orthography-popup-mover" title="Move bar">${moveIcon}</div>
        <div id="collapse" class="obsidian-orthography-popup-collapse" title="Collapse opened cards">${collapseIcon}</div>
      </div>
    `;
};

export default UIControls;
