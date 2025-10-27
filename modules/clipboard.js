// clipboarder.js
export const Clipboarder = () => {
  let allowedTags = [];
  let allowedAttrs = {};
  let editor = null;

  const sanitizeHTML = (dirty = "") => {
    // remove các rác của Word/Docs
    let html = dirty
      .replace(/<!--.*?-->/g, "") // comment
      .replace(/<style[\s\S]*?<\/style>/gi, "") // style block
      .replace(/<[^>]+mso-[^>]+>/gi, "") // MS Office style
      .replace(/\s*mso-[^:;"]+:[^;"]+;?/gi, "") // MS inline style
      .replace(/<\/?o:[^>]*>/gi, "") // <o:p>
      .replace(/<span[^>]*>/gi, "") // span rác
      .replace(/<\/span>/gi, ""); // đóng span

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    // duyệt và loại thẻ không cho phép
    doc.body.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toUpperCase();
      if (!allowedTags.includes(tag)) {
        el.replaceWith(...el.childNodes); // unwrap
      } else {
        // xóa style, class, event...
        [...el.attributes].forEach((attr) => {
          const name = attr.name.toLowerCase();
          const value = attr.value;
          const allowed = allowedAttrs[tag] || [];
          if (!allowed.includes(name)) el.removeAttribute(name);
          if (/javascript:/i.test(value)) el.removeAttribute(name);
        });
      }
    });

    return doc.body.innerHTML.trim();
  };

  const listen = () => {
    if (!editor) return;

    editor.addEventListener("paste", (e) => {
      e.preventDefault();
      const clipboard = e.clipboardData || window.clipboardData;
      const html = clipboard.getData("text/html");
      const text = clipboard.getData("text/plain");
      const content = html || text;

      const clean = sanitizeHTML(content);
      document.execCommand("insertHTML", false, clean);
    });
  };

  return {
    /**
     * @param {HTMLElement} element - Element contenteditable cần lắng nghe paste
     * @param {Array<string>} tags - Danh sách tag cho phép
     * @param {Object<string, Array<string>>} attrs - Danh sách attr cho từng tag
     */
    sanitize(element, tags = [], attrs = {}) {
      if (!element) return;
      editor = element;
      allowedTags = tags;
      allowedAttrs = attrs;
      listen();
    },
  };
};
