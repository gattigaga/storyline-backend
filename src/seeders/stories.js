const faker = require("faker");
const User = require("../models/user");
const Story = require("../models/story");
const Category = require("../models/category");

const createStory = (userID, categoryID) => ({
  user: userID,
  category: categoryID,
  title: faker.lorem.words(4),
  content: faker.lorem.paragraphs(10),
  slug: faker.lorem.slug(4),
  thumbnail: "default.png"
});

exports.up = async () => {
  try {
    const user = await User.findOne();
    const categories = await Category.find();
    let stories = [];

    categories.forEach((category, index) => {
      const generate = () => createStory(user._id, category._id);
      let totalStories = 5;

      if (index > 1) {
        totalStories = 3;
      }

      stories = [...stories, ...[...Array(totalStories)].map(generate)];
    });

    await Story.create(stories);
    console.log("Stories successfully seeded");
  } catch (error) {
    console.error(error);
  }
};

exports.down = async () => {
  try {
    await Story.remove({});
    console.log("Stories successfully truncated");
  } catch (error) {
    console.error(error);
  }
};
