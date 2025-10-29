import { Command } from "./command";
import { DOMHelper } from "./dom";
import { EventBus } from "./events";

export class Editor {
  constructor(container, options = {}) {
    this.dom = new DOMHelper(container);
    this.eventBus = new EventBus();
    this.commands = new Command();
    this.selection = null;
  }

  init() {
    // render ui
    // emit global event: editor_ready
    // in the toolbar ui when command click => emit event, then listen to them in Editor
    // event listener should always init in constructor
    //
  }

  destroy() {
    // clear event listener..., release memory
  }
}
