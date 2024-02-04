/**
 * Module dependencies.
 */

import { serialize as _serialize } from "cookie";
import Deprecate from "depd";

const deprecate = Deprecate("express-session");

export default class Cookie {
  constructor(options) {
    this.options = options;
    this.path = "/";
    this.maxAge = null;
    this.httpOnly = true;
    if (this.options) {
      if (typeof this.options !== "object") {
        throw new TypeError("argument options must be a object");
      }

      for (var key in this.options) {
        if (key !== "data") {
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

  serialize(name, val) {
    return this._serialize(name, val, this.data);
  }

  toJSON() {
    return this.data;
  }
}
