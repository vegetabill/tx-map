const { parseCommand } = require("../lib/parser");
const {
  GET,
  SET,
  DELETE,
  COUNT,
  BEGIN,
  ROLLBACK,
  COMMIT,
} = require("../lib/commands");

describe("command parsing", () => {
  it("should throw error for unknown command", () => {
    expect(() => parseCommand("OSITO WAS HERE")).toThrowError();
  });

  it("should parse GET command properly", () => {
    const cmd = parseCommand("GET z");
    expect(typeof cmd).toEqual("function");
    expect(cmd.args).toEqual(["z"]);
    expect(cmd.impl).toBe(GET);
  });

  it("should parse SET command with one string and one numeric arg", () => {
    const cmd = parseCommand("SET X 2");
    expect(typeof cmd).toEqual("function");
    expect(cmd.args).toEqual(["X", 2]);
    expect(cmd.impl).toEqual(SET);
  });

  it("should parse DELETE with single string arg", () => {
    const cmd = parseCommand("DELETE Y");
    expect(typeof cmd).toEqual("function");
    expect(cmd.args).toEqual(["Y"]);
    expect(cmd.impl).toEqual(DELETE);
  });

  it("should parse COUNT with single numeric arg", () => {
    const cmd = parseCommand("COUNT 7");
    expect(typeof cmd).toEqual("function");
    expect(cmd.args).toEqual([7]);
    expect(cmd.impl).toEqual(COUNT);
  });

  it("should parse BEGIN with no args", () => {
    const cmd = parseCommand("BEGIN");
    expect(typeof cmd).toEqual("function");
    expect(cmd.args).toEqual([]);
    expect(cmd.impl).toEqual(BEGIN);
  });

  it("should parse ROLLBACK with no args", () => {
    const cmd = parseCommand("ROLLBACK");
    expect(typeof cmd).toEqual("function");
    expect(cmd.args).toEqual([]);
    expect(cmd.impl).toEqual(ROLLBACK);
  });

  it("should parse COMMIT with no args", () => {
    const cmd = parseCommand("COMMIT");
    expect(typeof cmd).toEqual("function");
    expect(cmd.args).toEqual([]);
    expect(cmd.impl).toEqual(COMMIT);
  });
});
