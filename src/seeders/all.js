const users = require("./users");
const categories = require("./categories");

/**
 * Run seeders in sequence
 *
 * @param {string} command
 */
const runAll = async command => {
  const seeders = [users, categories];

  for (const seeder of seeders) {
    await seeder[command]();
  }
};

module.exports = runAll;
