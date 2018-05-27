"use strict";

const Category = require("../models/category");

exports.index = async (req, res) => {
  try {
    const categories = await Category.find();

    res.send(categories);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving categories"
    });
  }
};
