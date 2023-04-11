import { app, sequelize } from "../express";
import request from "supertest";
import { AddProductInputDto } from "../../modules/product-adm/usecase/add-product/add-product.dto";
import { faker } from "@faker-js/faker";
import { toInteger } from "lodash";

describe("Product E2E Test", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should create a product", async () => {
    const input: AddProductInputDto = {
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
      description: faker.commerce.productDescription(),
      stock: toInteger(faker.random.numeric()),
    };
    const response = await request(app).post("/products").send(input);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: expect.any(String),
      name: input.name,
      description: input.description,
      price: input.price,
      stock: input.stock,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
  });

  it("should not create a product", async () => {
    const response = await request(app).post("/products").send({
      name: "Only the name",
    });

    expect(response.status).toBe(500);
  });
});
