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
      command.args = convertArgs(args);
      command.impl = func;
      return command;
    }
  }

  throw new Error(
    `Unable to parse command from ${line}, expected one of: ${[
      ...patterns.values(),
    ]
      .map((func) => func.name)
      .join(", ")}`
  );
}

module.exports = { parseCommand };
