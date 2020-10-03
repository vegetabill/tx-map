const { validateIntArg } = require("./helpers");
const { logDebug } = require("./logger");

const validateValue = (value) => validateIntArg(value, "value");
const validateTx = (tx) => validateIntArg(tx, "tx");

const TOMBSTONE = { TOMBSTONE: true };
const isDeletion = (version) => version && version.value === TOMBSTONE;

let versionSequence = 1;

const nextId = () => versionSequence++;

function createVersionedValue() {
  const committedVersions = [];

  const versionsByTx = new Map();

  const writeForTx = (value, tx) => {
    validateTx(tx) && (value === TOMBSTONE || validateValue(value));
    versionsByTx.set(tx, { id: nextId(), value, txMin: tx });
  };

  const findLatestVisibleTo = (tx) => {
    const candidates = committedVersions.filter(
      ({ txMin, txMax }) => tx >= txMin && tx <= txMax,
    );
    if (candidates.length === 0) {
      return;
    }
    return candidates.reduce((result, version) => {
      return version.txMin > result.txMin ? version : result;
    });
  };

  const versionVisibleTo = (tx) => {
    validateTx(tx);

    if (versionsByTx.has(tx)) {
      return versionsByTx.get(tx);
    }
    return findLatestVisibleTo(tx);
  };

  const commitVersion = (version) => {
    logDebug("Committing", version);
    const priorVersion = findLatestVisibleTo(version.txMin);
    logDebug("Ancestor version prior to commit:", priorVersion);
    if (priorVersion) {
      priorVersion.txMax = version.txMin - 1;
    }
    logDebug("Ancestor version post-commit:", priorVersion);
    if (!isDeletion(version)) {
      const cv = { ...version, txMax: Number.POSITIVE_INFINITY };
      logDebug("commit version", cv);
      committedVersions.push(cv);
    }
  };

  const cleanupTx = (tx) => versionsByTx.delete(tx);

  const commit = (tx) => {
    if (!versionsByTx.has(tx)) {
      return;
    }
    const version = versionsByTx.get(tx);
    commitVersion(version);
    cleanupTx(tx);
  };

  const valueVisibleTo = (tx) => {
    const version = versionVisibleTo(tx);
    if (version && !isDeletion(version)) {
      return version.value;
    }
  };

  const recordDeletion = (tx) => {
    return writeForTx(TOMBSTONE, tx);
  };

  const debug = () => {
    committedVersions.forEach((cv) => logDebug("committed version", cv));
    versionsByTx.forEach((version, tx) =>
      logDebug("uncommitted tx", tx, "version", version),
    );
  };

  return {
    writeForTx,
    valueVisibleTo,
    recordDeletion,
    versionVisibleTo,
    commit,
    rollback: cleanupTx,
    debug,
  };
}

module.exports = createVersionedValue;
