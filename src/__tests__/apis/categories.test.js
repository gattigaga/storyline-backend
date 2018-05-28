const request = require("supertest");

const Category = require("../../models/category");
const app = require("../../../app");

describe("GET /categories", () => {
  beforeAll(async () => {
    await Category.create(
      { name: "Technology" },
      { name: "Science" },
      { name: "Math" }
    );
  });

  afterAll(async () => {
    await Category.remove({});
  });

  it("should get all categories", async () => {
    await request(app)
      .get(`/categories`)
      .expect(200)
      .expect(res => {
        expect(res.body.length).toEqual(3);
      });
  });
});

describe("GET /categories/:id", () => {
  beforeAll(async () => {
    await Category.create(
      { name: "Technology" },
      { name: "Science" },
      { name: "Math" }
    );
  });

  afterAll(async () => {
    await Category.remove({});
  });

  it("should get a category successfully", async () => {
    const category = await Category.findOne({});

    await request(app)
      .get(`/categories/${category._id}`)
      .expect(200)
      .expect(res => {
        expect(`${res.body._id}`).toEqual(`${category._id}`);
      });
  });

  it("should failed to get a category", async () => {
    await request(app)
      .get("/categories/wR0n6")
      .expect(404);
  });
});
