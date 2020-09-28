const createMap = require("../lib/mvcc-map");

describe("MVCC Map", () => {
  let map;

  beforeEach(() => {
    map = createMap();
  });

  it("should get back same value for a given tx", () => {
    const tx = 2;
    const value = 3;
    map.setInTx("A", value, tx);
    expect(map.get("A", tx)).toEqual(value);
  });

  it("should get back undefined if set by a newer tx", () => {
    const tx = 2;
    const value = 3;
    map.setInTx("A", value, tx + 1);
    expect(map.get("A", tx)).toBeUndefined();
  });

  it("should get back undefined if committed by a newer tx", () => {
    const tx = 2;
    const value = 3;
    map.setInTx("A", value, tx + 1);
    map.commit(tx + 1);
    expect(map.get("A", tx)).toBeUndefined();
  });

  it("should get back undefined if set by an older, uncommitted tx", () => {
    const tx = 2;
    map.setInTx("A", 7, tx - 1);
    expect(map.get("A", tx)).toBeUndefined();
  });

  it("should get back value set by an older committed tx if none set in tx", () => {
    const tx = 2;
    map.setInTx("A", 7, tx - 1);
    map.commit(tx - 1);
    expect(map.get("A", tx)).toEqual(7);
  });

  it("should get back undefined if set by a newer committed tx", () => {
    const tx = 2;
    map.commit("A", 7, tx + 1);
    expect(map.get("A", tx)).toBeUndefined();
  });

  it("should see newest value committed before current tx", () => {
    [1, 3, 5].forEach((tx, idx) => {
      map.setInTx("A", idx * 2, tx); // 0, 2, 4
      map.commit(tx);
    });
    expect(map.get("A", 4)).toEqual(2);
  });

  it("should throw error for non-int params", () => {
    expect(() => map.setInTx("A", 1, NaN)).toThrowError();
    expect(() => map.setInTx("A", null, 2)).toThrowError();
  });
});
