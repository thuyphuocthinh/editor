import { Editor } from "./src/core";

const init = () => {
  const editor = new Editor("body", {
    showPreview: true,
  });
  window.addEventListener("cancel", () => editor.destroy());
};

init();
