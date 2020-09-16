// Read-only commands
function GET(ctx, args) {
  const [name] = args;
  const value = ctx.get(name);
  ctx.output(`${name} = ${value}`);
  return ctx;
}

function COUNT(ctx, args) {
  const [value] = args;
}

// Write commands
function SET(ctx, args) {
  const [name, value] = args;
  ctx.set(name, value);
  return ctx;
}

function DELETE(ctx) {
  const [name] = args;
  ctx.delete(name);
  return ctx;
}

// Transaction-related commands
function BEGIN(ctx) {
  const child = ctx.createChild();
  ctx.output(`Began tx id=${child.id}`);
  return child;
}

function COMMIT(ctx) {
  if (!ctx.hasTx) {
    ctx.output("No transaction in progress.");
    return ctx;
  } else {
    return ctx.mergeIntoParent();
  }
}

function ROLLBACK(ctx) {
  if (!ctx.hasTx) {
    ctx.output("No transaction in progress.");
    return ctx;
  } else {
    ctx.output(`Discarding tx ${ctx.id}`);
    return ctx.parent;
  }
}

const patterns = new Map([
  [/GET (\w+)/, GET],
  [/COUNT (\d+)/, COUNT],
  [/SET (\w+) (\d+)/, SET],
  [/DELETE (\w+)/, DELETE],
  [/^BEGIN$/, BEGIN],
  [/^COMMIT$/, COMMIT],
  [/^ROLLBACK$/, ROLLBACK],
]);

function parseCommand(line) {
  for ([regex, func] of patterns) {
    const match = line.match(regex);

    if (match) {
      const args = match.slice(1);
      return (ctx) => func(ctx, args);
    }
  }

  throw new Error(
    `Unable to parse command from ${line}, expected one of ${patterns}`
  );
}

module.exports = { parseCommand };
