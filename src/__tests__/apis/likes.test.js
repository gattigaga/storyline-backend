const request = require("supertest");
const mongoose = require("mongoose");

const Like = require("../../models/like");
const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

describe("GET /likes", () => {
  const userID = mongoose.Types.ObjectId();
  const storyID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Like.create(
      {
        user: userID,
        story: mongoose.Types.ObjectId()
      },
      {
        user: userID,
        story: storyID
      },
      {
        user: userID,
        story: storyID
      }
    );
  });

  afterAll(async () => {
    await User.remove({});
    await Like.remove({});
  });

  it("should get all likes", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/likes`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get likes by story", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/likes?storyID=${storyID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });
});

describe("POST /likes", () => {
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
    await Like.remove({});
  });

  it("should create new like", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const payload = {
      user: `${mongoose.Types.ObjectId()}`,
      story: `${mongoose.Types.ObjectId()}`
    };

    await request(app)
      .post("/likes")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(201)
      .expect(res => {
        expect(res.body).toMatchObject(payload);
      });
  });
});

describe("DELETE /likes/:id", () => {
  const userID = mongoose.Types.ObjectId();
  const storyID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Like.create(
      {
        user: userID,
        story: mongoose.Types.ObjectId()
      },
      {
        user: userID,
        story: storyID
      },
      {
        user: userID,
        story: storyID
      }
    );
  });

  afterAll(async () => {
    await User.remove({});
    await Like.remove({});
  });

  it("should delete a like", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const like = await Like.findOne({});

    await request(app)
      .delete(`/likes/${like._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(async () => {
        const totalLikes = await Like.count();
        expect(totalLikes).toEqual(2);
      });
  });

  it("should failed to delete a like", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .delete("/likes/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
