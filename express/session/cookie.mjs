/**
 * Module dependencies.
 * @typedef {import("cookie").CookieSerializeOptions & { originalMaxAge: number | Date | undefined }} CookieType
 */

import { serialize as _serialize } from "cookie";
import Deprecate from "depd";

const deprecate = Deprecate("express-session");

export default class Cookie {
  /** @param {Object} options */
  constructor(options) {
    /** @type {CookieType['originalMaxAge']} */
    this.originalMaxAge = undefined;
    /** @type {CookieType['partitioned']} */
    this.partitioned = undefined;
    /** @type {CookieType['priority']} */
    this.priority = undefined;
    /** @type {CookieType['expires']} */
    this._expires = undefined;
    /** @type {CookieType['secure']} */
    this.secure = undefined;
    /** @type {CookieType['httpOnly']} */
    this.httpOnly = undefined;
    /** @type {CookieType['domain']} */
    this.domain = undefined;
    /** @type {CookieType['path']} */
    this.path = undefined;
    /** @type {CookieType['sameSite']} */
    this.sameSite = undefined;

    this.options = options;
    this.path = "/";
    /** @type {CookieType['maxAge']} */
    this.maxAge = undefined;

    this.httpOnly = true;
    if (this.options) {
      if (typeof this.options !== "object") {
        throw new TypeError("argument options must be a object");
      }

      for (var key in this.options) {
        if (key !== "data") {
          // @ts-ignore
          this[key] = options[key];
        }
      }
    }

    if (this.originalMaxAge === undefined || this.originalMaxAge === null) {
      this.originalMaxAge = this.maxAge;
    }
  }

  set expires(date) {
    this._expires = date;
    this.originalMaxAge = this.maxAge;
  }

  get expires() {
    return this._expires;
  }

  /** @param {number | Date | undefined} ms */
  set maxAge(ms) {
    if (ms && typeof ms !== "number" && !(ms instanceof Date)) {
      throw new TypeError("maxAge must be a number or Date");
    }

    if (ms instanceof Date) {
      deprecate("maxAge as Date; pass number of milliseconds instead");
    }

    this.expires = typeof ms === "number" ? new Date(Date.now() + ms) : ms;
  }

  get maxAge() {
    return this.expires instanceof Date
      ? this.expires.valueOf() - Date.now()
      : this.expires;
  }

  /** @returns {CookieType} */
  get data() {
    return {
      originalMaxAge: this.originalMaxAge,
      partitioned: this.partitioned,
      priority: this.priority,
      expires: this._expires,
      secure: this.secure,
      httpOnly: this.httpOnly,
      domain: this.domain,
      path: this.path,
      sameSite: this.sameSite,
    };
  }

  /**
   * @param {string} name
   * @param {string} val
   */
  serialize(name, val) {
    return _serialize(name, val, this.data);
  }

  toJSON() {
    return this.data;
  }
}
