const ObjectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}} " ' + "must be a valid ObjectId.");
  }
  return value;
};

module.exports = { ObjectId };