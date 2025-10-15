import { BaseComponent } from "./baseComponent.js";

const listToolbar = [
  { id: "boldBtn", title: "Emphasize text", label: "B", dataCmd: "bold" },
  { id: "italicBtn", title: "Italicize text", label: "I", dataCmd: "italic" },
  {
    id: "underlineBtn",
    title: "Underline text",
    label: "U",
    dataCmd: "underline",
  },
  { id: "linkBtn", title: "Insert link", label: "Link", dataCmd: "link" },
  {
    id: "previewBtn",
    title: "Preview content",
    label: "Preview",
    dataCmd: "preview",
  },
  { id: "clearBtn", title: "Clear content", label: "Clear", dataCmd: "clear" },
  { id: "resetBtn", title: "Reset content", label: "Reset", dataCmd: "reset" },
];

const defineProps = {
  style: {
    required: false,
    default: {},
    validator: (val) => typeof val === "object" && val !== null,
    message: "Style must be an object",
  },
  id: {
    required: false,
    default: "base-input-id",
  },
};

export class Toolbar extends BaseComponent {
  constructor(props) {
    super(props, defineProps);
    this.element = this.render();
    this.props = {
      ...props,
    };
  }

  render() {
    const { id, style } = this.props;
    const container = document.createElement("div");
    container.className = "toolbar-ctn";
    container.id = id;
    listToolbar.forEach((item) => {
      const button = document.createElement("button");
      button.id = item.id;
      button.title = item.title;
      button.dataset.cmd = item.dataCmd;
      button.innerHTML = item.label;
      container.appendChild(button);
      button.addEventListener("click", () => {
        this.emit("toolbar-click", item.dataCmd);
      });
    });
    if (style && typeof style === "object") {
      Object.keys(style).forEach((key) => {
        container.style[key] = style[key];
      });
    }
    return container;
  }
}
