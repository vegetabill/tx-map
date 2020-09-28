function readLines(socket, lineHandler) {
  let buffer = "";
  socket.on("data", (data) => {
    buffer += data;
    if (buffer.match("\n")) {
      buffer
        .split("\n")
        .map((s) => s.trim())
        .filter((s) => s)
        .forEach((line) => {
          try {
            lineHandler(line);
          } catch (e) {
            if (e.recoverable) {
              socket.write(e.message + "\n");
            } else {
              socket.end();
              throw e;
            }
          }
        });
      buffer = "";
    }
  });
}

module.exports = readLines;
