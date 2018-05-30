const request = require("supertest");
const path = require("path");
const fs = require("fs-extra");

const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

const photoPath = path.resolve("public/images/users");
const dummyFile = path.resolve("src/__tests__/fixtures/dummy.png");

const createUser = (_, index = "") => {
  const username = `member${index}`;

  return {
    name: `Member${index}`,
    username,
    email: `${username}@storyline.com`,
    password: username,
    photo: "photo.png"
  };
};

describe("GET /stories", () => {
  beforeAll(async () => {
    const users = [...Array(4)].map(createUser);

    await User.create(
      {
        name: "Member",
        username: "member",
        email: "member@storyline.com",
        password: "member"
      },
      ...users
    );
  });

  afterAll(async () => {
    await User.remove({});
  });

  it("should get all users", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/users`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(5);
      });
  });

  it("should get users by username", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/users?username=member0`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(1);
      });
  });
});

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
  beforeAll(async () => {
    await fs.copy(dummyFile, `${photoPath}/photo.png`);
    await User.create(createUser());
  });

  afterAll(async () => {
    await fs.remove(photoPath);
    await User.remove({});
  });

  it("should update an user successfully", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const user = await User.findOne({});

    await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Member"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          name: "Updated Member"
        });
      });
  });

  it("should update an user with photo successfully", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const user = await User.findOne({});

    await request(app)
      .put(`/users/${user._id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("photo", dummyFile)
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
