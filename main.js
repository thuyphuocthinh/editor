import { Toolbar, BaseInput } from "./ui/index.js";
import { EditorLogs } from "./utils/editor_log.util.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const editor = $("#editor");
const previewText = $("#preview-text");
const previewHtml = $("#preview-html");
const logs = EditorLogs();

const ids = {
  toolbar: "toolbarFloat",
  baseinput: "baseInputId",
};

const render = (html) => {
  previewText.innerHTML = html;
  previewHtml.textContent = html;
};

const clear = () => {
  editor.innerHTML = "";
  previewHtml.textContent = "";
  previewText.innerHTML = "";
};

const getCoordinateFromRange = (range) => {
  const rect = range.getBoundingClientRect();
  const x = rect.left + window.scrollX;
  const y = rect.top + window.scrollY;
  return { x, y };
};

const mountToolbar = (text, x, y, id = ids.toolbar) => {
  if (!text) return;
  const existingToolbar = document.getElementById(id);
  if (existingToolbar) {
    document.body.removeChild(existingToolbar);
  }
  const toolbarContainer = new Toolbar({
    id: ids.toolbar,
    style: {
      position: "absolute",
      top: `${y}px`,
      left: `${x}px`,
      zIndex: 1000,
    },
  });
  toolbarContainer.mount(document.body);

  toolbarContainer.element.addEventListener("toolbar-click", (e) => {
    const cmd = e.detail;
    if (mapCommandToActions[cmd]) {
      mapCommandToActions[cmd]();
    }
  });
};

const unmountToolbar = (id = ids.toolbar) => {
  const element = $(`#${id}`);
  if (element) {
    document.body.removeChild(element);
  }
};

const mountInsertLinkInput = (range, linkId = "tempLinkId") => {
  const { x, y } = getCoordinateFromRange(range);

  const baseInput = new BaseInput({
    type: "text",
    showButton: true,
    placeholder: "Enter link here...",
    id: ids.baseinput,
    style: {
      position: "absolute",
      top: `${y - 60}px`,
      left: `${x}px`,
      zIndex: 1000,
    },
  });

  baseInput.mount(document.body);

  unmountToolbar();

  baseInput.element.addEventListener("apply", (e) => {
    updateLinkHref(linkId, e.detail);
    document.body.removeChild(baseInput.element);
  });

  baseInput.element.addEventListener("change", (e) => {
    updateLinkHref(linkId, e.detail);
  });
};

function updateLinkHref(linkId, url) {
  const linkEl = document.querySelector(`[data-link-id="${linkId}"]`);
  if (linkEl && url) {
    linkEl.setAttribute("href", url.trim() || "#");
  }
}

const formatInline = (elementName) => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const content = range.extractContents();
  const el = document.createElement(elementName);

  if (elementName === "a") {
    const text = content.textContent.trim();
    const uniqueId = "link-" + Date.now();

    el.setAttribute("href", text || "#");
    el.setAttribute("target", "_blank");
    el.setAttribute("data-link-id", uniqueId);
    mountInsertLinkInput(range, uniqueId);
  }

  el.appendChild(content);
  range.insertNode(el);

  // cập nhật selection
  range.setStartAfter(el);
  range.setEndAfter(el);
  sel.removeAllRanges();
  sel.addRange(range);

  logs.push(editor.innerHTML);
};

const formatBlock = (elementName) => {
  const sel = window.getSelection();
  // if no selection, insert empty block element
  // move caret inside the new element
  if (!sel.rangeCount) {
    const el = document.createElement(elementName);
    el.innerHTML = "<br>";
    editor.appendChild(el);

    const range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);

    logs.push(editor.innerHTML);
    return;
  }

  // if selection is outside editor, insert empty block element at end
  // move caret inside the new element
  const range = sel.getRangeAt(0);
  if (!editor.contains(range.commonAncestorContainer)) {
    const el = document.createElement(elementName);
    el.innerHTML = "<br>";
    editor.appendChild(el);
    const newRange = document.createRange();
    newRange.selectNodeContents(el);
    newRange.collapse(true);
    sel.removeAllRanges();
    sel.addRange(newRange);
    logs.push(editor.innerHTML);
    return;
  }

  // extract selected content and wrap in block element
  const lines = range.extractContents()?.childNodes;
  let el;
  if (elementName === "ul" || elementName === "ol") {
    el = document.createElement(elementName);
    lines.forEach((line) => {
      const li = document.createElement("li");
      li.textContent = line.textContent.trim();
      el.appendChild(li);
    });
  } else {
    el = document.createElement(elementName);
    el.appendChild(content);
  }

  range.insertNode(el);
  range.setStart(el, 0);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);

  logs.push(editor.innerHTML);
};

const preview = () => {
  if (editor.innerHTML.trim() !== "") {
    render(editor.innerHTML);
  }
};

const redo = () => {
  const state = logs.redo();
  if (state !== null) {
    editor.innerHTML = state;
  }
};

const undo = () => {
  const state = logs.undo();
  if (state !== null) {
    editor.innerHTML = state;
  }
};

const mapCommandToActions = {
  preview: preview,
  clear: clear,
  reset: () => {},
  bold: () => formatInline("strong"),
  italic: () => formatInline("i"),
  underline: () => formatInline("u"),
  link: () => formatInline("a"),
  redo: () => redo(),
  undo: () => undo(),
  formatBlock: (tag) => formatBlock(tag),
};

const mapKeyToActions = {
  Tab: () => formatInline("span"),
  b: () => formatInline("strong"),
  i: () => formatInline("i"),
  u: () => formatInline("u"),
  Enter: () => formatInline("br"),
  z: () => undo(),
  y: () => redo(),
};

const renderNestedList = () => {
  const sel = window.getSelection();
  const li = sel.anchorNode.closest("li");

  let count = 0;
  let tmpElement = li;
  while (tmpElement) {
    count++;
    tmpElement = tmpElement.parentElement?.closest("li");
  }
  if (count > 5) return;

  const prev = li.previousElementSibling;
  if (prev) {
    let sublist = prev.querySelector("ul, ol");
    if (!sublist) {
      sublist = document.createElement(li.parentElement.tagName.toLowerCase());
      prev.appendChild(sublist);
    }
    sublist.appendChild(li);

    /*
    Tạo một vùng chọn mới trong tài liệu,
    Đặt caret (con trỏ nháy) vào đầu phần tử <li>,
    Xóa vùng chọn cũ của người dùng.
    */
    const range = document.createRange();
    range.selectNodeContents(li);
    range.collapse(true);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
};

const convertToList = (type, node) => {
  if (type !== "ul" && type !== "ol") return;
  if (!node) return;
  const list = document.createElement(type);
  const li = document.createElement("li");

  node.textContent = "";
  li.appendChild(document.createElement("br"));
  list.appendChild(li);

  node.parentElement.replaceChild(list, node);

  // move caret inside the new li
  const range = document.createRange();
  range.selectNodeContents(li);
  range.collapse(true);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
};

const detectIntentCreateList = (e) => {
  const sel = window.getSelection();
  const range = sel.getRangeAt(0);
  const node = range.startContainer;

  const text = node.textContent.trim();

  // Nếu user gõ "-" rồi space
  if (e.key === " " && text === "-") {
    e.preventDefault();
    convertToList("ul", node);
  }

  // Nếu user gõ "1." rồi space
  if (e.key === " " && /^(\d+)\.$/.test(text)) {
    e.preventDefault();
    convertToList("ol", node);
  }
};

const startListeners = () => {
  editor.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "Tab": {
        e.preventDefault();
        // formatInline("span");
        renderNestedList();
        break;
      }
      case " ": {
        detectIntentCreateList(e);
        break;
      }
      default: {
        console.log("Not found command");
        break;
      }
    }

    if (e.ctrlKey) {
      const action = mapKeyToActions[e.key];
      if (action) {
        e.preventDefault();
        action();
      }
    }
  });

  document.addEventListener("selectionchange", () => {
    const selection = document.getSelection();
    if (!selection) return;
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const { x, y } = getCoordinateFromRange(range);
      mountToolbar(selection.toString(), x, y - 40);
    }
  });

  document.addEventListener("mousedown", (e) => {
    const toolbar = document.getElementById("toolbarFloat");
    if (!toolbar) return;
    const clickedInsideToolbar = toolbar.contains(e.target);
    const clickedInsideEditor = editor.contains(e.target);
    if (!clickedInsideToolbar && !clickedInsideEditor) {
      toolbar.remove();
    }
  });

  editor.addEventListener("input", () => {
    logs.push(editor.innerHTML);
  });
};

const setupHandlers = (selector) => {
  if (selector.includes("button")) {
    const buttons = $$(selector);
    buttons.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const cmd = e.target.getAttribute("data-cmd");
        if (mapCommandToActions[cmd]) {
          mapCommandToActions[cmd]();
        }
      });
    });
  }
  if (selector.includes("select")) {
    const selects = $$(selector);
    selects.forEach((select) => {
      select.addEventListener("change", (e) => {
        const cmd =
          e.target.options[e.target.selectedIndex].getAttribute("data-cmd");
        const value = e.target.value;
        if (cmd === "formatBlock" && mapCommandToActions[cmd]) {
          mapCommandToActions[cmd](value);
        }
      });
    });
  }
};

/**---------------- INIT ------------------ */

const init = () => {
  editor.focus();
  setupHandlers("#toolbar button");
  setupHandlers("#toolbar select");
  startListeners();
};

init();
