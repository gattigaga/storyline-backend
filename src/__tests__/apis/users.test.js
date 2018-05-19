const request = require("supertest");
const path = require("path");
const fs = require("fs");

const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

const photoPath = path.resolve("public/images/users");

const createUser = (_, index) => {
  const username = `member${index}`;

  return {
    name: `Member${index}`,
    username,
    email: `${username}@storyline.com`,
    password: username
  };
};

describe("GET /users/:id", () => {
  beforeAll(() => {
    const users = [...Array(3)].map(createUser);

    return User.create(users);
  });

  afterAll(() => {
    return User.remove({});
  });

  it("should get an user successfully", async () => {
    const user = await User.findOne({ username: "member0" });

    await request(app)
      .get(`/users/${user._id}`)
      .expect(200)
      .expect(res => {
        expect(`${res.body._id}`).toEqual(`${user._id}`);
      });
  });

  it("should failed to get an user", async () => {
    await request(app)
      .get("/users/wR0n6")
      .expect(404);
  });
});

describe("PUT /users/:id", () => {
  beforeAll(() => {
    const users = [...Array(3)].map(createUser);

    return User.create(users);
  });

  afterAll(() => {
    return User.remove({});
  });

  it("should update an user successfully", async () => {
    const credential = {
      username: "member0",
      password: "member0"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const user = await User.findOne({ username: credential.username });

    await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Member"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          name: "Updated Member",
          username: credential.username
        });
      });
  });

  it("should update an user with photo successfully", async () => {
    const credential = {
      username: "member0",
      password: "member0"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const user = await User.findOne({ username: credential.username });

    await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("photo", "src/__tests__/fixtures/dummy.png")
      .expect(200)
      .expect(res => {
        const oldPhoto = `${photoPath}/${user.photo}`;
        const newPhoto = `${photoPath}/${res.body.photo}`;

        expect(fs.existsSync(oldPhoto)).toEqual(false);
        expect(fs.existsSync(newPhoto)).toEqual(true);
      });
  });

  it("should failed to update an user", async () => {
    const response = await login(app);
    const { token } = response.body;

    await request(app)
      .get("/users/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Member"
      })
      .expect(404);
  });
});
