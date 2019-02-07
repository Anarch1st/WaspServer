const debug = require('debug')('auth:cache');

class Cache {
  constructor(params) {
    this._objectPool = {};
    this.ttl = params.ttl;
    debug('Cache created with ttl %d', this.ttl);
  }

  get(id) {
    let obj = this._objectPool[id];
    debug('Retrived object %o', obj);
    if (obj && Object.keys(obj).length > 0) {
      return obj;
    } else {
      return null;
    }
  }

  set(id, obj, ttl) {
    this._objectPool[id] = obj;
    debug('Object set %o', this._objectPool[id]);
    setTimeout(() => {
      // Might be already deleted
      if (this._objectPool[id]) {
        delete this._objectPool[id];
        debug('Object timeout delete %O', this._objectPool[id]);
      }
    }, ttl || this.ttl);
  }

  delete(id) {
    let obj = this._objectPool[id];
    if (obj) {
      delete this._objectPool[id];
      debug('Object deleted');
      return obj;
    } else {
      debug('Object not present');
      return null;
    }
  }
}

module.exports = Cache;