const httpStatus = require("http-status");

const validate = (schema) => async (req, res, next) => {
  for (const key in schema) {
    const value = req[key];
    const { error } = schema[key].validate(value, { abortEarly: false });

    if (error) {
      const { details } = error;
      const message = details.map((i) => i.message).join(',').replace(/"/g, '');

      return res.status(httpStatus.BAD_REQUEST).json({
        message: error.message,
        code: httpStatus.BAD_REQUEST,
      });
    }
  }

  next();
};

module.exports = validate;