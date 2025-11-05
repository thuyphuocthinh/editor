// core/CommandManager.js
import { ERROR_DOMAIN, ERROR_SUFFIX, COMMANDS, EVENTS } from "../constants";
import { formatError } from "../utils";

export class CommandManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.init();
  }

  init() {
    window.addEventListener("keydown", (e) => this.handleKey(e));
  }

  handleKey(e) {
    if (e.ctrlKey) {
      const cmdkey = `${e.key.toLowerCase()}`;
      if (!COMMANDS.FORMAT[cmdkey]) return;
      const cmd = COMMANDS.FORMAT[cmdkey].key;

      if (cmd) {
        e.preventDefault();
        this.emit(cmd, COMMANDS.FORMAT[cmdkey].elementName);
      }
    } else {
      switch (e.key) {
        case " ": {
          this.detectIntentCreateList(e);
          break;
        }
        case "Tab": {
          e.preventDefault();
          this.renderNestedList();
          break;
        }
        default: {
          break;
        }
      }
    }
  }

  renderNestedList() {
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
        sublist = document.createElement(
          li.parentElement.tagName.toLowerCase()
        );
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
  }

  convertToList(type, node) {
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
  }

  detectIntentCreateList(e) {
    const sel = window.getSelection();
    const range = sel.getRangeAt(0);
    const node = range.startContainer;

    const text = node.textContent.trim();

    // Nếu user gõ "-" rồi space
    if (e.key === " " && text === "-") {
      e.preventDefault();
      this.convertToList("ul", node);
    }

    // Nếu user gõ "1." rồi space
    if (e.key === " " && /^(\d+)\.$/.test(text)) {
      e.preventDefault();
      this.convertToList("ol", node);
    }
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKey);
  }

  /**
   * Phát lệnh ra EventBus
   * @param {string} cmdName - tên lệnh
   * @param {any} payload - dữ liệu đi kèm
   */
  emit(cmdName, elementName) {
    if (!cmdName) {
      console.error(
        formatError(
          ERROR_DOMAIN.COMMANDS,
          `${cmdName} ${ERROR_SUFFIX.NOT_EXIST}`
        )
      );
      return;
    }

    // validate command có tồn tại trong EVENTS
    if (!this.validate(cmdName)) {
      console.error(
        formatError(
          ERROR_DOMAIN.COMMANDS,
          `${cmdName} ${ERROR_SUFFIX.NOT_EXIST}`
        )
      );
      return;
    }

    this.eventBus.emit(EVENTS.COMMANDS.TRIGGER, elementName);
  }

  /**
   * Kiểm tra cmdName có tồn tại trong constants không
   */
  validate(cmdName) {
    return Object.values(COMMANDS).some((group) =>
      Object.values(group).some((cmd) => cmd.key === cmdName)
    );
  }
}
