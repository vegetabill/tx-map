const createVersionedValue = require("./versioned-value");
const { logDebug } = require("./logger");
const { getMinimumConcludedId } = require("./transaction");

function createMap() {
  const state = new Map();
  const keysModifiedByTx = new Map();

  const recordModification = (tx, key) => {
    if (!keysModifiedByTx.has(tx)) {
      keysModifiedByTx.set(tx, new Set());
    }
    const existing = keysModifiedByTx.get(tx);
    existing.add(key);
  };

  const getAllKeysModifiedByTx = (tx) =>
    keysModifiedByTx.has(tx) ? [...keysModifiedByTx.get(tx)] : [];
  
  const get = (key, tx) => {
    const value = state.get(key);
    if (value) {
      return value.valueVisibleTo(tx);
    }
  };

  const getVersionedValue = (key) => {
    if (!state.has(key)) {
      state.set(key, createVersionedValue(key));
    }
    return state.get(key);
  };

  const setInTx = (key, value, tx) => {
    getVersionedValue(key).writeForTx(value, tx);
    recordModification(tx, key);
  };

  const cleanup = () => {
    const expiredTxs = [...keysModifiedByTx.keys()].filter(
      (tx) => tx <= getMinimumConcludedId(),
    );
    expiredTxs.forEach((tx) => keysModifiedByTx.delete(tx));
  };

  const commitAll = (tx, keys) => {
    keys.forEach((key) => getVersionedValue(key).commit(tx));
  };

  const commit = (tx) => {
    const keysModified = keysModifiedByTx.get(tx);
    if (keysModified) {
      commitAll(tx, keysModified);
    }
    cleanup();
  };

  const rollback = (tx) => {
    getAllKeysModifiedByTx(tx).forEach((key) =>
      getVersionedValue(key).rollback(tx),
    );
    cleanup();
  };

  const del = (key, tx) => {
    getVersionedValue(key).recordDeletion(tx);
    recordModification(tx, key);
  };

  const log = (key, tx) => {
    logDebug(`[${tx}] LOG ${key}`);
    logDebug("Active writes by tx", keysModifiedByTx);

    const val = state.get(key);
    if (val) {
      val.debug();
    }
  };

  return {
    get,
    setInTx,
    delete: del,
    commit,
    rollback,
    log,
  };
}

module.exports = createMap;
