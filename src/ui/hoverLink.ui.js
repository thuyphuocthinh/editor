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

export class HoverLinkUi extends BaseComponent {
  constructor(props, eventBus) {
    super(props, defineProps);
    this.eventBus = eventBus;
    this.currentUrl = "";
    this.isEditMode = false;
    this.element = this.render();
  }

  render() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "8px";

    // Input
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type or edit link";
    input.style.height = "30px";
    input.style.padding = "0 6px";
    input.style.flex = "1";

    // Buttons
    const btnSave = this.createButton("💾 Save");
    const btnView = this.createButton("🔗 View");
    const btnEdit = this.createButton("✏️ Edit");
    const btnRemove = this.createButton("🗑 Remove");

    // Save new or edited link
    btnSave.addEventListener("click", () => {
      const url = input.value.trim();
      if (!url) return;
      this.currentUrl = url;
      this.isEditMode = false;
      this.eventBus.emit(EVENTS.ACTION.SAVE_LINK, url);
      this.updateViewMode(container, input, { url });
    });

    // View existing link
    btnView.addEventListener("click", () => {
      if (this.currentUrl) window.open(this.currentUrl, "_blank");
    });

    // Edit existing link
    btnEdit.addEventListener("click", () => {
      this.isEditMode = true;
      input.value = this.currentUrl;
      this.updateEditMode(container, input);
    });

    // Remove link
    btnRemove.addEventListener("click", () => {
      this.eventBus.emit(EVENTS.ACTION.REMOVE_LINK, this.currentUrl);
      this.currentUrl = "";
      input.value = "";
      this.updateEditMode(container, input);
    });

    // Default: show edit mode
    container.appendChild(input);
    container.appendChild(btnSave);
    container.appendChild(btnView);
    container.appendChild(btnEdit);
    container.appendChild(btnRemove);

    this.setStyle(container);
    this.updateEditMode(container, input);

    return container;
  }

  createButton(text) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.height = "30px";
    btn.style.cursor = "pointer";
    return btn;
  }

  updateViewMode(container, input, { url }) {
    input.disabled = true;
    input.value = url;
  }

  updateEditMode(container, input) {
    input.disabled = false;
  }
}
