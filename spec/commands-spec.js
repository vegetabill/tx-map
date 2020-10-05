const {
  GetCommand,
  SetCommand,
  DeleteCommand,
  RollbackCommand,
  BeginCommand,
  CommitCommand,
} = require("../lib/commands");
const impl = () => {
  throw new Error("must be mocked");
};
describe("Command execution", () => {
  const baseTx = 123;
  const state = {
    get: impl,
    setInTx: impl,
    delete: impl,
    rollback: impl,
    commit: impl
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

  describe("BEGIN cmd", () => {
    it("should call startTransaction and return new id", () => {
      const newTxId = 777;
      const txManager = { startTransaction: () => null };
      spyOn(txManager, "startTransaction").and.returnValue(newTxId);
      const cmd = new BeginCommand(null, txManager);
      const { tx, output } = cmd.execute();
      expect(txManager.startTransaction).toHaveBeenCalled();
      expect(tx).toEqual(newTxId);
      expect(output).toContain("Started transaction");
    });

    it("should not do anything if a tx is in progress", () => {
      const cmd = new BeginCommand();
      const { tx, output } = cmd.execute(baseTx);
      expect(tx).toEqual(baseTx);
      expect(output).toContain("not allowed");
    });
  });

  describe("ROLLBACK cmd", () => {
    it("should rollback state and conclude", () => {
      const txManager = { concludeTransaction: () => null };
      spyOn(txManager, "concludeTransaction");
      spyOn(state, "rollback");

      const cmd = new RollbackCommand(null, txManager);
      const { tx, output } = cmd.execute(baseTx, state);

      expect(tx).toBeFalsy();
      expect(output).toContain(`${baseTx} rolled back`);
      expect(state.rollback).toHaveBeenCalledWith(baseTx);
      expect(txManager.concludeTransaction).toHaveBeenCalledWith(baseTx);
    });

    it("should not do anything if a tx is not in progress", () => {
      const cmd = new RollbackCommand();
      const { tx, output } = cmd.execute();
      expect(tx).toBeFalsy();;
      expect(output).toContain("No transaction in progress");
    });
  });

  describe('COMMIT cmd', () => {
    it("should commit state and conclude", () => {
      const txManager = { concludeTransaction: () => null };
      spyOn(txManager, "concludeTransaction");
      spyOn(state, "commit");

      const cmd = new CommitCommand(null, txManager);
      const { tx, output } = cmd.execute(baseTx, state);

      expect(tx).toBeFalsy();
      expect(output).toContain(`${baseTx} committed`);
      expect(state.commit).toHaveBeenCalledWith(baseTx);
      expect(txManager.concludeTransaction).toHaveBeenCalledWith(baseTx);
    });

    it("should not do anything if a tx is not in progress", () => {
      const cmd = new CommitCommand();
      const { tx, output } = cmd.execute();
      expect(tx).toBeFalsy();
      expect(output).toContain("No transaction in progress");
    });
  });
  
});
