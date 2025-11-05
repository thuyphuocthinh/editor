import { IDS } from "../constants";

export class Counter {
  /**
   * @param {HTMLElement} container - Element chứa counter
   */
  constructor(container) {
    this.container = container;
    this.displayElement = container?.querySelector(`#${IDS.counter}`) || null;
  }

  /**
   * Cập nhật số lượng từ trong content
   * @param {string} content - Nội dung văn bản cần đếm
   */
  update(content = "") {
    if (!this.displayElement) return;
    const wordCount = content
      .trim()
      .split(/\s+/) // tách theo khoảng trắng
      .filter(Boolean).length;
    this.displayElement.textContent = wordCount;
  }

  /**
   * Khởi động counter
   * @param {string} [initialContent=""]
   */
  start(initialContent = "") {
    this.update(initialContent);
  }
}
