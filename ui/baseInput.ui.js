const validTypes = ["text", "password", "email", "number"];
const isValidType = (type) => validTypes.includes(type);

const defineProps = {
  type: {
    required: true,
    validator: (val) => isValidType(val),
    message: "Type is required",
  },
  showButton: {
    required: false,
    default: false,
  },
};

const validateProps = (props) => {
  if (typeof props !== "object" || props === null) {
    throw new Error("Props must be an object");
  }

  Object.keys(defineProps).forEach((key) => {
    const rule = defineProps[key];
    const value = props[key];

    if (rule.required && (value === undefined || value === null)) {
      throw new Error(rule.message);
    }

    if (value !== undefined && rule.validator && !rule.validator(value)) {
      throw new Error(`${key}: ${value} is invalid`);
    }
  });
};

export function baseInput(props) {
  validateProps(props);

  const { type, showButton = defineProps.showButton.default } = props;
  return `
    <div class="base-input-ctn">
      <input type="${type}" />
      ${showButton ? "<button>Apply</button>" : ""}
    </div>
  `;
}
