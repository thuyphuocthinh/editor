import { BaseComponent } from "./baseComponent.js";

const defineProps = {
  type: {
    required: true,
    validator: (val) => ["text", "password", "email", "number"].includes(val),
    message: "Type is required",
  },
  showButton: {
    required: false,
    default: false,
  },
  placeholder: {
    required: false,
    default: "",
  },
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

export class BaseInput extends BaseComponent {
  constructor(props) {
    props = {
      ...props,
      showButton: props.showButton ?? defineProps.showButton.default,
    };

    super(props, defineProps);

    this.element = this.render();
  }

  render() {
    const { type, showButton, placeholder, style, id } = this.props;

    const container = document.createElement("div");
    container.className = "base-input-ctn";
    container.id = id;

    const input = document.createElement("input");
    input.type = type;
    input.placeholder = placeholder;
    input.autofocus = true;
    container.appendChild(input);

    if (showButton) {
      const btn = document.createElement("button");
      btn.textContent = "Apply";
      container.appendChild(btn);

      btn.addEventListener("click", () => {
        this.emit("apply", input.value);
      });
    }

    input.addEventListener("input", (e) => {
      this.emit("change", e.target.value);
    });

    if (style && typeof style === "object") {
      Object.keys(style).forEach((key) => {
        container.style[key] = style[key];
      });
    }

    return container;
  }
}
