export class UndoRedo {
  constructor() {
    this.redoStack = [];
    this.undoStack = [];
  }

  push(state) {
    this.undoStack.push(state);
    this.redoStack.length = 0;
  }

  redo() {
    if (this.redoStack.length === 0) return null;
    const state = this.redoStack.pop();
    this.undoStack.push(state);
    return state;
  }

  undo() {
    if (this.undoStack.length < 2) return null;
    const state = this.undoStack.pop();
    this.redoStack.push(state);
    return state;
  }

  clear() {
    this.redoStack.length = 0;
    this.undoStack.length = 0;
  }
}
