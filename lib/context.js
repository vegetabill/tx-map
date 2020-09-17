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
  constructor(parent, { outputListener } = {}) {
    this.hasTx = !!parent;
    this.parent = parent || EmptyParent;
    this.id = id++;
    this.state = new Map();
    this.outputListener = outputListener || ((msg) => console.log(msg));
  }

  createChild() {
    return new Context(this);
  }

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

  set(key, value) {
    this.state.set(key, value);
  }

  delete(key) {
    this.state.set(key, TOMBSTONE);
  }

  count(filterValue) {
    const selfCount = [...this.state.values()].reduce((result, value) => {
      if (value === filterValue) {
        return result + 1;
      }
      return result;
    }, 0);

    return selfCount + this.parent.count(filterValue);
  }

  output(msg) {
    this.outputListener(`[tx ${this.id}] - ${msg}`);
  }

  merge(map) {
    map.forEach((value, key) => {
      if (value !== TOMBSTONE) {
        this.set(key, value);
      } else {
        this.delete(key);
      }
    });
  }

  mergeIntoParent() {
    this.parent.merge(this.state);
    return this.parent;
  }
}

module.exports = Context;
