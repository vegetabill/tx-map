const {
  startTransaction,
  concludeTransaction,
  getMinimumConcludedId,
} = require("../lib/transaction");
const { unsort } = require("array-unsort");

describe("transaction functions", () => {
  describe("startTransaction()", () => {
    it("should return an increasing id", () => {
      const firstId = startTransaction();
      const secondId = startTransaction();
      expect(secondId).toBeGreaterThan(firstId);
      concludeTransaction(firstId);
      concludeTransaction(secondId);
    });
  });

  describe("concludeTransaction()", () => {
    it("should increase minimum concluded", () => {
      const original = getMinimumConcludedId();
      concludeTransaction(startTransaction());
      expect(getMinimumConcludedId()).toEqual(original + 1);
    });

    it("should not increase minimum concluded before all in range are complete", () => {
      const original = getMinimumConcludedId();
      const openIds = new Array(3).fill(0).map(() => startTransaction());
      concludeTransaction(openIds[2]);
      concludeTransaction(openIds[1]);
      expect(getMinimumConcludedId()).toEqual(original);
      concludeTransaction(openIds[0]);
    });

    it("should increase minimum concluded when all in range are complete irrespective of order", () => {
      const openIds = new Array(5).fill(0).map(() => startTransaction());
      unsort(openIds).forEach((id) => concludeTransaction(id));
      expect(getMinimumConcludedId()).toEqual(openIds.slice(-1)[0]);
    });
  });
});
