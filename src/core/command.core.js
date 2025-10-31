// core/CommandManager.js
import { ERROR_DOMAIN, ERROR_SUFFIX, COMMANDS } from "../constants";
import { formatError } from "../utils";

export class CommandManager {
  constructor(eventBus) {
    this.eventBus = eventBus;
  }

  /**
   * Phát lệnh ra EventBus
   * @param {string} cmdName - tên lệnh
   * @param {any} payload - dữ liệu đi kèm
   */
  emit(cmdName, payload = {}) {
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

    this.eventBus.emit(`command:${cmdName}`, payload);
    this.eventBus.emit("command:executed", { name: cmdName, payload });
  }

  /**
   * Kiểm tra cmdName có tồn tại trong EVENTS không
   */
  validate(cmdName) {
    for (const domain in COMMANDS) {
      const group = EVENTS[domain];
      if (Object.values(group).includes(cmdName)) return true;
    }
    return false;
  }
}
