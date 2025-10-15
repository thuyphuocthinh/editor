import { Toolbar, BaseInput } from "./ui/index.js";

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

const format = (elementName) => {
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

const setupHandlers = (selector) => {
  const buttons = $$(selector);
  buttons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const cmd = e.target.getAttribute("data-cmd");
      if (mapCommandToActions[cmd]) {
        mapCommandToActions[cmd]();
      }
    });
  });
};

const init = () => {
  editor.focus();
  setupHandlers("#toolbar button");
};

init();
