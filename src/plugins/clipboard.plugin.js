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
    this.editor.innerHTML = clean;
  }

  /**
   * Làm sạch HTML dán vào
   * @param {string} dirty
   * @returns {string}
   */
  sanitizeHTML(dirty = "") {
    // --- 1. Xoá rác từ Word/Docs ---
    let html = dirty
      .replace(/<!--.*?-->/g, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+mso-[^>]+>/gi, "")
      .replace(/\s*mso-[^:;"]+:[^;"]+;?/gi, "")
      .replace(/<\/?o:[^>]*>/gi, "");

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // --- 2. Convert styles mạnh mẽ ---
    const convertSpanToFormat = (el) => {
      const style = el.style;

      // bold
      if (style.fontWeight === "bold" || style.fontWeight === "700") {
        const b = document.createElement("b");
        b.innerHTML = el.innerHTML;
        el.replaceWith(b);
        return true;
      }

      // italic
      if (style.fontStyle === "italic") {
        const i = document.createElement("i");
        i.innerHTML = el.innerHTML;
        el.replaceWith(i);
        return true;
      }

      // underline
      if (style.textDecoration.includes("underline")) {
        const u = document.createElement("u");
        u.innerHTML = el.innerHTML;
        el.replaceWith(u);
        return true;
      }

      return false;
    };

    // --- 3. Duyệt mọi node ---
    doc.body.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase();

      // Các thẻ được phép
      const allowedTags = [
        "b",
        "i",
        "u",
        "strong",
        "em",
        "span",
        "a",
        "img",
        "p",
        "br",
        "ul",
        "ol",
        "li",
      ];

      if (!allowedTags.includes(tag)) {
        // unwrap nếu không hợp lệ
        el.replaceWith(...el.childNodes);
        return;
      }

      // --- 4. Convert span nếu span có style bold/italic/underline ---
      if (tag === "span" && el.getAttribute("style")) {
        const converted = convertSpanToFormat(el);
        if (converted) return;
      }

      // --- 5. Lọc attribute ---
      const safeAttrs = {
        a: ["href", "title"],
        img: ["src", "alt", "width", "height"],
        span: ["style"],
        b: [],
        i: [],
        u: [],
        strong: [],
        em: [],
        p: [],
        ul: [],
        ol: [],
        li: [],
        br: [],
      };

      const allowed = safeAttrs[tag] || [];

      [...el.attributes].forEach((attr) => {
        const name = attr.name.toLowerCase();
        const value = attr.value;

        // Xóa attr không nằm trong danh sách cho phép
        if (!allowed.includes(name)) {
          el.removeAttribute(name);
          return;
        }

        // Ngăn javascript: trong href
        if (/javascript:/i.test(value)) {
          el.removeAttribute(name);
          return;
        }

        // Lọc style an toàn
        if (name === "style") {
          el.style.cssText = this.filterAllowedStyles(el.style);
        }
      });
    });

    return doc.body.innerHTML.trim();
  }

  // --- Lọc style an toàn ---
  filterAllowedStyles(style) {
    const safe = {};

    if (style.color) safe.color = style.color;
    if (style.backgroundColor) safe["background-color"] = style.backgroundColor;
    if (
      style.fontWeight &&
      (style.fontWeight === "bold" || style.fontWeight === "700")
    )
      safe["font-weight"] = "bold";
    if (style.fontStyle === "italic") safe["font-style"] = "italic";
    if (style.textDecoration.includes("underline"))
      safe["text-decoration"] = "underline";

    return Object.entries(safe)
      .map(([k, v]) => `${k}: ${v}`)
      .join(";");
  }
}
