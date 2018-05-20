const request = require("supertest");
const mongoose = require("mongoose");

const Follow = require("../../models/follow");
const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

describe("GET /follows", () => {
  const followerID = mongoose.Types.ObjectId();
  const followedID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Follow.create(
      {
        follower: followerID,
        followed: mongoose.Types.ObjectId()
      },
      {
        follower: followerID,
        followed: followedID
      },
      {
        follower: mongoose.Types.ObjectId(),
        followed: followedID
      }
    );
  });

  afterAll(async () => {
    await User.remove({});
    await Follow.remove({});
  });

  it("should get all follows", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/follows`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get follows by follower", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/follows?followerID=${followerID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get follows by followed", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/follows?followedID=${followedID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });
});

describe("POST /follows", () => {
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
    await Follow.remove({});
  });

  it("should create new follow", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const payload = {
      follower: `${mongoose.Types.ObjectId()}`,
      followed: `${mongoose.Types.ObjectId()}`
    };

    await request(app)
      .post("/follows")
      .set("Authorization", `Bearer ${token}`)
      .send(payload)
      .expect(201)
      .expect(res => {
        expect(res.body).toMatchObject(payload);
      });
  });
});

describe("DELETE /follows/:id", () => {
  const followerID = mongoose.Types.ObjectId();
  const followedID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    const follow = {
      follower: followerID,
      followed: followedID
    };

    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Follow.create(follow, follow, follow);
  });

  afterAll(async () => {
    await User.remove({});
    await Follow.remove({});
  });

  it("should delete a follow", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const follow = await Follow.findOne({});

    await request(app)
      .delete(`/follows/${follow._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(async () => {
        const totalFollows = await Follow.count();
        expect(totalFollows).toEqual(2);
      });
  });

  it("should failed to delete a follow", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .delete("/follows/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
