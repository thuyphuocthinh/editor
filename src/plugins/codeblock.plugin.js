import { EVENTS } from "../constants/events.const";

export class CodeBlock {
  constructor(container, eventBus) {
    this.container = container;
    this.eventBus = eventBus;
    this.activeBlock = null; // lưu code block đang chọn
    this.listen();
  }

  listen() {
    this.eventBus.on(EVENTS.ACTION.CODE_BLOCK.ADD, this.addBlock.bind(this));
    this.eventBus.on(
      EVENTS.ACTION.CODE_BLOCK.REMOVE,
      this.removeBlock.bind(this)
    );
  }

  addBlock({ language = "plaintext" } = {}) {
    console.log("add code block");
    const wrapper = document.createElement("pre");
    const code = document.createElement("code");

    // cấu trúc block code
    wrapper.contentEditable = "false"; // ngăn người dùng gõ ngoài vùng <code>
    code.contentEditable = "true";
    code.classList.add(`language-${language}`);
    code.textContent = "// Type your code here...";

    Object.assign(wrapper.style, {
      padding: "10px",
      background: "#f4f4f4",
      borderRadius: "6px",
      fontFamily: "monospace",
      border: "1px solid #ccc",
      margin: "8px 0",
      display: "block",
    });

    wrapper.appendChild(code);
    this.container.appendChild(wrapper);

    this.activeBlock = wrapper;

    // Cho phép click chọn code block
    wrapper.addEventListener("click", (e) => {
      e.stopPropagation();
      this.setActiveBlock(wrapper);
    });
  }

  removeBlock() {
    if (!this.activeBlock) {
      alert("No code block selected!");
      return;
    }

    this.activeBlock.remove();
    this.eventBus.emit(EVENTS.CODE_BLOCK.REMOVED, {
      element: this.activeBlock,
    });
    this.activeBlock = null;
  }

  setActiveBlock(block) {
    // bỏ chọn block cũ
    if (this.activeBlock && this.activeBlock !== block) {
      this.activeBlock.style.outline = "none";
    }

    this.activeBlock = block;
    block.style.outline = "2px solid #007bff";
  }
}
