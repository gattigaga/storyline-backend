const User = require("../models/user");
const Story = require("../models/story");
const Like = require("../models/like");

exports.up = async () => {
  try {
    const users = await User.find().limit(10);
    const stories = await Story.find().limit(10);
    let likes = [];

    const createLike = user => story => ({
      user: user._id,
      story: story._id
    });

    // Each user like 3 first stories
    users.forEach(user => {
      likes = [...likes, ...stories.slice(0, 3).map(createLike(user))];
    });

    // 3 users like next 2 stories
    users.slice(0, 3).forEach(user => {
      likes = [...likes, ...stories.slice(3, 5).map(createLike(user))];
    });

    // First users likes all next stories
    users.slice(0, 1).forEach(user => {
      likes = [...likes, ...stories.slice(5).map(createLike(user))];
    });

    await Like.create(likes);
    console.log("Likes successfully seeded");
  } catch (error) {
    console.error(error);
  }
};

exports.down = async () => {
  try {
    await Like.remove({});
    console.log("Likes successfully truncated");
  } catch (error) {
    console.error(error);
  }
};
