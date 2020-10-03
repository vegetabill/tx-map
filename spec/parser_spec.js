const { parseCommand } = require("../lib/parser");
const {
  GetCommand,
  SetCommand,
  DeleteCommand,
  CountCommand,
  BeginCommand,
  RollbackCommand,
  CommitCommand,
} = require("../lib/commands");

describe("command parsing", () => {
  it("should throw error for unknown command", () => {
    expect(() => parseCommand("OSITO WAS HERE")).toThrowError();
  });

  it("should parse GET command properly", () => {
    const cmd = parseCommand("GET z");
    expect(cmd).toBeInstanceOf(GetCommand);
    expect(cmd.key).toEqual("z");
  });

  it("should parse SET command with one string and one numeric arg", () => {
    const cmd = parseCommand("SET X 2");
    expect(cmd).toBeInstanceOf(SetCommand);
    expect(cmd.key).toEqual("X");
    expect(cmd.value).toEqual(2);
  });

  it("should parse DELETE with single string arg", () => {
    const cmd = parseCommand("DELETE Y");
    expect(cmd).toBeInstanceOf(DeleteCommand);
    expect(cmd.key).toEqual("Y");
  });

  it("should parse COUNT with single numeric arg", () => {
    const cmd = parseCommand("COUNT 7");
    expect(cmd).toBeInstanceOf(CountCommand);
    expect(cmd.value).toEqual(7);
  });

  it("should parse BEGIN with no args", () => {
    const cmd = parseCommand("BEGIN");
    expect(cmd).toBeInstanceOf(BeginCommand);
  });

  it("should parse ROLLBACK with no args", () => {
    const cmd = parseCommand("ROLLBACK");
    expect(cmd).toBeInstanceOf(RollbackCommand);
  });

  it("should parse COMMIT with no args", () => {
    const cmd = parseCommand("COMMIT");
    expect(cmd).toBeInstanceOf(CommitCommand);
  });

  it("should parse LOG with correct key arg", () => {
    const cmd = parseCommand("LOG A");
    expect(cmd).toBeInstanceOf(LogCommand);
    expect(cmd.key).toEqual("A");
  });
});
