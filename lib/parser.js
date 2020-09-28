/**
 * Parses a string into a function representing the command.
 */

const {
  GetCommand,
  CountCommand,
  SetCommand,
  DeleteCommand,
  BeginCommand,
  CommitCommand,
  RollbackCommand,
} = require("./commands");

const patterns = new Map([
  [/GET (\w+)/, GetCommand],
  [/COUNT (\d+)/, CountCommand],
  [/SET (\w+) (\d+)/, SetCommand],
  [/DELETE (\w+)/, DeleteCommand],
  [/^BEGIN$/, BeginCommand],
  [/^COMMIT$/, CommitCommand],
  [/^ROLLBACK$/, RollbackCommand],
]);

const defaultConverter = (args) => args;
const argsConverters = new Map();
argsConverters.set(SetCommand, (args) => [args[0], parseInt(args[1])]);
argsConverters.set(CountCommand, (args) => [parseInt(args[0])]);

function parseCommand(line) {
  for ([regex, CommandClass] of patterns) {
    const match = line.match(regex);
    if (match) {
      const convertArgs = argsConverters.get(CommandClass) || defaultConverter;
      const args = convertArgs(match.slice(1));
      return new CommandClass(args);
    }
  }

  const err = new Error(`Unable to parse command from '${line}'`);
  err.recoverable = true;
  throw err;
}

module.exports = { parseCommand };
