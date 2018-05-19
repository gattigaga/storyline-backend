const program = require("commander");
const fs = require("fs");
const runAllSeeder = require("./src/seeders/all");

program
  .option("-s, --seed [filename]", "Seed your database or collection")
  .option("-t, --truncate [filename]", "Truncate your database or collection")
  .parse(process.argv);

/**
 * Remove seeders file extension
 *
 * @param {string} filename - Seeder file
 */
const removeExtension = filename => filename.replace(".js", "");

/**
 * Run single seeder
 *
 * @param {string} filename - Seeder file
 * @param {string} type - Type of command (up or down)
 */
const runSingleSeeder = (filename, type) => {
  const seederFile = removeExtension(filename);
  const seederPath = `./src/seeders/${seederFile}.js`;

  if (fs.existsSync(seederPath)) {
    const seeder = require(seederPath);
    seeder[type]();
  } else {
    console.log(`${filename} is not exist`);
  }
};

/**
 *
 * Command : Seed
 *
 */

if (program.seed === true) {
  runAllSeeder("up");
}

if (typeof program.seed === "string") {
  runSingleSeeder(program.seed, "up");
}

/**
 *
 * Command : Truncate
 *
 */

if (program.truncate === true) {
  runAllSeeder("down");
}

if (typeof program.truncate === "string") {
  runSingleSeeder(program.truncate, "down");
}
