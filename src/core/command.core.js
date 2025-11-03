// core/CommandManager.js
import { ERROR_DOMAIN, ERROR_SUFFIX, COMMANDS, EVENTS } from "../constants";
import { formatError } from "../utils";

export class CommandManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
    this.init();
  }

  init() {
    window.addEventListener("keydown", (e) => this.handleKey(e));
  }

  handleKey(e) {
    if (!e.ctrlKey) return;
    const cmdkey = `${e.key.toLowerCase()}`;
    if (!COMMANDS.FORMAT[cmdkey]) return;
    const cmd = COMMANDS.FORMAT[cmdkey].key;

    if (cmd) {
      e.preventDefault();
      this.emit(cmd, COMMANDS.FORMAT[cmdkey].elementName);
    }
  }

  destroy() {
    window.removeEventListener("keydown", this.handleKey);
  }

  /**
   * Phát lệnh ra EventBus
   * @param {string} cmdName - tên lệnh
   * @param {any} payload - dữ liệu đi kèm
   */
  emit(cmdName, elementName) {
    if (!cmdName) {
      console.error(
        formatError(
          ERROR_DOMAIN.COMMANDS,
          `${cmdName} ${ERROR_SUFFIX.NOT_EXIST}`
        )
      );
      return;
    }

    // validate command có tồn tại trong EVENTS
    if (!this.validate(cmdName)) {
      console.error(
        formatError(
          ERROR_DOMAIN.COMMANDS,
          `${cmdName} ${ERROR_SUFFIX.NOT_EXIST}`
        )
      );
      return;
    }

    this.eventBus.emit(EVENTS.COMMANDS.TRIGGER, elementName);
  }

  /**
   * Kiểm tra cmdName có tồn tại trong constants không
   */
  validate(cmdName) {
    return Object.values(COMMANDS).some((group) =>
      Object.values(group).some((cmd) => cmd.key === cmdName)
    );
  }
}
