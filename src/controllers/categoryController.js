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

exports.read = async (req, res) => {
  const { params } = req;

  try {
    const category = await Category.findById(params.id);

    if (!category) {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    res.send(category);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Category not found"
      });
    }

    return res.status(500).send({
      message: "Error retrieving category"
    });
  }
};