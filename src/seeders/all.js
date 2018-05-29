const users = require("./users");
const categories = require("./categories");
const stories = require("./stories");
const likes = require("./likes");

/**
 * Run seeders in sequence
 *
 * @param {string} command
 */
const runAll = async command => {
  const seeders = [users, categories, stories, likes];

  for (const seeder of seeders) {
    await seeder[command]();
  }
};

module.exports = runAll;
