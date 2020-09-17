const { parseCommand } = require("./parser");
const Context = require("./context");

/**
 * Creates a stateful session for a single
 * terminal user to run commands.
 */
function startSession() {
  const root = new Context();

  let ctx = root;

  const processLine = (line) => {
    const cmd = parseCommand(line);
    ctx = cmd(ctx);
  };

  return {
    processLine,
  };
}

module.exports = {
  startSession,
};
