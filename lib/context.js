/**
 * Abstraction that holds the state and can spawn children that serve
 * as in-progress transactions.
 */

// simple counter
let id = 0;

// Marker to track deleted keys, when we're merging or reading
const TOMBSTONE = Object.create(null);

// NullObject pattern for a top-level context with no parent
const EmptyParent = {
  get: () => undefined,
  hasTx: false,
  merge: () => {
    throw new Error("Can't merge into non-existent parent");
  },
  count: () => 0,
};

class Context {
  /**
   * @param {*} parent another instance of Context or null if a root context
   * @param {*} options
   *            outputListener: an optional sink for output messages
   *                            defaults to console.log
   */
  constructor(parent, { outputListener } = {}) {
    this.hasTx = !!parent;
    this.parent = parent || EmptyParent;
    this.id = id++;
    this.state = new Map();
    this.outputListener = outputListener || ((msg) => console.log(msg));
  }

  createChild() {
    return new Context(this, { outputListener: this.outputListener });
  }

  /**
   * Returns the value stored at key either previously committed or part of the
   * current (uncommitted) context. If deleted or never stores, returns `undefined`
   * @param {String} key
   */
  get(key) {
    if (this.state.has(key)) {
      const val = this.state.get(key);
      if (val !== TOMBSTONE) {
        return val;
      } else {
        return undefined;
      }
    }
    return this.parent.get(key);
  }

  /**
   * Sets a key/value pair that can be read later. Overwrites
   * any existing value set at key.
   * @param {String} key
   * @param {Object} value
   */
  set(key, value) {
    this.state.set(key, value);
  }

  /**
   * Unsets a key's value, if any. Internally this records
   * a deletion so it can be merged to parent during commit.
   * @param {String} key
   */
  delete(key) {
    this.state.set(key, TOMBSTONE);
  }

  /**
   * Count occurrences of provided value in this context's state
   * or any parent's. Uses === to count as a match.
   * @param {Object} filterValue
   * @returns {Integer} count or 0 if none
   */
  count(filterValue) {
    const selfCount = [...this.state.values()].reduce((result, value) => {
      if (value === filterValue) {
        return result + 1;
      }
      return result;
    }, 0);

    return selfCount + this.parent.count(filterValue);
  }

  /**
   * Records a message as part of this context.
   * Defaults to console log.
   * @param {String} msg
   */
  output(msg) {
    this.outputListener(`[tx ${this.id}] - ${msg}`);
  }

  /**
   * Internal use only.
   * @param {*} map State of a child context to merge
   */
  merge(map) {
    map.forEach((value, key) => {
      if (value !== TOMBSTONE) {
        this.set(key, value);
      } else {
        this.delete(key);
      }
    });
  }

  /**
   * Copies current values (including deletions)
   * into the parent of this context. Essentially a COMMIT.
   * Clients should not use this instance after this method returns.
   * @returns {Context} parent of this instance with state already merged
   */
  mergeIntoParent() {
    this.parent.merge(this.state);
    return this.parent;
  }
}

module.exports = Context;
