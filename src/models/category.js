"use strict";

const mongoose = require("mongoose");
const { database } = require("../config/app");

mongoose.connect(database);

const Category = new mongoose.Schema({
  name: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("Category", Category);
