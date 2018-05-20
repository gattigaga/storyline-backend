"use strict";

const mongoose = require("mongoose");
const { database } = require("../config/app");

mongoose.connect(database);

const Follow = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    followed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Follow", Follow);
