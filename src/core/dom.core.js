import { ERROR_DOMAIN } from "../constants/index.js";
import { CustomError } from "./errors.core.js";

export class DOMHelper {
  constructor(root) {
    this.root = root; // eg: editor container
  }

  /**
   * @param {string} tagName - Example: div, span, h1...
   * @param {Object} options - Element attributes: id, class...
   */
  create(tag, options) {
    try {
      const { id, className, ...attrs } = options;
      const element = document.createElement(tag);
      if (id) element.id = id;
      if (className) element.className = className;
      Object.entries(attrs).forEach((k, v) => element.setAttribute(k, v));
      return element;
    } catch (error) {
      throw new CustomError(ERROR_DOMAIN.DOM, error.message);
    }
  }

  /**
   * @param {string} selector - Example: #name, ...
   */
  query(selector) {
    return this.root.querySelector(selector);
  }

  getSelection() {
    return window.getSelection();
  }

  getRange() {
    const sel = this.getSelection();
    return sel && sel.rangeCount ? sel.getRangeAt(0) : null;
  }

  /**
   * @param {HTMLElement} node
   */
  insertNodeAtRange(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }
    const range = this.getRange();
    if (!range) return false;
    range.insertNode(node);
    return true;
  }

  focus() {
    this.root.focus();
  }

  /**
   * @param {HTMLElement} node - Example: move caret right after node
   */
  moveCaret(node) {
    const range = document.createRange();
    range.selectNodeContents(node);
    range.collapse(true);
    const sel = this.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
}
