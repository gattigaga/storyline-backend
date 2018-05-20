"use strict";

const Choice = require("../models/choice");

exports.index = async (req, res) => {
  const { userID, categoryID } = req.query;
  const query = {};

  if (userID) query.user = userID;
  if (categoryID) query.category = categoryID;

  try {
    const choices = await Choice.find(query);

    res.send(choices);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving choices"
    });
  }
};

exports.create = async (req, res) => {
  const { body } = req;
  const newChoice = new Choice(body);

  try {
    const choice = await newChoice.save();
    res.status(201).send(choice);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating choice"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const choice = await Choice.remove({ _id: params.id });

    if (!choice) {
      return res.status(404).send({
        message: "Choice not found"
      });
    }

    res.send({ message: "Choice deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Choice not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete Choice"
    });
  }
};
