const net = require("net");
const readLines = require("./lib/line-reader");
const { startSession } = require("./lib/session");
const Context = require("./lib/context");

const root = new Context();

const server = net.createServer((client) => {
  const outputListener = (msg) => {
    client.write(msg + "\n");
  };

  const session = startSession(root, outputListener);
  console.debug(`Client connected: session ${session.id}`);

  client.write("Tx-Map Console - Commands end with newline. \\q to quit.\n\n");

  readLines(client, (line) => {
    session.processLine(line);
  });

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
