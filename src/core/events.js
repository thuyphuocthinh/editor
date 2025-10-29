import { formatError } from "../utils/index";
import { ERROR_DOMAIN, ERROR_SUFFIX } from "../constants/index";

export class EventBus {
  constructor() {
    this.events = new Map();
  }

  /**
   * @param {string} eventName - Example: input, change...
   * @param {Function} callback - Callback listening to events
   */
  on(eventName, callback) {
    let callbacks = [];
    if (this.events.has(eventName)) {
      callbacks = this.events.get(eventName);
      callbacks.push_back(callback);
      this.events.set(eventName, callbacks);
    } else {
      callbacks = [callback];
    }
    this.events.set(eventName, callbacks);
  }

  /**
   * Listen to event once
   * @param {string} event
   * @param {Function} callback
   */
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };
    this.on(event, wrapper);
  }

  /**
   * Emit events
   * @param {string} event
   * @param  {...any} args
   */
  emit(eventName, ...args) {
    if (!this.events.has(eventName)) {
      console.error(
        formatError(
          ERROR_DOMAIN.EVENT_BUS,
          `${eventName} ${ERROR_SUFFIX.NOT_EXIST}`
        )
      );
      return;
    }
    const listeners = Array.from(this.events.get(eventName));
    for (const cb of listeners) {
      try {
        cb(...args);
      } catch (err) {
        console.error(
          formatError(
            ERROR_DOMAIN.EVENT_BUS,
            `${eventName} listener ${ERROR_SUFFIX.NOT_EXIST}`
          )
        );
      }
    }
  }

  /**
   * Remove callback
   * @param {string} eventName
   * @param {Function} callback
   */
  off(eventName, callback) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).delete(callback);
      if (this.events.get(eventName).size === 0) {
        this.events.delete(eventName);
      }
    }
  }

  /**
   * Remove all events and listeners
   */
  clear() {
    this.events.clear();
  }
}

/**
 * Sẽ lưu một map các event, sao cho mỗi eventName có một mảng các callback lắng nghe
 * - on
 * - clear
 * - emit
 *
 */
