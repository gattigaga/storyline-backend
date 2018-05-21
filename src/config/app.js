"use strict";

const path = require("path");

const config = {
  database: "mongodb://localhost/storyline",
  secret: "secret",
  port: 8000,
  publicPath: path.resolve("public")
};

module.exports = config;
