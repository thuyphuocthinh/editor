import { EVENTS } from "../constants";
import { LinkUi } from "../ui/link.ui";

export class Link {
  constructor(editor, eventBus) {
    this.editor = editor;
    this.eventBus = eventBus;
    this.linkUi = null;
    this.savedSelections = [];
    this.init();
  }

  init() {
    this.linkUi = new LinkUi(
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          background: "#f9f9f9",
          borderRadius: "4px",
        },
      },
      this.eventBus
    );
    this.listen();
  }

  listen() {
    document.addEventListener("click", this.hide.bind(this));
    this.eventBus.on(EVENTS.ACTION.OPEN_LINK, (coordinates) => {
      this.saveSelection();
      this.render(coordinates);
    });

    this.eventBus.on(EVENTS.ACTION.SAVE_LINK, this.insertUrl.bind(this));
  }

  hide(e) {
    if (
      !document.querySelector("button[data-cmd='link']").contains(e.target) &&
      !this.linkUi.element.contains(e.target)
    ) {
      this.linkUi.unmount();
    }
  }

  render({ x, y }) {
    this.linkUi.element.style.position = "absolute";
    this.linkUi.element.style.top = `${y + 50}px`;
    this.linkUi.element.style.left = `${x + 50}px`;
    this.linkUi.mount(this.editor);
  }

  saveSelection() {
    const sel = window.getSelection();
    this.savedSelections = [];
    for (let i = 0; i < sel.rangeCount; i++) {
      this.savedSelections.push(sel.getRangeAt(i).cloneRange());
    }
  }

  insertUrl(url) {
    if (!this.savedSelections || this.savedSelections.length === 0) return;

    const selection = window.getSelection();
    selection.removeAllRanges();

    this.savedSelections.forEach((range) => selection.addRange(range));

    // Duyệt qua từng vùng đã lưu và chèn link
    for (let i = 0; i < this.savedSelections.length; i++) {
      const range = this.savedSelections[i];
      const selectedText = range.toString();

      if (!selectedText) continue;

      const link = document.createElement("a");
      link.href = url;
      link.textContent = selectedText;
      link.target = "_blank";

      // Chèn link thay cho text được bôi đen
      range.deleteContents();
      range.insertNode(link);
    }

    // Bỏ vùng bôi đen sau khi xong
    selection.removeAllRanges();
  }
}
