"use strict";

const User = require("../models/user");

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
    const user = await User.findOneAndUpdate({ _id: params.id }, payload, {
      new: true
    });

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
      message: "Error finding user"
    });
  }
};
