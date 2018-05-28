const request = require("supertest");
const mongoose = require("mongoose");
const path = require("path");
const fs = require("fs-extra");

const Story = require("../../models/story");
const User = require("../../models/user");
const app = require("../../../app");
const { login } = require("../../helpers/testUtils");

const photoPath = path.resolve("public/images/stories");
const dummyFile = path.resolve("src/__tests__/fixtures/dummy.png");

describe("GET /stories", () => {
  const userID = mongoose.Types.ObjectId();
  const categoryID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Story.create(
      {
        user: mongoose.Types.ObjectId(),
        category: categoryID,
        title: "Terrorism Syndicate",
        content: "I will tell my story",
        slug: "my-story-1",
        thumbnail: "thumbnail.png"
      },
      {
        user: mongoose.Types.ObjectId(),
        category: categoryID,
        title: "Bio Terrorism",
        content: "I will tell my story",
        slug: "my-story-2",
        thumbnail: "thumbnail.png"
      },
      {
        user: userID,
        category: categoryID,
        title: "My Story",
        content: "So much victim",
        slug: "my-story-3",
        thumbnail: "thumbnail.png"
      },
      {
        user: userID,
        category: mongoose.Types.ObjectId(),
        title: "My Story",
        content: "So much victim",
        slug: "my-story-4",
        thumbnail: "thumbnail.png"
      },
      {
        user: userID,
        category: mongoose.Types.ObjectId(),
        title: "My Story",
        content: "I will tell my story",
        slug: "my-story-5",
        thumbnail: "thumbnail.png"
      }
    );
  });

  afterAll(async () => {
    await User.remove({});
    await Story.remove({});
  });

  it("should get all stories", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/stories`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(5);
      });
  });

  it("should get stories by user", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/stories?userID=${userID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get stories by slug", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/stories?slug=my-story-1`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(1);
      });
  });

  it("should get stories by category", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/stories?categoryID=${categoryID}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });

  it("should get stories by title", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/stories?title=terrorism`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get stories by content", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/stories?content=victim`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });

  it("should get stories with pagination", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get(`/stories?skip=2&take=2`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(2);
      });
  });
});

describe("POST /stories", () => {
  beforeAll(async () => {
    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });
  });

  afterAll(async () => {
    await fs.remove(photoPath);
    await User.remove({});
    await Story.remove({});
  });

  it("should create new story", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;
    const userID = `${mongoose.Types.ObjectId()}`;
    const categoryID = `${mongoose.Types.ObjectId()}`;

    await request(app)
      .post("/stories")
      .set("Authorization", `Bearer ${token}`)
      .field("user", userID)
      .field("category", categoryID)
      .field("title", "My Story")
      .field("content", "I will tell my story")
      .field("slug", "my-story")
      .attach("thumbnail", dummyFile)
      .expect(200)
      .expect(res => {
        const photo = `${photoPath}/${res.body.thumbnail}`;
        expect(fs.existsSync(photo)).toEqual(true);
      });
  });
});

describe("PUT /stories/:id", () => {
  beforeAll(async () => {
    await fs.copy(dummyFile, `${photoPath}/thumbnail.png`);

    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Story.create({
      user: mongoose.Types.ObjectId(),
      category: mongoose.Types.ObjectId(),
      title: "My Story",
      content: "I will tell my story",
      slug: "my-story",
      thumbnail: "thumbnail.png"
    });
  });

  afterAll(async () => {
    await fs.remove(photoPath);
    await User.remove({});
    await Story.remove({});
  });

  it("should update a story", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const story = await Story.findOne({});

    await request(app)
      .put(`/stories/${story._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Updated Title"
      })
      .expect(200)
      .expect(res => {
        expect(res.body).toMatchObject({
          title: "Updated Title",
          _id: `${story._id}`
        });
      });
  });

  it("should update a story thumbnail", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const story = await Story.findOne({});

    await request(app)
      .put(`/stories/${story._id}`)
      .set("Authorization", `Bearer ${token}`)
      .attach("thumbnail", dummyFile)
      .expect(200)
      .expect(res => {
        const oldPhoto = `${photoPath}/${story.thumbnail}`;
        const newPhoto = `${photoPath}/${res.body.thumbnail}`;

        expect(fs.existsSync(oldPhoto)).toEqual(false);
        expect(fs.existsSync(newPhoto)).toEqual(true);
      });
  });

  it("should failed to update story", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .get("/stories/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Updated Member"
      })
      .expect(404);
  });
});

describe("DELETE /stories/:id", () => {
  const userID = mongoose.Types.ObjectId();
  const categoryID = mongoose.Types.ObjectId();

  beforeAll(async () => {
    await fs.copy(dummyFile, `${photoPath}/thumbnail.png`);

    await User.create({
      name: "Member",
      username: "member",
      email: "member@storyline.com",
      password: "member"
    });

    await Story.create({
      user: userID,
      category: categoryID,
      title: "My Story",
      content: "I will tell my story",
      slug: "my-story",
      thumbnail: "thumbnail.png"
    });
  });

  afterAll(async () => {
    await User.remove({});
    await Story.remove({});
  });

  it("should delete a story", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    const story = await Story.findOne({});

    await request(app)
      .delete(`/stories/${story._id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(200)
      .expect(async () => {
        const totalStories = await Story.count();
        const photo = `${photoPath}/${story.thumbnail}`;

        expect(totalStories).toEqual(0);
        expect(fs.existsSync(photo)).toEqual(false);
      });
  });

  it("should failed to delete story", async () => {
    const credential = {
      username: "member",
      password: "member"
    };

    const response = await login(app, credential);
    const { token } = response.body;

    await request(app)
      .delete("/stories/wR0n6")
      .set("Authorization", `Bearer ${token}`)
      .expect(404);
  });
});
