const { parseCommand } = require("./commands");
const Context = require("./context");

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
