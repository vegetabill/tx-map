const { parseCommand } = require("../lib/commands");

describe("command parsing", () => {
  it("should throw error for unknown command", () => {
    expect(() => parseCommand("OSITO WAS HERE")).toThrowError();
  });

  describe("GET cmd", () => {
    it("should print value of variable when present", () => {
      const ctx = {
        get: () => 1,
        output: () => {},
      };
      spyOn(ctx, "output");

      const cmd = parseCommand("GET z");
      const result = cmd(ctx);

      expect(result).toBe(ctx);

      expect(ctx.output).toHaveBeenCalledWith("z = 1");
    });
  });
});
