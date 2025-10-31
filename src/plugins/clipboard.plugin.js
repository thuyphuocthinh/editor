// src/plugins/Clipboarder.js
export class Clipboarder {
  /**
   * @param {HTMLElement} editor - Element contenteditable cần lắng nghe paste
   * @param {Array<string>} allowedTags - Danh sách tag cho phép
   * @param {Object<string, Array<string>>} allowedAttrs - Danh sách attr cho từng tag
   */
  constructor(editor, allowedTags = [], allowedAttrs = {}) {
    if (!editor || !(editor instanceof HTMLElement)) {
      throw new Error("Clipboarder requires a valid HTMLElement editor");
    }

    this.editor = editor;
    this.allowedTags = allowedTags;
    this.allowedAttrs = allowedAttrs;

    // Ràng buộc ngữ cảnh this cho event listener
    this._onPaste = this._onPaste.bind(this);

    this.listen();
  }

  /**
   * Gắn listener cho sự kiện paste
   */
  listen() {
    this.editor.addEventListener("paste", this._onPaste);
  }

  /**
   * Gỡ listener (để cleanup khi destroy editor)
   */
  destroy() {
    this.editor.removeEventListener("paste", this._onPaste);
  }

  /**
   * Xử lý khi paste
   * @param {ClipboardEvent} e
   */
  _onPaste(e) {
    e.preventDefault();

    const clipboard = e.clipboardData || window.clipboardData;
    const html = clipboard.getData("text/html");
    const text = clipboard.getData("text/plain");
    const content = html || text;

    const clean = this.sanitizeHTML(content);
    document.execCommand("insertHTML", false, clean);
  }

  /**
   * Làm sạch HTML dán vào
   * @param {string} dirty
   * @returns {string}
   */
  sanitizeHTML(dirty = "") {
    // loại bỏ rác từ Word/Docs
    let html = dirty
      .replace(/<!--.*?-->/g, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+mso-[^>]+>/gi, "")
      .replace(/\s*mso-[^:;"]+:[^;"]+;?/gi, "")
      .replace(/<\/?o:[^>]*>/gi, "")
      .replace(/<span[^>]*>/gi, "")
      .replace(/<\/span>/gi, "");

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.body.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toUpperCase();
      if (!this.allowedTags.includes(tag)) {
        el.replaceWith(...el.childNodes);
      } else {
        // giữ lại attr hợp lệ
        [...el.attributes].forEach((attr) => {
          const name = attr.name.toLowerCase();
          const value = attr.value;
          const allowed = this.allowedAttrs[tag] || [];
          if (!allowed.includes(name) || /javascript:/i.test(value)) {
            el.removeAttribute(name);
          }
        });
      }
    });

    return doc.body.innerHTML.trim();
  }
}
