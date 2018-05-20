"use strict";

const Follow = require("../models/follow");

exports.index = async (req, res) => {
  const { followerID, followedID } = req.query;
  const query = {};

  if (followerID) query.follower = followerID;
  if (followedID) query.followed = followedID;

  try {
    const follows = await Follow.find(query);

    res.send(follows);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving follows"
    });
  }
};

exports.create = async (req, res) => {
  const { body } = req;
  const newFollow = new Follow(body);

  try {
    const follow = await newFollow.save();
    res.status(201).send(follow);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating follow"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const follow = await Follow.remove({ _id: params.id });

    if (!follow) {
      return res.status(404).send({
        message: "Follow not found"
      });
    }

    res.send({ message: "Follow deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Follow not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete Follow"
    });
  }
};
