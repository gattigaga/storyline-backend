const passport = require("passport");
const multer = require("multer");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const uploadUserPhoto = multer({ dest: "public/images/users" });

/**
 * Route list
 *
 * @param {object} app - Express instance
 */
const routes = app => {
  app
    .post("/login", authController.login)
    .get(
      "/me",
      passport.authenticate("jwt", { session: false }),
      authController.me
    );

  app
    .route("/users/:id")
    .get(userController.read)
    .put(
      passport.authenticate("jwt", { session: false }),
      uploadUserPhoto.single("photo"),
      userController.update
    );
};

module.exports = routes;
