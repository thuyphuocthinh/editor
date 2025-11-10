import { EVENTS } from "../constants";
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
    default: "base-input-id",
  },
};

export class LinkUi extends BaseComponent {
  constructor(props, eventBus) {
    super(props, defineProps);
    this.element = this.render();
    this.eventBus = eventBus;
  }

  render() {
    const container = document.createElement("div");
    const input = document.createElement("input");
    input.height = "30px";
    input.placeholder = "Type Link";
    const button = document.createElement("button");
    button.textContent = "Save";
    button.height = "30px";
    button.style.cursor = "pointer";
    container.appendChild(input);
    container.appendChild(button);
    button.addEventListener("click", () => {
      this.eventBus.emit(EVENTS.ACTION.SAVE_LINK, input.value.trim());
    });
    this.setStyle(container);
    return container;
  }
}
