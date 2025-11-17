import { ERROR_DOMAIN, ERROR_SUFFIX, EVENTS, IDS } from "../constants";
import { CodeBlock } from "../plugins/codeblock.plugin";
import { Clipboarder, Counter, UndoRedo } from "../plugins/index";
import { ImageUploader } from "../plugins/upload.plugin";
import { CounterUi } from "../ui/counter.ui";
import { HoverLinkUi } from "../ui/hoverLink.ui";
import { EditorUi } from "../ui/index";
import { PreviewCtn } from "../ui/preview.ui";
import { $, formatError } from "../utils";
import { CommandManager } from "./command.core";
import { DOMHelper } from "./dom.core";
import { EventBus } from "./events.core";
import { Link } from "./link.core";
import { Parser } from "./parser.core";
import { Toolbar } from "./toolbar.core";

export class Editor {
  constructor(selector, options = {}) {
    this.container = $(selector);
    if (!this.container) {
      console.error(
        formatError(
          ERROR_DOMAIN.DOM,
          `SELECTOR '${selector}' ${ERROR_SUFFIX.NOT_EXIST}`
        )
      );
      return;
    }
    this.dom = new DOMHelper(this.container);
    this.eventBus = new EventBus();
    this.commands = new CommandManager(this.eventBus);
    this.undoRedo = new UndoRedo();
    this.parser = new Parser(this.eventBus);
    this.selection = null;
    this.editorUi = null;
    this.counterUi = null;
    this.toolbar = null;
    this.clipboard = null;
    this.uploader = null;
    this.codeblock = null;
    this.linkInput = null;
    this.hoverLink = null;
    this.counterPlugin = null;
    this.init(options);
  }

  listen() {
    this.editorUi.element.addEventListener("keydown", () => {
      this.undoRedo.push(this.editorUi.getContent());
    });
    this.editorUi.element.addEventListener("paste", () => {
      this.undoRedo.push(this.editorUi.getContent());
    });
    this.editorUi.element.addEventListener("cut", () => {
      this.undoRedo.push(this.editorUi.getContent());
    });
    this.eventBus.on(EVENTS.FORMAT.DONE, () => {
      this.undoRedo.push(this.editorUi.getContent());
    });
    this.eventBus.on(EVENTS.ACTION.REDO, () => {
      this.editorUi.setContent(this.undoRedo.redo());
    });
    this.eventBus.on(EVENTS.ACTION.UNDO, () => {
      this.editorUi.setContent(this.undoRedo.undo());
    });
  }

  mount() {
    this.toolbar = new Toolbar(this.eventBus);
    this.counterUi = new CounterUi(
      {
        style: {
          display: "flex",
          gap: "8px",
          height: "30px",
          border: "1px solid #ccc",
          padding: "0 6px ",
          alignItems: "center",
          borderBottom: "none",
        },
      },
      this.eventBus
    );
    this.editorUi = new EditorUi({
      style: {
        height: "300px",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      },
      childNodes: [this.toolbar.toolbarUi.element, this.counterUi.element],
    });
    this.editorUi.mount(this.container);
    this.eventBus.emit(EVENTS.GLOBAL.READY);
    this.linkInput = new Link(this.editorUi.element, this.eventBus);
    this.hoverLink = new HoverLinkUi({}, this.eventBus, this.editorUi.element);
  }

  init(options) {
    this.mount();
    this.listen();
    this.setPlugins();
    this.checkOptions(options);
    console.log("Mount editor success!!!");
  }

  setPlugins() {
    this.clipboard = new Clipboarder(
      this.editorUi.element.querySelector(`#${IDS.editorContentable}`),
      ["b", "i", "u", "a", "img", "p", "br", "ul", "ol", "li", "span"],
      {
        a: ["href", "title"],
        img: ["src", "alt"],
      }
    );
    this.imageUploader = new ImageUploader(
      this.editorUi.element,
      this.eventBus
    );
    this.codeblock = new CodeBlock(
      this.editorUi.element.querySelector(`#${IDS.editorContentable}`),
      this.eventBus
    );
    this.counterPlugin = new Counter(this.editorUi.element);
  }

  destroy() {
    // clear event listener..., release memory
    this.eventBus.clear();
    this.commands.destroy();
    this.imageUploader.destroy();
    this.codeblock.destroy();
    this.codeblock = null;
    this.imageUploader = null;
    this.commands = null;
    this.dom = null;
    this.commands = null;
    this.selection = null;
    this.editorUi = null;
  }

  renderPreview() {
    const previewUi = new PreviewCtn({});
    if (this.container && previewUi.element) {
      this.container.appendChild(previewUi.element);
    }
  }

  checkOptions(options) {
    if (options !== null && typeof options === "object") {
      const { showPreview } = options;
      if (showPreview) {
        this.renderPreview();
      }
    }
  }
}
