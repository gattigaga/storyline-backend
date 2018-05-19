"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../config/app");

const User = require("../models/user");

// Authenticate a user
exports.login = async (req, res) => {
  const { username, email, password } = req.body;
  const authField = username ? "username" : "email";
  const authValue = username || email;

  try {
    const user = await User.findOne({
      [authField]: authValue
    });

    if (!user) {
      return res.status(404).send({
        message: "User not found"
      });
    }

    try {
      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).send({
          message: "Password did not match"
        });
      }

      const payload = { _id: user._id };
      const token = jwt.sign(payload, config.secret);

      res.send({ message: "User successfully authenticated", token });
    } catch (error) {
      return res.status(401).send({
        message: "Password did not match"
      });
    }
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

// Register new user
exports.register = async (req, res) => {
  const { body, file } = req;
  const payload = { ...body };

  if (file) {
    payload.photo = file.filename;
  }

  const newUser = new User(payload);

  try {
    const user = await newUser.save();
    res.send(user);
  } catch (error) {
    return res.status(400).send({
      message: "Error occurred while creating user"
    });
  }
};

// Get authenticated user
exports.me = (req, res) => res.send(req.user);
