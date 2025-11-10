import { ATTRIBUTES, EVENTS, IDS } from "../constants";
import { TOOLBARS } from "../constants/toolbar.const";
import { BaseComponent } from "./baseComponent";

const defineProps = {};

export class Toolbar extends BaseComponent {
  constructor(props, eventBus) {
    super(props, defineProps);
    this.element = this.render();
    this.eventBus = eventBus;
  }

  render() {
    const { id } = this.props;
    const container = document.createElement("div");
    container.id = id || IDS.toolbar;
    Object.entries(TOOLBARS).forEach(([k, v]) => {
      if (v && typeof v === "object") {
        if (v.level == 1) {
          switch (v.type) {
            case "select":
              const options = v.options || [];
              const select = document.createElement("select");
              select.id = v.id;
              select.name = v.name;
              options.forEach((opt) => {
                const option = document.createElement("option");
                option.disabled = opt.disabled;
                option.value = opt.value;
                option.label = opt.label;
                option.setAttribute(ATTRIBUTES.DATA_CMD, opt.dataCmd);
                select.appendChild(option);
              });
              select.addEventListener("change", (e) => {
                console.log(e.target.value);
                this.eventBus.emit(EVENTS.ACTION.CLICK, e.target.value);
              });
              container.appendChild(select);
              break;
          }
        }
        if (v.level == 2) {
          Object.entries(v).forEach(([_k, _v]) => {
            switch (_v.type) {
              case "button":
                const button = document.createElement("button");
                button.setAttribute(ATTRIBUTES.DATA_CMD, _v.dataCmd);
                button.innerText = _v.label;
                container.appendChild(button);
                button.addEventListener("click", (e) => {
                  if (v.type === "format") {
                    this.eventBus.emit(EVENTS.FORMAT.CLICK, _v.elementName);
                  }
                  if (v.type === "action") {
                    switch (_v.dataCmd) {
                      case "preview": {
                        this.eventBus.emit(EVENTS.ACTION.PREVIEW);
                        break;
                      }
                      case "undo": {
                        this.eventBus.emit(EVENTS.ACTION.UNDO);
                        break;
                      }
                      case "redo": {
                        this.eventBus.emit(EVENTS.ACTION.REDO);
                        break;
                      }
                      case "clear": {
                        this.eventBus.emit(EVENTS.ACTION.CLEAR);
                        break;
                      }
                      case "reset": {
                        this.eventBus.emit(EVENTS.ACTION.RESET);
                        break;
                      }
                      case "upload": {
                        this.eventBus.emit(EVENTS.ACTION.UPLOAD_IMAGE);
                        break;
                      }
                      case "code": {
                        this.eventBus.emit(EVENTS.ACTION.CODE_BLOCK.ADD);
                        break;
                      }
                      case "link": {
                        const x = e.clientX;
                        const y = e.clientY;
                        this.eventBus.emit(EVENTS.ACTION.OPEN_LINK, { x, y });
                        break;
                      }
                    }
                  }
                });
                break;
            }
          });
        }
      }
    });

    this.setStyle(container);
    return container;
  }
}
