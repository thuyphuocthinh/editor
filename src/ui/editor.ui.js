import { IDS } from "../constants";
import { BaseComponent } from "./baseComponent";

const defineProps = {
  style: {
    required: false,
    default: {},
    validator: (val) => typeof val === "object" && val !== null,
    message: "Style must be an object",
  },
  id: {
    required: false,
    default: IDS.editor,
  },
};

export class EditorUi extends BaseComponent {
  constructor(props) {
    super(props, defineProps);
    this.childNodes = props?.childNodes || [];
    this.element = this.render();
  }

  render() {
    const container = document.createElement("div");
    container.id = IDS.editor;

    this.childNodes.forEach((node) => {
      container.appendChild(node);
    });

    const editable = document.createElement("div");
    editable.contentEditable = true;
    editable.id = IDS.editorContentable;
    container.appendChild(editable);

    this.setStyle(container);
    return container;
  }
}
