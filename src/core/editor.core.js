import { EVENTS, IDS } from "../constants";
import { Clipboarder, UndoRedo } from "../plugins/index";
import { EditorUi } from "../ui/index";
import { CommandManager } from "./command.core";
import { DOMHelper } from "./dom.core";
import { EventBus } from "./events.core";
import { Toolbar } from "./toolbar.core";

export class Editor {
  constructor(container, options = {}) {
    this.dom = new DOMHelper(container);
    this.eventBus = new EventBus();
    this.commands = new CommandManager(this.eventBus);
    this.undoRedo = new UndoRedo();
    this.selection = null;
    this.editorUi = null;
    this.toolbar = null;
    this.clipboard = null;
    this.init();
  }

  listen() {
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
    this.editorUi = new EditorUi({
      style: {
        height: "250px",
        display: "flex",
        flexDirection: "column",
      },
      childNodes: [this.toolbar.toolbarUi.element],
    });
    this.editorUi.mount(document.body);

    this.eventBus.emit(EVENTS.GLOBAL.READY);
  }

  init() {
    this.mount();
    this.listen();
    this.setPlugins();
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
  }

  destroy() {
    // clear event listener..., release memory
    this.eventBus.clear();
    this.commands.destroy();
    this.commands = null;
    this.dom = null;
    this.commands = null;
    this.selection = null;
    this.editorUi = null;
  }

  // T6 : render UI cua editor, thuc hien cac thao tac command cung nhu click duoc, sanitize, counter duoc
}
