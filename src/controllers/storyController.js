"use strict";

const path = require("path");
const fs = require("fs");

const Story = require("../models/story");

exports.index = async (req, res) => {
  const {
    userID,
    categoryID,
    title,
    slug,
    content,
    sort = "asc",
    skip = 0,
    take = Story.count()
  } = req.query;
  const query = {};

  if (userID) query.user = userID;
  if (categoryID) query.category = categoryID;
  if (slug) query.slug = slug;
  if (title) query.title = new RegExp(title, "i");
  if (content) query.content = new RegExp(content, "i");

  try {
    const stories = await Story.find(query)
      .sort(`${sort === "desc" ? "-" : ""}createdAt`)
      .skip(Number(skip))
      .limit(Number(take))
      .exec();

    res.send(stories);
  } catch (error) {
    res.status(500).send({
      message: "Error occurred while retrieving stories"
    });
  }
};

exports.create = async (req, res) => {
  const { body, file } = req;
  const payload = { ...body };

  if (file) {
    payload.thumbnail = file.filename;
  }

  const newStory = new Story(payload);

  try {
    const story = await newStory.save();
    res.send(story);
  } catch (error) {
    console.log(error);
    return res.status(400).send({
      message: "Error occurred while creating story"
    });
  }
};

exports.update = async (req, res) => {
  const { params, body, file } = req;
  const payload = { ...body };

  if (file) {
    payload.thumbnail = file.filename;
  }

  try {
    const { thumbnail } = await Story.findOne({ _id: params.id });
    const story = await Story.findOneAndUpdate({ _id: params.id }, payload, {
      new: true
    });

    if (!story) {
      return res.status(404).send({
        message: "Story not found"
      });
    }

    const filePath = path.resolve("public/images/stories");
    const fullpath = `${filePath}/${thumbnail}`;

    // Delete photo if exist
    if (fs.existsSync(fullpath)) {
      fs.unlinkSync(fullpath);
    }

    res.send(story);
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Story not found"
      });
    }

    return res.status(500).send({
      message: "Error finding story"
    });
  }
};

exports.delete = async (req, res) => {
  const { params } = req;

  try {
    const { thumbnail } = await Story.findOne({ _id: params.id });
    const story = await Story.remove({ _id: params.id });

    if (!story) {
      return res.status(404).send({
        message: "Story not found"
      });
    }

    const filePath = path.resolve("public/images/stories");
    const fullpath = `${filePath}/${thumbnail}`;

    // Delete photo if exist
    if (fs.existsSync(fullpath)) {
      fs.unlinkSync(fullpath);
    }

    res.send({ message: "Story deleted successfully!" });
  } catch (error) {
    if (error.kind === "ObjectId") {
      return res.status(404).send({
        message: "Story not found"
      });
    }

    return res.status(500).send({
      message: "Couldn't delete story"
    });
  }
};
