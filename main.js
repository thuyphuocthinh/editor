/*
    Làm sao mà từ const editor = new Editor(element, config)
    => element: phần tử DOM mà editor sẽ mount vào
    => config: object config các tính năng của editor

    => editor: đối tượng editor đã được khởi tạo và có thể sử dụng các phương thức của nó
    Khi gọi new Editor(element, config) thì trình biên dịch sẽ thực hiện các bước sau:
    1. Tạo một đối tượng mới từ lớp Editor
    2. Gọi hàm khởi tạo (constructor) của lớp Editor với tham số element và config
    3. Trong hàm khởi tạo, thực hiện các bước sau:
        a. Gán element và config vào các thuộc tính của đối tượng editor
        b. Khởi tạo các thành phần cần thiết cho editor (như toolbar, content area, ...)
        c. Thiết lập các sự kiện và hành vi dựa trên config
    4. Trả về đối tượng editor đã được khởi tạo và vẽ ra giao diện trên element
*/

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const editor = $("#editor");
const previewText = $("#preview-text");
const previewHtml = $("#preview-html");

const render = (html) => {
  previewText.innerHTML = html;
  previewHtml.textContent = html;
};

const clear = () => {
  editor.innerHTML = "";
  previewHtml.textContent = "";
  previewText.innerHTML = "";
};

const format = (elementName) => {
  const sel = window.getSelection();
  if (!sel.rangeCount) return;
  const range = sel.getRangeAt(0);

  const content = range.extractContents();
  const el = document.createElement(elementName);
  el.appendChild(content);

  if (elementName === "a") {
    el.setAttribute("href", content);
    el.setAttribute("target", "_blank");
  }
  range.insertNode(el);
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

$$("#toolbar button").forEach((btn) => {
  btn.addEventListener("click", () => {
    const cmd = btn.dataset.cmd;
    if (mapCommandToActions[cmd]) {
      mapCommandToActions[cmd]();
    }
  });
});

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
