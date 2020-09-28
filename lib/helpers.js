function validateIntArg(value, name = "arg") {
  if (parseInt(value) !== value) {
    throw new Error(`Invalid integer argument: ${name}=${value}`);
  }
  return true;
}

module.exports = {
  validateIntArg,
};
