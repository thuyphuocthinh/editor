import { EVENTS } from "../constants";
import { EditorUi } from "../ui/index";
import { Toolbar } from "../ui/toolbar.v2.ui";
import { CommandManager } from "./command";
import { DOMHelper } from "./dom";
import { EventBus } from "./events";

export class Editor {
  constructor(container, options = {}) {
    this.dom = new DOMHelper(container);
    this.eventBus = new EventBus();
    this.commands = new CommandManager(this.eventBus);
    this.selection = null;
    this.editorUi = null;
    this.toolbarUi = null;
    this.init();
  }

  init() {
    // render ui
    // emit global event: editor_ready
    // in the toolbar ui when command click => emit event, then listen to them in Editor
    // event listener should always init in constructor
    this.toolbarUi = new Toolbar({});
    this.editorUi = new EditorUi({
      style: {
        height: "250px",
        display: "flex",
        flexDirection: "column",
      },
      childNodes: [this.toolbarUi.element],
    });
    this.editorUi.mount(document.body);
    this.eventBus.emit(EVENTS.GLOBAL.READY);
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
