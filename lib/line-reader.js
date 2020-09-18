function readLines(socket, lineHandler) {
  let buffer = "";
  socket.on("data", (data) => {
    buffer += data;
    if (buffer.match("\n")) {
      buffer
        .split("\n")
        .filter((s) => s.trim())
        .forEach((line) => {
          try {
            lineHandler(line);
          } catch (e) {
            if (e.recoverable) {
              socket.write("\n" + e.toString() + "\n");
            } else {
              socket.close();
              throw e;
            }
          }
        });
      buffer = "";
    }
  });
}

module.exports = readLines;
