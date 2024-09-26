const ObjectId = (value, helpers) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('ID Invalid ObjectId');
  }
  return value;
};

module.exports = {ObjectId};