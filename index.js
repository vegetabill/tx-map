const { createInterface } = require("readline");
const { startSession } = require("./lib/session");

const session = startSession();

const input = createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

console.log("Tx Map");

input.on("line", (line) => {
  try {
    session.processLine(line);
  } catch (e) {
    console.error(e);
  }
});

input.on("close", () => console.log("👋"));
