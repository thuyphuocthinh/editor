import { EVENTS } from "../constants/index.js";

export class Selection {
  constructor(eventBus, element) {
    this.eventBus = eventBus;
    this.element = element;
    this.currentRange = null;

    this._onSelectionChange = this._onSelectionChange.bind(this);
    document.addEventListener("selectionchange", this._onSelectionChange);
  }

  _onSelectionChange() {
    const range = this.element.getRange();
    if (!range) return;
    this.currentRange = range;
    this.eventBus.emit(EVENTS.SELECTION.CHANGE, this.getSelectionInfo());
  }

  getRange() {
    return this.currentRange || this.element.getRange();
  }

  getSelectionInfo() {
    const range = this.getRange();
    if (!range) return null;
    return {
      startContainer: range.startContainer,
      startOffset: range.startOffset,
      endContainer: range.endContainer,
      endOffset: range.endOffset,
      isCollapsed: range.collapsed,
    };
  }

  destroy() {
    document.removeEventListener("selectionchange", this._onSelectionChange);
  }
}
