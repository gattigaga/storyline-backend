const faker = require("faker");
const User = require("../models/user");

const createUser = index => {
  const username = `user${index}`;

  return {
    name: faker.name.findName(),
    username,
    email: `${username}@storyline.com`,
    password: username,
    description: faker.name.jobTitle()
  };
};

exports.up = async () => {
  const users = [...Array(5)].map((_, index) => createUser(index));

  try {
    await User.create(users);
    console.log("Users successfully seeded");
  } catch (error) {
    console.error(error);
  }
};

exports.down = async () => {
  try {
    await User.remove({});
    console.log("Users successfully truncated");
  } catch (error) {
    console.error(error);
  }
};
