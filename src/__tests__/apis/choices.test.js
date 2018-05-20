const request = require("supertest");
const mongoose = require("mongoose");

const Choice = require("../../models/choice");
const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

describe("GET /choices", () => {
  const userID = mongoose.Types.ObjectId();
  const categoryID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Choice.create(
      {
        user: userID,
        category: mongoose.Types.ObjectId()
      },
      {
        user: userID,
        category: categoryID
      },
      {
        user: mongoose.Types.ObjectId(),
        category: categoryID
      }
    );
  });

  afterAll(async () => {
    await User.remove({});
    await Choice.remove({});
  });

  it("should get all choices", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/choices`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get choices by user", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/choices?userID=${userID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get choices by category", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/choices?categoryID=${categoryID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });
});

describe("POST /choices", () => {
  beforeAll(async () => {
    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });
  });

  afterAll(async () => {
    await User.remove({});
    await Choice.remove({});
  });

  it("should create new choice", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const payload = {
      user: `${mongoose.Types.ObjectId()}`,
      category: `${mongoose.Types.ObjectId()}`
    };

    await request(app)
      .post("/choices")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(201)
      .expect(res => {
        expect(res.body).toMatchObject(payload);
      });
  });
});

describe("DELETE /choices/:id", () => {
  const userID = mongoose.Types.ObjectId();
  const categoryID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    const choice = {
      user: userID,
      category: categoryID
    };

    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Choice.create(choice, choice, choice);
  });

  afterAll(async () => {
    await User.remove({});
    await Choice.remove({});
  });

  it("should delete a choice", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const choice = await Choice.findOne({});

    await request(app)
      .delete(`/choices/${choice._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(async () => {
        const totalChoices = await Choice.count();
        expect(totalChoices).toEqual(2);
      });
  });

  it("should failed to delete a choice", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .delete("/choices/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
