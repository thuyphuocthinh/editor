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

export class PreviewCtn extends BaseComponent {
  constructor(props) {
    super(props, defineProps);
    this.element = this.render();
  }

  render() {
    const container = document.createElement("div");
    container.id = IDS.previewCtn;

    container.innerHTML = `
        <h3>Preview</h3>
        <div id="preview-body">
            <div id="preview-html-ctn">
                <h4>HTML</h4>
                <div id="preview-html"></div>
            </div>
            <div id="preview-text-ctn">
                <h4>Text</h4>
                <div id="preview-text"></div>
            </div>
        </div>
    `;

    this.setStyle(container);
    return container;
  }
}
