const { createInterface } = require("readline");
const { startSession } = require("./lib/session");

const session = startSession();

const input = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

console.log("tx-map console");

input.on("line", (line) => {
  try {
    session.processLine(line);
  } catch (e) {
    console.error(e);
    if (!e.recoverable) {
      process.exit(-1);
    }
  }
});

input.on("close", () => console.log("👋"));
