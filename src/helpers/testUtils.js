const request = require("supertest");

/**
 * Test login and need to return it's response
 *
 * @param {object} app - Express instance
 * @param {object} credential - User data
 * @param {string} credential.email - User email
 * @param {string} credential.username - User username
 * @param {string} credential.password - User password
 * @returns {object}
 */
const login = (app, credential) => {
  return request(app)
    .post("/login")
    .send(credential);
};

module.exports = { login };
