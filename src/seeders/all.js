const users = require("./users");

/**
 * Run seeders in sequence
 *
 * @param {string} command
 */
const runAll = async command => {
  const seeders = [users];

  for (const seeder of seeders) {
    await seeder[command]();
  }
};

module.exports = runAll;
