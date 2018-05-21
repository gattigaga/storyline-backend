"use strict";

const multer = require("multer");
const mime = require("mime");
const uuid = require("uuid/v4");

const { publicPath } = require("../config/app");

/**
 * Create disk storage based on destination
 *
 * @param {string} destination - Path of file will be stored
 * @returns
 */
const createStorage = destination => {
  const fullpath = `${publicPath}/${destination}`;
  const filename = uuid();

  const storage = multer.diskStorage({
    destination: fullpath,
    filename: (req, file, callback) => {
      const extension = mime.extension(file.mimetype);

      callback(null, `${filename}.${extension}`);
    }
  });

  return storage;
};

module.exports = { createStorage };
