import { EVENTS } from "../constants";
import { LinkUi } from "../ui/link.ui";

export class Link {
  constructor(editor, eventBus) {
    this.editor = editor;
    this.eventBus = eventBus;
    this.linkUi = null;
    this.init();
    this.isShow = false;
  }

  init() {
    this.linkUi = new LinkUi(
      {
        style: {
          display: "flex",
          justifyContent: "space-between",
          padding: "10px",
          background: "#ccc",
          borderRadius: "4px",
        },
      },
      this.eventBus
    );
    this.listen();
  }

  listen() {
    this.eventBus.on(EVENTS.ACTION.OPEN_LINK, this.render.bind(this));
    document.addEventListener("click", (e) => {
      if (
        this.isShow &&
        !document.querySelector("button[data-cmd='link']").contains(e.target) &&
        !this.linkUi.element.contains(e.target)
      ) {
        this.linkUi.unmount();
        this.isShow = false;
      }
    });
  }

  render({ x, y }) {
    console.log(x, y);
    this.linkUi.element.style.position = "absolute";
    this.linkUi.element.style.top = `${y + 50}px`;
    this.linkUi.element.style.left = `${x + 50}px`;
    this.linkUi.mount(this.editor);
    this.isShow = true;
  }
}
