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

  it("should login successfully", async () => {
    await login(app).expect(200);
  });
});
