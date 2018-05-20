"use strict";

const mongoose = require("mongoose");
const { database } = require("../config/app");

mongoose.connect(database);

const Choice = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Choice", Choice);
