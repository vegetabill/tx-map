/**
 * Parses a string into a function representing the command.
 * Can be executed by passing in an instance of `Context`
 */

const {
  GET,
  COUNT,
  SET,
  DELETE,
  BEGIN,
  COMMIT,
  ROLLBACK,
} = require("./commands");

const patterns = new Map([
  [/GET (\w+)/, GET],
  [/COUNT (\d+)/, COUNT],
  [/SET (\w+) (\d+)/, SET],
  [/DELETE (\w+)/, DELETE],
  [/^BEGIN$/, BEGIN],
  [/^COMMIT$/, COMMIT],
  [/^ROLLBACK$/, ROLLBACK],
]);

const defaultConverter = (args) => args;
const argsConverters = new Map();
argsConverters.set(SET, (args) => [args[0], parseInt(args[1])]);
argsConverters.set(COUNT, (args) => [parseInt(args[0])]);

function parseCommand(line) {
  for ([regex, func] of patterns) {
    const match = line.match(regex);
    if (match) {
      const args = match.slice(1);
      const command = (ctx) => func(ctx, args);
      const convertArgs = argsConverters.get(func) || defaultConverter;

      // attach args and the original function as props, mostly for simpler testing
      // not needed at rutime
      command.args = convertArgs(args);
      command.impl = func;

      return command;
    }
  }

  const err = new Error(
    `Unable to parse command from ${line}, expected one of: ${[
      ...patterns.values(),
    ]
      .map((func) => func.name)
      .join(", ")}`,
  );
  err.recoverable = true;
  throw err;
}

module.exports = { parseCommand };
