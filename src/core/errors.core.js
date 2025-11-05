import { EDITOR_ERROR } from "../constants/index.js";

export class CustomError extends Error {
  /**
   * @param {string} code - Mã lỗi (ví dụ: 'SELECTION_INVALID')
   * @param {string} message - Mô tả lỗi chi tiết
   * @param {Error} [cause] - lỗi gốc (nếu có)
   */
  constructor(code, message, cause) {
    super(message);
    this.name = EDITOR_ERROR;
    this.code = code;
    this.cause = cause;
    if (this.cause?.stack) {
      this.stack += "\nCaused by: " + cause.stack;
    }
  }
}
