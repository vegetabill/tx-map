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

  describe("SET cmd", () => {
    it("should set state on the active ctx", () => {
      const ctx = {
        set: () => {},
      };
      spyOn(ctx, "set");
      const cmd = parseCommand("SET X 2");
      cmd(ctx);
      expect(ctx.set).toHaveBeenCalledWith("X", 2);
    });
  });

  describe("DELETE cmd", () => {
    it("should call delete on ctx", () => {
      const ctx = {
        delete: () => {},
      };
      spyOn(ctx, "delete");
      const cmd = parseCommand("DELETE Y");
      cmd(ctx);
      expect(ctx.delete).toHaveBeenCalledWith("Y");
    });
  });

  describe("COUNT cmd", () => {
    it("should call count on ctx", () => {
      const ctx = {
        count: () => {},
        output: () => {},
      };
      spyOn(ctx, "count").and.returnValue(3);
      spyOn(ctx, "output");
      const cmd = parseCommand("COUNT 7");
      const result = cmd(ctx);
      expect(result).toBe(ctx);
      expect(ctx.count).toHaveBeenCalledWith(7);
      expect(ctx.output).toHaveBeenCalledWith("Count of 7: 3");
    });
  });
});
