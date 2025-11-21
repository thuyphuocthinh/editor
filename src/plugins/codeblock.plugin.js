import { EVENTS } from "../constants/index.js";

export class CodeBlock {
  constructor(container, eventBus) {
    this.container = container;
    this.eventBus = eventBus;
    this.activeBlock = null;
    this.listen();
  }

  listen() {
    this.eventBus.on(EVENTS.ACTION.CODE_BLOCK.ADD, this.addBlock.bind(this));
    this.eventBus.on(
      EVENTS.ACTION.CODE_BLOCK.REMOVE,
      this.removeBlock.bind(this)
    );
  }

  destroy() {
    this.activeBlock = null;
  }

  addBlock({ language = "plaintext" } = {}) {
    const wrapper = document.createElement("pre");
    const code = document.createElement("code");

    code.contentEditable = "true";
    code.classList.add(`language-${language}`);

    Object.assign(wrapper.style, {
      padding: "10px",
      background: "#f4f4f4",
      borderRadius: "6px",
      border: "1px solid #ccc",
      margin: "8px 0",
      display: "block",
    });

    wrapper.appendChild(code);
    this.container.appendChild(wrapper);
    this.activeBlock = code;

    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setActiveBlock(wrapper);
    });

    setTimeout(() => {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(code);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      code.focus();
    }, 0);
  }

  removeBlock() {
    if (!this.activeBlock) {
      alert("No code block selected!");
      return;
    }
    this.activeBlock.remove();
    this.activeBlock = null;
  }

  setActiveBlock(block) {
    if (this.activeBlock && this.activeBlock !== block) {
      this.activeBlock.style.outline = "none";
    }

    this.activeBlock = block;
    block.style.outline = "2px solid #007bff";
  }
}
