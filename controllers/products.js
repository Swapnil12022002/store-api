const { query } = require("express");
const asyncWrapper = require("../middleware/async");
const Product = require("../models/product");

const getAllProducts = asyncWrapper(async (req, res) => {
  const { featured, company, search, sort, select, numericFilters } = req.query;
  const queryObj = {};

  if (featured) {
    queryObj.featured = featured === "true" ? true : false;
  }

  if (company) {
    queryObj.company = company;
  }

  if (search) {
    queryObj.name = { $regex: search, $options: "i" };
  }

  if (numericFilters) {
    const operatorMap = {
      ">": "$gt",
      ">=": "$gte",
      "=": "$eq",
      "<": "$lt",
      "<=": "$lte",
    };
    console.log(numericFilters);
    const regex = /\b(>|>=|=|<=|<)\b/g;
    let filters = numericFilters.replace(
      regex,
      (match) => `-${operatorMap[match]}-`
    );
    console.log(filters);
    const options = ["price", "rating"];
    filters = filters.split(",").forEach((item) => {
      const [field, operator, value] = item.split("-");
      if (options.includes(field)) {
        queryObj[field] = { [operator]: Number(value) };
      }
    });
  }

  let result = Product.find(queryObj);

  if (sort) {
    sortList = sort.split(",").join(" ");
    result = result.sort(sortList);
  } else {
    result = result.sort("createdAt");
  }

  if (select) {
    selectedList = select.split(",").join(" ");
    result = result.select(selectedList);
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  result = result.skip(skip).limit(limit);

  console.log(queryObj);

  const products = await result;
  res.status(200).json({ products, number: products.length });
});

module.exports = getAllProducts;
