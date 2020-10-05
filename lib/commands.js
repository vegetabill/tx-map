const { startTransaction, concludeTransaction } = require("./transaction");

class BeginCommand {
  constructor(_, txManager) {
    this.txManager = txManager || { startTransaction };
  }
  execute(ongoingTx) {
    if (ongoingTx) {
      return {
        tx: ongoingTx,
        output: "Sub-transactions are not allowed. COMMIT or ROLLBACK first",
      };
    }
    const newTx = this.txManager.startTransaction();
    return {
      tx: newTx,
      output: `Started transaction ID=${newTx}`,
    };
  }
}

class TxConcludingCommand {
  constructor(_, txManager) {
    this.txManager = txManager || { concludeTransaction };
  }

  execute(ongoingTx, state) {
    if (!ongoingTx) {
      return {
        tx: ongoingTx,
        output: "No transaction in progress. Use BEGIN",
      };
    }
    const output = this.concludeTx(ongoingTx, state);
    this.txManager.concludeTransaction(ongoingTx);
    return {
      tx: null,
      output,
    };
  }
}

class CommitCommand extends TxConcludingCommand {
  concludeTx(ongoingTx, state) {
    state.commit(ongoingTx);
    return `Transaction ${ongoingTx} committed successfully.`;
  }
}

class RollbackCommand extends TxConcludingCommand {
  concludeTx(ongoingTx, state) {
    state.rollback(ongoingTx);
    return `Transaction ${ongoingTx} rolled back.`;
  }
}

class AutoCommitCommand {
  execute(ongoingTx, state) {
    if (ongoingTx) {
      return this.doExecute(ongoingTx, state);

    }
    const autoTx = startTransaction();
    const { output } = this.doExecute(autoTx, state);
    state.commit(autoTx);
    concludeTransaction(autoTx);
    return {
      output,
    };
  }
}

class GetCommand extends AutoCommitCommand {
  constructor(args) {
    super(args);
    [this.key] = args;
  }
  doExecute(tx, state) {
    const value = state.get(this.key, tx);
    const output = value ? `${this.key} = ${value}` : `${this.key} is not set.`;
    return {
      tx,
      output,
    };
  }
}

class CountCommand extends AutoCommitCommand {
  constructor(args) {
    super(args);
    [this.value] = args;
  }
  doExecute(tx, state) {
    return {
      tx,
      output: "COUNT not yet implemented",
    };
  }
}

class SetCommand extends AutoCommitCommand {
  constructor(args) {
    super(args);
    [this.key, this.value] = args;
  }
  doExecute(tx, state) {
    state.setInTx(this.key, this.value, tx);
    return {
      tx,
      output: `${this.key} set to ${this.value}`,
    };
  }
}

class DeleteCommand extends AutoCommitCommand {
  constructor(args) {
    super(args);
    [this.key] = args;
  }
  doExecute(tx, state) {
    state.delete(this.key, tx);
    return {
      tx,
      output: `${this.key} deleted`,
    };
  }
}

class LogCommand {
  constructor(args) {
    [this.key] = args;
  }
  execute(tx, state) {
    state.log(this.key, tx);

    return {
      tx,
      output: `${this.key} logged.`,
    };
  }
}

module.exports = {
  GetCommand,
  CountCommand,
  SetCommand,
  DeleteCommand,
  BeginCommand,
  CommitCommand,
  RollbackCommand,
  LogCommand,
};
