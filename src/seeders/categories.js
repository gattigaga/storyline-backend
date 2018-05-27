const Category = require("../models/category");

exports.up = async () => {
  const categories = [
    { name: "Technology" },
    { name: "Science" },
    { name: "Math" },
    { name: "Psychology" },
    { name: "Politic" }
  ];

  try {
    await Category.create(categories);
    console.log("Categories successfully seeded");
  } catch (error) {
    console.error(error);
  }
};

exports.down = async () => {
  try {
    await Category.remove({});
    console.log("Categories successfully truncated");
  } catch (error) {
    console.error(error);
  }
};
