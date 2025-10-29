const validateProps = (props, rules) => {
  if (typeof props !== "object" || props === null) {
    throw new Error("Props must be an object");
  }

  Object.keys(rules).forEach((key) => {
    const rule = rules[key];
    const value = props[key];

    if (rule.required && (value === undefined || value === null)) {
      throw new Error(rule.message);
    }

    if (value !== undefined && rule.validator && !rule.validator(value)) {
      throw new Error(`${key}: ${value} is invalid`);
    }
  });
};

export class BaseComponent {
  constructor(props, rules) {
    validateProps(props, rules);
    this.props = { ...props };
    this.element = null;
  }

  render() {
    throw new Error("Render method must be implemented");
  }

  mount(parentNode) {
    if (!(parentNode instanceof HTMLElement)) {
      throw new Error("Parent node must be an HTMLElement");
    }
    parentNode.appendChild(this.element);
  }

  unmount() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }

  emit(eventName, detail) {
    const event = new CustomEvent(eventName, {
      detail,
      bubbles: true,
    });
    this.element.dispatchEvent(event);
  }
}
