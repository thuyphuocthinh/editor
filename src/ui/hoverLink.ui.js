import { EVENTS, IDS } from "../constants";
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
  constructor(props, eventBus, editor) {
    super(props, defineProps);
    this.eventBus = eventBus;
    this.currentUrl = "";
    this.element = this.render();
    this.editor = editor;
    this.currentAnchor = null;
    this.listen();
  }

  listen() {
    this.editor.addEventListener("mousemove", (e) => {
      const target = e.target;

      if (target.tagName === "A") {
        this.currentUrl = target.getAttribute("href") || "";
        this.currentAnchor = target;
        this.remove();
        const hoverElement = this.render();
        document.body.appendChild(hoverElement);
        const input = hoverElement.querySelector("input");
        if (input) {
          input.value = this.currentUrl;
        }
        const rect = target.getBoundingClientRect();
        hoverElement.style.position = "absolute";
        hoverElement.style.top = `${rect.bottom + window.scrollY}px`;
        hoverElement.style.left = `${rect.left + window.scrollX}px`;
      } else {
        this.remove();
      }
    });
  }

  remove() {
    let hoverElement = document.querySelector(`#${IDS.hoverLink}`);
    if (hoverElement) {
      document.body.removeChild(hoverElement);
    }
  }

  render() {
    const container = document.createElement("div");
    container.id = IDS.hoverLink;
    container.style.display = "flex";
    container.style.alignItems = "center";
    container.style.gap = "8px";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type or edit link";
    input.style.height = "30px";
    input.style.padding = "0 6px";
    input.style.flex = "1";

    const btnSave = this.createButton("💾 Save");
    const btnView = this.createButton("🔗 View");
    const btnRemove = this.createButton("🗑 Remove");

    btnSave.addEventListener("click", () => {
      const url = input.value.trim();
      if (!url) return;
      this.currentUrl = url;
      this.eventBus.emit(EVENTS.ACTION.SAVE_LINK, url);
      this.saveNewLink(container, input, { url });
    });

    btnView.addEventListener("click", () => {
      if (this.currentUrl) window.open(this.currentUrl, "_blank");
    });

    btnRemove.addEventListener("click", () => {
      this.currentUrl = "";
      input.value = "";
      this.removeAnchor();
    });

    container.appendChild(input);
    container.appendChild(btnSave);
    container.appendChild(btnView);
    container.appendChild(btnRemove);

    this.setStyle(container);

    return container;
  }

  createButton(text) {
    const btn = document.createElement("button");
    btn.textContent = text;
    btn.style.height = "30px";
    btn.style.cursor = "pointer";
    return btn;
  }

  saveNewLink(container, input, { url }) {
    input.disabled = true;
    input.value = url;
    if (this.currentAnchor) {
      this.currentAnchor.href = url;
    }
  }

  removeAnchor() {
    if (!this.currentAnchor) return;
    const text = document.createTextNode(this.currentAnchor.textContent || "");
    this.currentAnchor.replaceWith(text);
    this.currentAnchor = null;
    this.currentUrl = "";
    this.eventBus.emit(EVENTS.ACTION.REMOVE_LINK);
    this.remove();
  }
}
