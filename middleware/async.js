const { createCustomError } = require("../errors/custom-error");

const asyncWrapper = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(createCustomError("Oops!! Something went wrong.", 500));
    }
  };
};

module.exports = asyncWrapper;
