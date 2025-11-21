import "viewerjs/dist/viewer.css";
import "./style.css";
import Viewer from "viewerjs";
import { Editor } from "./src/core/index.js";

const init = () => {
  const editor = new Editor("body", {
    showPreview: true,
  });
  window.addEventListener("cancel", () => editor.destroy());
};

init();
