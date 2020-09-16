let id = 0;

class Context {
  constructor(parent) {
    this.id = id++;
    this.parent = parent;
    this.state = new Map();
  }

  createChild() {
    return new Context(this);
  }

  get(key) {
    if (this.state.has(key)) {
      return this.state.get(key);
    }
    return this.parent && this.parent.get(key);
  }

  set(key, value) {
    this.state.set(key, value);
  }

  output(msg) {
    console.log(`[tx ${this.id}] - ${msg}`);
  }

  get hasTx() {
    return !!this.parent;
  }

  merge(map) {
    map.forEach((value, key) => {
      this.set(key, value);
    });
  }

  mergeIntoParent() {
    if (!this.parent) {
      throw new Error("Can't merge into non-existent parent");
    }
    this.parent.merge(this.state);
    return this.parent;
  }
}

module.exports = Context;
