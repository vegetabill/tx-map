const Context = require("../lib/context");

describe("Context", () => {
  let root;

  beforeEach(() => {
    root = new Context();
    root.set("A", 1);
  });

  it("should set and get values", () => {
    expect(root.get("Z")).toBeUndefined();
    root.set("Z", 7);
    expect(root.get("Z")).toEqual(7);
  });

  it("should merge values into its parent", () => {
    const ctx = root.createChild();
    ctx.set("B", 2);
    expect(root.get("B")).toBeUndefined();
    ctx.mergeIntoParent();
    expect(root.get("A")).toEqual(1);
    expect(root.get("B")).toEqual(2);
  });

  it("should return parent after merge", () => {
    const ctx = root.createChild();
    const result = ctx.mergeIntoParent();
    expect(result).toBe(root);
  });

  it("should allow deletion of values", () => {
    root.set("Z", 7);
    root.delete("Z");
    expect(root.get("Z")).toBeUndefined();
  });

  it("should ignore deletion of unset values", () => {
    root.delete("Z");
  });

  it("should merge deletions to parent", () => {
    const ctx = root.createChild();
    ctx.delete("A");
    ctx.mergeIntoParent();
    expect(root.get("A")).toBeUndefined();
  });

  it("should properly merge a value that is deleted and then re-set", () => {
    const ctx = root.createChild();
    ctx.delete("A");
    ctx.set("A", 7);
    ctx.mergeIntoParent();
    expect(root.get("A")).toEqual(7);
  });
});
