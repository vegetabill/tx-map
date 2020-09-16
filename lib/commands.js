// Read-only commands
function GET(ctx, args) {
  const [name] = args;
  const value = ctx.get(name);
  ctx.output(`${name} = ${value}`);
  return ctx;
}

function COUNT(ctx, args) {
  const value = parseInt(args[0]);
  const count = ctx.count(value);
  ctx.output(`Count of ${value}: ${count}`);
  return ctx;
}

// Write commands
function SET(ctx, args) {
  const [name, value] = args;
  ctx.set(name, parseInt(value));
  return ctx;
}

function DELETE(ctx, args) {
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

module.exports = {
  GET,
  COUNT,
  SET,
  DELETE,
  BEGIN,
  COMMIT,
  ROLLBACK,
};
