const UIRunner = (text: string) => {
  const runner = `
    <button class="obsidian-orthography-runner">
      <span class="">${text}</span>
    </button>
  `;

  return runner;
};

export default UIRunner;