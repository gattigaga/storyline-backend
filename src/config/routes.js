const passport = require("passport");

const { uploaderUser, uploaderStory } = require("./storage");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const likeController = require("../controllers/likeController");
const followController = require("../controllers/followController");
const choiceController = require("../controllers/choiceController");
const categoryController = require("../controllers/categoryController");
const storyController = require("../controllers/storyController");

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

  app.route("/users").get(userController.index);

  app
    .route("/users/:id")
    .get(userController.read)
    .put(
      passport.authenticate("jwt", { session: false }),
      uploaderUser.single("photo"),
      userController.update
    );

  app
    .route("/likes")
    .get(likeController.index)
    .post(
      passport.authenticate("jwt", { session: false }),
      likeController.create
    );

  app
    .route("/likes/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .delete(likeController.delete);

  app
    .route("/follows")
    .get(followController.index)
    .post(
      passport.authenticate("jwt", { session: false }),
      followController.create
    );

  app
    .route("/follows/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .delete(followController.delete);

  app.route("/categories").get(categoryController.index);
  app.route("/categories/:id").get(categoryController.read);

  app
    .route("/choices")
    .all(passport.authenticate("jwt", { session: false }))
    .get(choiceController.index)
    .post(choiceController.create);

  app
    .route("/choices/:id")
    .all(passport.authenticate("jwt", { session: false }))
    .delete(choiceController.delete);

  app
    .route("/stories")
    .get(storyController.index)
    .post(
      passport.authenticate("jwt", { session: false }),
      uploaderStory.single("thumbnail"),
      storyController.create
    );

  app
    .route("/stories/:id")
    .get(storyController.read)
    .put(
      passport.authenticate("jwt", { session: false }),
      uploaderStory.single("thumbnail"),
      storyController.update
    )
    .delete(
      passport.authenticate("jwt", { session: false }),
      storyController.delete
    );
};

module.exports = routes;
