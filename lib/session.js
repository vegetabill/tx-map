const { parseCommand } = require("./parser");

const auditLog = (msg, id, tx) => {
  const txSuffix = tx ? `/tx ${tx}` : "/no tx";
  console.debug(`[session ${id}${txSuffix}] ${msg}`);
};

let id = 0;
/**
 * Creates a stateful session for a single user to run commands.
 */
function startSession(client, state) {
  const sessionId = id++;
  console.debug(`Client connected: session ${sessionId}`);

  let ongoingTx;

  const processLine = (line) => {
    auditLog(line, sessionId, ongoingTx);
    const cmd = parseCommand(line);
    const { tx, output } = cmd.execute(ongoingTx, state);
    ongoingTx = tx;
    if (output) {
      auditLog(output, sessionId, ongoingTx);
      client.write(output + "\n");
    }
  };

  return {
    processLine,
    close: () => null,
  };
}

module.exports = {
  startSession,
};
