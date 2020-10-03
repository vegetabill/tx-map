const isVerbose = process.env.VERBOSE === "true";

if (isVerbose) {
  logInfo("Verbose logging enabled. Unset env var VERBOSE to disable.");
}

function log(level, ...args) {
  console[level](...args);
}

function logInfo(...args) {
  log("log", ...args);
}
function logError(...args) {
  log("error", ...args);
}
function logDebug(...args) {
  if (isVerbose) {
    log("debug", ...args);
  }
}

module.exports = {
  logInfo,
  logError,
  logDebug,
  log,
};
