const UIHintsFallback = (): string => {
  const hintsFallback = `
    <div class="obsidian-orthography-hints-fallback">
      <button id="runner">
        Run orthography check
      </button>
      <p>Alpha version</p>
    </div>
  `;

  return hintsFallback;
};

export default UIHintsFallback;
