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
    default: "base-input-id",
  },
};

export class CounterUi extends BaseComponent {
  constructor(props, eventBus) {
    super(props, defineProps);
    this.element = this.render();
    this.eventBus = eventBus;
  }

  render() {
    const container = document.createElement("div");
    const title = document.createElement("span");
    title.textContent = "Counter: ";
    const counterDisplay = document.createElement("div");
    counterDisplay.id = IDS.counter;
    container.appendChild(title);
    container.appendChild(counterDisplay);
    this.setStyle(container);
    return container;
  }
}
