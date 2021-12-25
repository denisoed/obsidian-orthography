const UIHintsFallback = (): string => {
  const hintsFallback = `
    <div class="obsidian-orthography-hints-fallback">
      <button id="runner">
        Run orthography check
      </button>
    </div>
  `;

  return hintsFallback;
};

export default UIHintsFallback;
