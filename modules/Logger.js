/**
 * yoinked from {@link https://github.com/BetterDiscord/BetterDiscord/blob/c2ff0b251d35c91d265c8ad666a5a8e2daef5ce0/common/logger.js} and edited
 */
export const LogTypes = { err: "error", error: "error", dbg: "debug", debug: "debug", log: "log", warn: "warn", info: "info" }
export default class Logger {
  static stacktrace(module, message, error) { console.error(`%c[${module}]%c ${message}\n\n%c`, "color: #3a71c1; font-weight: 700;", "color: red; font-weight: 700;", "color: red;", error) }
  static err(module, ...message) { this._log(module, message, "error") }
  static error(module, ...message) { this._log(module, message, "error") }
  static warn(module, ...message) { this._log(module, message, "warn") }
  static info(module, ...message) { this._log(module, message, "info") }
  static debug(module, ...message) { this._log(module, message, "debug") }
  static log(module, ...message) { this._log(module, message) }
  static _log(module, message, type = "log") {
    type = this.parseType(type)
    if (!Array.isArray(message)) message = [message]
    console[type](`%c[BdCompat:BetterDiscord]%c [${module}]%c`, "color: #3E82E5; font-weight: 700;", "color: #3a71c1;", "", ...message)
  }
  static parseType(type) { return LogTypes[type] || "log" }
}