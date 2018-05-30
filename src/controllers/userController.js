"use strict";

const path = require("path");
const fs = require("fs");

const User = require("../models/user");

exports.index = async (req, res) => {
  const { username } = req.query;
  const query = {};

  if (username) query.username = username;

  try {
    const users = await User.find(query);

    res.send(users);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving users"
    });
  }
};

exports.read = async (req, res) => {
  const { params } = req;

  try {
    const user = await User.findById(params.id);

    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }

    res.send(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "User not found"
      });
    }

    return res.status(500).send({
      message: "Error retrieving user"
    });
  }
};

exports.update = async (req, res) => {
  const { params, body, file } = req;
  const payload = { ...body };

  if (file) {
    payload.photo = file.filename;
  }

  try {
    const { photo } = await User.findOne({ _id: params.id });
    const user = await User.findOneAndUpdate({ _id: params.id }, payload, {
      new: true
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }

    const filePath = path.resolve("public/images/users");
    const fullpath = `${filePath}/${photo}`;

    // Delete photo if exist
    if (fs.existsSync(fullpath)) {
      fs.unlinkSync(fullpath);
    }

    res.send(user);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "User not found"
      });
    }

    return res.status(500).send({
      message: "Error finding user"
    });
  }
};
