import { COMMANDS, EVENTS, IDS } from "../constants";
import { ToolbarV2 } from "../ui";
import { $ } from "../utils";

export class Toolbar {
  constructor(eventBus) {
    this.toolbarUi = null;
    this.eventBus = eventBus;
    this.init();
  }

  init() {
    this.toolbarUi = new ToolbarV2.Toolbar({}, this.eventBus);
    this.listen();
  }

  listen() {
    this.eventBus.on(EVENTS.FORMAT.CLICK, this.formatInline.bind(this));
    this.eventBus.on(EVENTS.ACTION.CLICK, this.formatBlock.bind(this));
    this.eventBus.on(EVENTS.ACTION.PREVIEW, this.preview);
    this.eventBus.on(EVENTS.ACTION.RESET, this.reset);
    this.eventBus.on(EVENTS.ACTION.CLEAR, this.clear);
    this.eventBus.on(EVENTS.COMMANDS.TRIGGER, this.formatInline.bind(this));
  }

  formatInline(elementName) {
    const sel = window.getSelection();
    if (!sel.rangeCount) return;

    const range = sel.getRangeAt(0);
    const content = range.extractContents();
    const el = document.createElement(elementName);

    el.appendChild(content);
    range.insertNode(el);

    range.setStartAfter(el);
    range.setEndAfter(el);
    sel.removeAllRanges();
    sel.addRange(range);

    this.eventBus.emit(EVENTS.FORMAT.DONE);
  }

  formatBlock(elementName) {
    const editor = document.querySelector(`#${IDS.editorContentable}`);
    const sel = window.getSelection();

    // Không có selection => chèn block trống
    if (!sel.rangeCount) {
      const el = document.createElement(elementName);
      el.innerHTML = "<br>";
      editor.appendChild(el);

      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);

      this.eventBus.emit(EVENTS.FORMAT.DONE);
      return;
    }

    const range = sel.getRangeAt(0);

    // Selection ngoài editor => append block ở cuối
    if (!editor.contains(range.commonAncestorContainer)) {
      const el = document.createElement(elementName);
      el.innerHTML = "<br>";
      editor.appendChild(el);

      const newRange = document.createRange();
      newRange.selectNodeContents(el);
      newRange.collapse(true);

      sel.removeAllRanges();
      sel.addRange(newRange);

      this.eventBus.emit(EVENTS.FORMAT.DONE);
      return;
    }

    // Selection hợp lệ => wrap selected contents
    const content = range.extractContents();
    const el = document.createElement(elementName);

    // LIST (ul / ol)
    if (elementName === "ul" || elementName === "ol") {
      const children = Array.from(content.childNodes);
      children.forEach((node) => {
        const text = node.textContent.trim();
        if (!text) return;

        const li = document.createElement("li");
        li.textContent = text;
        el.appendChild(li);
      });

      if (el.childNodes.length === 0) {
        const li = document.createElement("li");
        li.innerHTML = "<br>";
        el.appendChild(li);
      }
    } else {
      // NORMAL BLOCK (p, h1, blockquote, etc.)
      el.appendChild(content);
    }

    // Insert block element back into editor
    range.insertNode(el);

    // Move caret into the block
    const newRange = document.createRange();
    newRange.selectNodeContents(el);
    newRange.collapse(true);

    sel.removeAllRanges();
    sel.addRange(newRange);

    this.eventBus.emit(EVENTS.FORMAT.DONE);
  }

  preview() {
    const previewText = $(`#${IDS.previewText}`);
    const previewHtml = $(`#${IDS.previewHtml}`);
    const editor = $(`#${IDS.editorContentable}`);
    if (previewText && previewHtml && editor) {
      previewHtml.textContent = editor.innerHTML;
      previewText.innerHTML = editor.innerHTML;
    }
  }

  clear() {
    const previewText = $(`#${IDS.previewText}`);
    const previewHtml = $(`#${IDS.previewHtml}`);
    const editor = $(`#${IDS.editorContentable}`);
    if (previewHtml && previewText && editor) {
      previewText.textContent = "";
      previewHtml.innerHTML = "";
      editor.innerHTML = "";
    }
  }

  reset() {}
}
