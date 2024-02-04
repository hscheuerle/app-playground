import Store from "./store.mjs";

export default class MemoryStore extends Store {
  constructor() {
    super();
    this.sessions = Object.create(null);
  }

  all(callback) {
    var sessionIds = Object.keys(this.sessions);
    var sessions = Object.create(null);

    for (var i = 0; i < sessionIds.length; i++) {
      var sessionId = sessionIds[i];
      var session = getSession.call(this, sessionId);

      if (session) {
        sessions[sessionId] = session;
      }
    }

    callback && setImmediate(callback, null, sessions);
  }

  clear(callback) {
    this.sessions = Object.create(null);
    callback && setImmediate(callback);
  }

  destroy(sessionId, callback) {
    delete this.sessions[sessionId];
    callback && setImmediate(callback);
  }

  get(sessionId, callback) {
    setImmediate(callback, null, getSession.call(this, sessionId));
  }

  set(sessionId, session, callback) {
    this.sessions[sessionId] = JSON.stringify(session);
    callback && setImmediate(callback);
  }

  length(callback) {
    this.all(function (err, sessions) {
      if (err) return callback(err);
      callback(null, Object.keys(sessions).length);
    });
  }

  touch(sessionId, session, callback) {
    var currentSession = getSession.call(this, sessionId);

    if (currentSession) {
      // update expiration
      currentSession.cookie = session.cookie;
      this.sessions[sessionId] = JSON.stringify(currentSession);
    }

    callback && setImmediate(callback);
  }
}

function getSession(sessionId) {
  var sess = this.sessions[sessionId];

  if (!sess) {
    return;
  }

  // parse
  sess = JSON.parse(sess);

  if (sess.cookie) {
    var expires =
      typeof sess.cookie.expires === "string"
        ? new Date(sess.cookie.expires)
        : sess.cookie.expires;

    // destroy expired session
    if (expires && expires <= Date.now()) {
      delete this.sessions[sessionId];
      return;
    }
  }

  return sess;
}
