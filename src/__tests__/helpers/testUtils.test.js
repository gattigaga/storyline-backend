const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

describe("login()", () => {
  beforeAll(() => {
    return User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });
  });

  afterAll(() => {
    return User.remove({});
  });

  it("should login with given username", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    await login(app, credential).expect(200);
  });

  it("should login with given email", async () => {
    const credential = {
      email: "member@storyline.com",
      password: "member"
    };

    await login(app, credential).expect(200);
  });
});
