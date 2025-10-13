import { toolbarUi, baseInput } from "./ui/index.js";

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const editor = $("#editor");
const previewText = $("#preview-text");
const previewHtml = $("#preview-html");

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
  const toolbarContainer = document.createElement("div");
  toolbarContainer.id = id;
  toolbarContainer.style.position = "absolute";
  toolbarContainer.style.top = `${y}px`;
  toolbarContainer.style.left = `${x}px`;
  toolbarContainer.innerHTML = toolbarUi();
  document.body.insertBefore(toolbarContainer, document.body.firstChild);
  setupHandlers("#toolbarFloat button");
};

const unmountToolbar = (id = ids.toolbar) => {
  const element = $(`#${id}`);
  console.log(element);
  if (element) {
    document.body.removeChild(element);
  }
};

const mountInsertLinkInput = (range, id = ids.baseinput) => {
  const { x, y } = getCoordinateFromRange(range);
  const baseInputElement = document.createElement("div");
  baseInputElement.id = id;
  baseInputElement.style.position = "absolute";
  baseInputElement.style.top = `${y - 40}px`;
  baseInputElement.style.left = `${x}px`;
  baseInputElement.innerHTML = baseInput({ type: "text", showButton: true });
  document.body.insertBefore(baseInputElement, document.body.firstChild);
  unmountToolbar(ids.toolbar);
};

const format = (elementName) => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;

  const range = sel.getRangeAt(0);
  const content = range.extractContents();
  const el = document.createElement(elementName);

  if (elementName === "a") {
    const text = content.textContent.trim();
    el.setAttribute("href", text || "#");
    el.setAttribute("target", "_blank");
    mountInsertLinkInput(range, "baseInputId");
  }

  el.appendChild(content);
  range.insertNode(el);

  // cập nhật selection
  range.setStartAfter(el);
  range.setEndAfter(el);
  sel.removeAllRanges();
  sel.addRange(range);
};

const preview = () => {
  if (editor.innerHTML.trim() !== "") {
    render(editor.innerHTML);
  }
};

const mapCommandToActions = {
  preview: preview,
  clear: clear,
  reset: () => {},
  bold: () => format("strong"),
  italic: () => format("i"),
  underline: () => format("u"),
  link: () => format("a"),
};

const mapKeyToActions = {
  Tab: () => format("span"),
  b: () => format("strong"),
  i: () => format("i"),
  u: () => format("u"),
  Enter: () => format("br"),
};

const setupHandlers = (selector) => {
  if (document.querySelector(selector) === null) return;
  $$(selector).forEach((btn) => {
    btn.addEventListener("click", () => {
      const cmd = btn.dataset.cmd;
      if (mapCommandToActions[cmd]) {
        mapCommandToActions[cmd]();
      }
    });
  });
};

editor.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "Tab": {
      e.preventDefault();
      format("span");
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

const init = () => {
  editor.focus();
  setupHandlers("#toolbar button");
};

init();
