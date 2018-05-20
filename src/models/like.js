"use strict";

const mongoose = require("mongoose");
const { database } = require("../config/app");

mongoose.connect(database);

const Like = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    story: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Story",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Like", Like);
