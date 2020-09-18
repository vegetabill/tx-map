const { parseCommand } = require("./parser");
const Context = require("./context");

let id = 0;
/**
 * Creates a stateful session for a single user to run commands.
 */
function startSession(context, outputListener) {
  let ctx = context.createChild();
  ctx.outputListener = outputListener;

  const processLine = (line) => {
    const cmd = parseCommand(line);
    ctx = cmd(ctx);
  };

  return {
    id: id++,
    processLine,
    close: () => null,
  };
}

module.exports = {
  startSession,
};
