const request = require("supertest");
const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

describe("POST /login", () => {
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

  it("should login with username", async () => {
    await request(app)
      .post("/login")
      .send({
        username: "member",
        password: "member"
      })
      .expect(200);
  });

  it("should login with email", async () => {
    await request(app)
      .post("/login")
      .send({
        email: "member@storyline.com",
        password: "member"
      })
      .expect(200);
  });

  it("should failed to login caused by password did not match", async () => {
    await request(app)
      .post("/login")
      .send({
        username: "member",
        password: "wrong"
      })
      .expect(401);
  });

  it("should failed to login caused by user doesn't exist", async () => {
    await request(app)
      .post("/login")
      .send({
        username: "noexist",
        password: "noexist"
      })
      .expect(404);
  });

  it("should failed to login caused by empty form", async () => {
    await request(app)
      .post("/login")
      .expect(404);
  });
});

describe("POST /register", () => {
  afterAll(() => {
    return User.remove({});
  });

  it("should register new user", async () => {
    const expected = {
      name: "Member",
      username: "member",
      email: "member@storyline.com"
    };

    const payload = {
      ...expected,
      password: "member"
    };

    await request(app)
      .post("/register")
      .send(payload)
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject(expected);
      });
  });
});

describe("GET /me", () => {
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

  it("should get authenticated user successfully", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });

  it("should get authenticated user failed", async () => {
    await request(app)
      .get("/me")
      .set("Authorization", `Bearer wR0n6`)
      .expect(401);
  });
});
