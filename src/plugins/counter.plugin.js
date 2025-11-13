import { IDS } from "../constants";

export class Counter {
  constructor(container) {
    this.container = container;
    this.displayElement = container?.querySelector(`#${IDS.counter}`) || null;
    this.listen();
  }

  listen() {
    this.start();

    const updateContent = (e) => {
      setTimeout(() => {
        const value = e.target.textContent;
        this.update(value);
      }, 0);
    };

    this.container.addEventListener("keydown", updateContent);
    this.container.addEventListener("keyup", updateContent);
    this.container.addEventListener("paste", updateContent);
    this.container.addEventListener("cut", updateContent);
  }

  update(content = "") {
    if (!this.displayElement) return;
    const wordCount = content
      .trim()
      .split(/\s+/) // tách theo khoảng trắng
      .filter(Boolean).length;
    this.displayElement.textContent = wordCount;
  }

  start(initialContent = "") {
    this.update(initialContent);
  }
}
