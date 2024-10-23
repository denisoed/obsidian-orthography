const UIDictionary = (dictionary: string[]): string => {
  if (!dictionary.length) {
    return `<p class="obsidian-orthography-dictionary-empty">Your personal dictionary is empty.</p>`;
  }

  return `
    <div class="obsidian-orthography-dictionary-container">
      <h2 class="obsidian-orthography-dictionary-title">Your Personal Dictionary</h2>
      <div class="obsidian-orthography-dictionary-button-container">
        <button id="select-all-button" class="obsidian-orthography-dictionary-button">Select All</button>
        <button id="remove-selected-button" class="obsidian-orthography-dictionary-button">Remove</button>
      </div>
      <div class="obsidian-orthography-dictionary-list">
        ${dictionary
          .map(
            (word, index) => `
          <div class="obsidian-orthography-dictionary-item">
            <div class="obsidian-orthography-dictionary-word-text">
              <input type="checkbox" class="obsidian-orthography-dictionary-word-checkbox" id="word-${index}" value="${word}">
              <label for="word-${index}">${word}</label>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
  `;
};

export default UIDictionary;
