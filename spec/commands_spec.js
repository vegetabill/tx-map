const { GetCommand, SetCommand, DeleteCommand } = require("../lib/commands");
const impl = () => {
  throw new Error("must be mocked");
};
describe("Command execution", () => {
  const baseTx = 123;
  const state = {
    get: () => impl,
    setInTx: () => impl,
    delete: () => impl,
  };
  describe("GET cmd", () => {
    it("should print value of variable when present", () => {
      spyOn(state, "get").and.returnValue(3);

      const cmd = new GetCommand(["z"]);
      const { tx, output } = cmd.execute(baseTx, state);

      expect(output).toEqual("z = 3");
      expect(state.get).toHaveBeenCalledWith("z", baseTx);
    });
  });

  describe("SET cmd", () => {
    it("should set state on the active ctx", () => {
      spyOn(state, "setInTx");
      const cmd = new SetCommand(["X", 2]);
      const { tx } = cmd.execute(baseTx, state);
      expect(tx).toEqual(baseTx);
      expect(state.setInTx).toHaveBeenCalledWith("X", 2, baseTx);
    });
  });

  describe("DELETE cmd", () => {
    it("should call delete on ctx", () => {
      spyOn(state, "delete");
      const cmd = new DeleteCommand(["Y"]);
      const { tx } = cmd.execute(baseTx, state);
      expect(tx).toEqual(baseTx);
      expect(state.delete).toHaveBeenCalledWith("Y", baseTx);
    });
  });

  // describe("COUNT cmd", () => {
  //   it("should call count on ctx", () => {
  //     const ctx = {
  //       count: () => {},
  //       output: () => {},
  //     };
  //     spyOn(ctx, "count").and.returnValue(3);
  //     spyOn(ctx, "output");
  //     const result = COUNT(ctx, [7]);
  //     expect(result).toBe(ctx);
  //     expect(ctx.count).toHaveBeenCalledWith(7);
  //     expect(ctx.output).toHaveBeenCalledWith("Count of 7: 3");
  //   });
  // });

  // describe("BEGIN cmd", () => {
  //   it("should call createChild on ctx", () => {
  //     const child = { id: 123 };
  //     const ctx = {
  //       createChild: () => child,
  //       output: () => {},
  //     };
  //     spyOn(ctx, "output");
  //     const result = BEGIN(ctx);
  //     expect(result).toBe(child);
  //     expect(ctx.output).toHaveBeenCalledWith("Began tx id=123");
  //   });
  // });

  // describe("ROLLBACK cmd", () => {
  //   it("should return parent ctx", () => {
  //     const parent = {};
  //     const ctx = {
  //       id: 7,
  //       parent,
  //       hasTx: true,
  //       output: () => {},
  //     };
  //     spyOn(ctx, "output");
  //     const result = ROLLBACK(ctx);
  //     expect(result).toBe(parent);
  //     expect(ctx.output).toHaveBeenCalledWith("Discarding tx 7");
  //   });

  //   it("should print warning and return self if in root ctx", () => {
  //     const ctx = {
  //       hasTx: false,
  //       output: () => {},
  //     };
  //     spyOn(ctx, "output");
  //     const result = ROLLBACK(ctx);
  //     expect(result).toBe(ctx);
  //     expect(ctx.output).toHaveBeenCalledWith("No transaction in progress.");
  //   });
  // });

  // describe("COMMIT cmd", () => {
  //   it("should call mergeWithParent and return parent", () => {
  //     const parent = {};
  //     const ctx = {
  //       parent,
  //       hasTx: true,
  //       mergeIntoParent: () => parent,
  //       output: () => {},
  //     };
  //     const result = COMMIT(ctx);
  //     expect(result).toBe(parent);
  //   });

  //   it("should print warning and return self if in root ctx", () => {
  //     const ctx = {
  //       hasTx: false,
  //       output: () => {},
  //     };
  //     spyOn(ctx, "output");
  //     const result = COMMIT(ctx);
  //     expect(result).toBe(ctx);
  //     expect(ctx.output).toHaveBeenCalledWith("No transaction in progress.");
  //   });
  // });
});
