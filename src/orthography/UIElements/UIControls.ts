import { horizontalSizeIcon } from './UIIcons';

const UIControls = (hasData: boolean): string => {
  return `
      <div class="obsidian-orthography-popup-controls">
        <div id="sizer" class="obsidian-orthography-popup-horizontalSize" title="Change the size of the popup">${horizontalSizeIcon}</div>
        ${
          hasData
            ? '<button id="reloader" class="obsidian-orthography-popup-reload" title="Restart the orthography checker">Reload</button>'
            : ''
        }
        <div id="closer" class="obsidian-orthography-popup-close" title="Close popup">✕</div>
      </div>
    `;
};

export default UIControls;
