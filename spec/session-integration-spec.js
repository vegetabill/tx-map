const { startSession } = require("../lib/session");
const createMap = require("../lib/mvcc-map");

describe("concurrent sessions", () => {
  let state, A, B;

  const buildOutputSink = () => {
    const lines = [];

    return {
      write: (line) => lines.push(line),
      lines,
    };
  };

  const buildSession = () => {
    const sess = {
      output: buildOutputSink(),
    };
    sess.session = startSession(sess.output, state);
    sess.exec = (line) => {
      sess.session.processLine(line);
      return sess.lastLine();
    };
    sess.lastLine = () => sess.output.lines.slice(-1)[0];
    return sess;
  };
  const createConcurrentSessions = () => [buildSession(), buildSession()];

  beforeEach(() => {
    state = createMap();
    [A, B] = createConcurrentSessions();
  });

  it("should ensure uncommitted values are not visible to other tx", () => {
    A.exec("BEGIN");
    A.exec("SET A 3");
    expect(B.exec("GET A")).toContain("A is not set");
  });

  it("should ensure values committed after tx start are not visible", () => {
    A.exec("BEGIN");
    B.exec("SET A 3");
    expect(A.exec("GET A")).toContain("A is not set");
  });

  it("should ensure transaction always sees its own values regardless of other tx", () => {
    A.exec("SET Z 1");
    B.exec("BEGIN");
    expect(B.exec("GET Z")).toContain("Z = 1");
    A.exec("SET Z 666");
    expect(B.exec("GET Z")).toContain("Z = 1");
    B.exec("SET Z 4");
    expect(B.exec("GET Z")).toContain("Z = 4");
    A.exec("DELETE Z");
    expect(B.exec("GET Z")).toContain("Z = 4");
    B.exec("DELETE Z");
    expect(B.exec("GET Z")).toContain("Z is not set");
  });
});
