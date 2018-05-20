"use strict";

const Like = require("../models/like");

exports.index = async (req, res) => {
  const { storyID } = req.query;
  const query = {};

  if (storyID) query.story = storyID;

  try {
    const likes = await Like.find(query);

    res.send(likes);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving likes"
    });
  }
};

exports.create = async (req, res) => {
  const { body } = req;
  const newLike = new Like(body);

  try {
    const like = await newLike.save();
    res.status(201).send(like);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating like"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const like = await Like.remove({ _id: params.id });

    if (!like) {
      return res.status(404).send({
        message: "Like not found"
      });
    }

    res.send({ message: "Like deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Like not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete Like"
    });
  }
};
