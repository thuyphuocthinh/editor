import { Editor } from "./src/core";

const init = () => {
  const editor = new Editor(document.body);
  window.addEventListener("cancel", () => editor.destroy());
};

init();
