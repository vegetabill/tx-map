const net = require("net");
const readLines = require("./lib/line-reader");
const createMap = require("./lib/mvcc-map");
const { startSession } = require("./lib/session");
const state = createMap();

const server = net.createServer((client) => {
  const session = startSession(client, state);
  client.write("Tx-Map Console - Commands end with newline. \\q to quit.\n\n");
  readLines(client, (line) => session.processLine(line));
  client.on("close", () => session.close());
  client.on("end", () => session.close());
  client.on("error", (err) => console.error(err));
});

const port = process.env.PORT || 7777;
server.listen(port, () => {
  console.log(`Tx Map server listening on port ${port}`);
});
server.on("error", (err) => {
  throw err;
});
