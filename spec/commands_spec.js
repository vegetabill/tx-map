const { GET, SET, DELETE, COUNT } = require("../lib/commands");

describe("command parsing", () => {
  describe("GET cmd", () => {
    it("should print value of variable when present", () => {
      const ctx = {
        get: () => 1,
        output: () => {},
      };
      spyOn(ctx, "output");

      const result = GET(ctx, ["z"]);

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
      SET(ctx, ["X", 2]);
      expect(ctx.set).toHaveBeenCalledWith("X", 2);
    });
  });

  describe("DELETE cmd", () => {
    it("should call delete on ctx", () => {
      const ctx = {
        delete: () => {},
      };
      spyOn(ctx, "delete");
      DELETE(ctx, ["Y"]);
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
      const result = COUNT(ctx, [7]);
      expect(result).toBe(ctx);
      expect(ctx.count).toHaveBeenCalledWith(7);
      expect(ctx.output).toHaveBeenCalledWith("Count of 7: 3");
    });
  });

  describe("BEGIN cmd", () => {
    it("should call ", () => {});
  });
});
