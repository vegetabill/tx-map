const { validateIntArg } = require("./helpers");

function createVersionedValue() {
  const versions = [];

  const validateArgs = (value, tx) =>
    validateIntArg(value, "value") && validateIntArg(tx, "tx");

  const writeForTx = (value, tx) => {
    validateArgs(value, tx);
    const version = { value, txMin: tx, txMax: tx };
    versions.push(version);
    return version;
  };

  const versionVisibleTo = (tx) => {
    validateIntArg(tx, "tx");
    const candidates = versions.filter(
      ({ txMin, txMax }) => tx >= txMin && tx <= txMax,
    );
    if (candidates.length === 0) {
      return;
    }
    const newest = candidates.reduce((result, version) => {
      return version.txMin > result.txMin ? version : result;
    });
    if (newest) {
      return newest.value;
    }
  };

  return {
    writeForTx,
    versionVisibleTo,
  };
}

function createMap() {
  const state = new Map();
  const versionsInTx = new Map();

  const recordVersion = (tx, version) => {
    const existing = versionsInTx.get(tx);
    if (existing) {
      versionsInTx.set(tx, existing.concat(version));
    } else {
      versionsInTx.set(tx, [version]);
    }
  };

  const allVersionsInTx = (tx) => versionsInTx.get(tx) || [];

  const get = (key, tx) => {
    const value = state.get(key);
    if (value) {
      return value.versionVisibleTo(tx);
    }
  };

  const getVersionedValue = (key) => {
    if (!state.has(key)) {
      state.set(key, createVersionedValue());
    }
    return state.get(key);
  };

  const setInTx = (key, value, tx) => {
    const version = getVersionedValue(key).writeForTx(value, tx);
    recordVersion(tx, version);
  };

  const commit = (tx) => {
    allVersionsInTx(tx).forEach((version) => {
      version.txMax = Number.POSITIVE_INFINITY;
    });
  };

  const rollback = (tx) => {
    versionsInTx.delete(tx);
  };

  return {
    get,
    setInTx,
    commit,
    rollback,
  };
}

module.exports = createMap;
