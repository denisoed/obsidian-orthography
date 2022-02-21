const UIRunner = (text: string): string => {
  const runner = `
    <button class="obsidian-orthography-runner">
      <span>${text}</span>
    </button>
  `;

  return runner;
};

export default UIRunner;
