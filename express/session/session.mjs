// @ts-nocheck

export default class Session {
  /**
   * Create a new `Session` with the given request and `data`.
   *
   * @param {IncomingRequest} req
   * @param {Object} data
   * @api private
   */
  constructor(req, data) {
    Object.defineProperty(this, "req", { value: req });
    Object.defineProperty(this, "id", { value: req.sessionID });

    if (typeof data === "object" && data !== null) {
      // merge data into this, ignoring prototype properties
      for (var prop in data) {
        if (!(prop in this)) {
          this[prop] = data[prop];
        }
      }
    }
  }

  touch() {
    return this.resetMaxAge();
  }

  resetMaxAge() {
    this.cookie.maxAge = this.cookie.originalMaxAge;
    return this;
  }

  save(cb) {
    this.req.sessionStore.set(this.id, this, cb || function () {});
    return this;
  }

  /** @param {Function} fn  */
  reload(fn) {
    fn.bind(this);
    var req = this.req;
    var store = this.req.sessionStore;

    store.get(this.id, function (err, sess) {
      if (err) return fn(err);
      if (!sess) return fn(new Error("failed to load session"));
      store.createSession(req, sess);
      fn();
    });
    return this;
  }

  destroy(fn) {
    delete this.req.session;
    this.req.sessionStore.destroy(this.id, fn);
    return this;
  }

  regenerate(fn) {
    this.req.sessionStore.regenerate(this.req, fn);
    return this;
  }
}

["touch", "resetMaxAge", "save", "reload", "destroy", "regenerate"].forEach(
  (property) => {
    Object.defineProperty(Session.prototype, property, {
      configurable: true,
      enumerable: false,
      writable: true,
    });
  }
);
