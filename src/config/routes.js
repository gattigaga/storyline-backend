const passport = require("passport");

const authController = require("../controllers/authController");

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
};

module.exports = routes;
