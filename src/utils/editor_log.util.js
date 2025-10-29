export const EditorLogs = () => {
  const redoStack = [];
  const undoStack = [];
  return {
    push(state) {
      undoStack.push(state);
      redoStack.length = 0;
    },
    redo() {
      if (redoStack.length === 0) return null;
      const state = redoStack.pop();
      undoStack.push(state);
      return state;
    },
    undo() {
      if (undoStack.length < 2) return null;
      const state = undoStack.pop();
      redoStack.push(state);
      return state;
    },
    clear() {
      redoStack.length = 0;
      undoStack.length = 0;
    },
  };
};
