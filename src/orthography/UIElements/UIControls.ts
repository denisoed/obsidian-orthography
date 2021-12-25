import { moveIcon, collapseIcon, horizontalSizeIcon } from './UIIcons';

const UIControls = (): string => {
  return `
      <div class="orthography-grammar-controls">
        <div id="horizontalSizeIcon" class="orthography-grammar-horizontalSize" title="Change the size of the bar">${horizontalSizeIcon}</div>
        <div id="mover" class="orthography-grammar-mover" title="Move bar">${moveIcon}</div>
        <div id="collapse" class="orthography-grammar-collapse" title="Collapse opened cards">${collapseIcon}</div>
      </div>
    `;
};

export default UIControls;
