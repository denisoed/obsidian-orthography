const UIControls = (hasData: boolean): string => {
  return `
      <div class="obsidian-orthography-popup-controls">
        <div id="dictionary-opener" class="obsidian-orthography-popup-controls-item" title="See your personal dictionary">📓</div>
        ${
          hasData
            ? '<div id="reloader" class="obsidian-orthography-popup-controls-item" title="Restart the orthography checker">↻</div>'
            : '<div id="checker" class="obsidian-orthography-popup-controls-item obsidian-orthography-popup-run" title="Run the orthography checker">▶</div>'
        }
        <div id="closer" class="obsidian-orthography-popup-controls-item obsidian-orthography-popup-close" title="Close popup">✕</div>
      </div>
    `;
};

export default UIControls;
