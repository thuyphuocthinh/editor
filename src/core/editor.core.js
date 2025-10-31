import { EVENTS } from "../constants";
import { UndoRedo } from "../plugins/index";
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
    this.selection = null;
    this.editorUi = null;
    this.toolbar = null;
    this.undoRedo = new UndoRedo();
    this.init();
  }

  listen() {
    this.eventBus.on(EVENTS.FORMAT.DONE, () => {
      this.undoRedo.push(this.editorUi.element.innerHTML);
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
    console.log("Mount editor success!!!");
  }

  destroy() {
    // clear event listener..., release memory
    this.eventBus.clear();
    this.dom = null;
    this.commands = null;
    this.selection = null;
    this.editorUi = null;
  }

  // T6 : render UI cua editor, thuc hien cac thao tac command cung nhu click duoc, sanitize, counter duoc
}
