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
