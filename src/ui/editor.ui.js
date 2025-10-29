import { BaseComponent } from "./baseComponent";

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

export class EditorUi extends BaseComponent {
  constructor(props) {
    props = {
      ...props,
      showButton: props.showButton ?? defineProps.showButton.default,
    };

    super(props, defineProps);

    this.element = this.render();
  }
}
