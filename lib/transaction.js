let nextId = 1;

let minConcluded = nextId - 1;

const txState = new Map();

function updateMinConcluded() {
  for (let candidate = minConcluded + 1; candidate < nextId; candidate++) {
    if (txState.get(candidate) === false) {
      minConcluded = candidate;
      txState.delete(candidate);
    } else {
      break;
    }
  }
}

function concludeTransaction(id) {
  txState.set(id, false);
  updateMinConcluded();
}

function startTransaction() {
  const id = nextId++;
  txState.set(id, true);
  return id;
}

/**
 * All tx ids below highwater are guaranteed to be concluded (either committed or rolled back)
 * and so any data that only refers to these can be safely cleaned up.
 *
 * ids higher than this number _may_ already be concluded but it is not guaranteed
 *
 * return {Integer} tx id
 */
function getMinimumConcludedId() {
  return minConcluded;
}

module.exports = {
  startTransaction,
  concludeTransaction,
  getMinimumConcludedId,
};
