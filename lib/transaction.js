let counter = 1;

function startTransaction() {
  return counter++;
}

module.exports = startTransaction;
