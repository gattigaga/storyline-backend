"use strict";

const multer = require("multer");

const { createStorage } = require("../helpers/storage");

const storageUser = createStorage("images/users");
const uploaderUser = multer({ storage: storageUser });

const storageStory = createStorage("images/stories");
const uploaderStory = multer({ storage: storageStory });

module.exports = { uploaderUser, uploaderStory };
