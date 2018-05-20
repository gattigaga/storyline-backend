const passport = require("passport");
const multer = require("multer");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const likeController = require("../controllers/likeController");

const uploadUserPhoto = multer({ dest: "public/images/users" });

/**
 * Route list
 *
 * @param {object} app - Express instance
 */
const routes = app => {
  app
    .post("/login", authController.login)
    .post("/register", authController.register)
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

  app
    .route("/likes")
    .all(passport.authenticate("jwt", { session: false }))
    .get(likeController.index)
    .post(likeController.create);

  app
    .route("/likes/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .delete(likeController.delete);
};

module.exports = routes;
