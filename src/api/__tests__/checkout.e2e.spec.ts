import { app, sequelize } from "../express";
import request from "supertest";
import ClientModel from "../../modules/client-adm/repository/client.model";
import ProductModel from "../../modules/product-adm/repository/product.model";
import { faker } from "@faker-js/faker";

describe("Checkout E2E Test", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should do a checkout", async () => {
    await ClientModel.create({
      id: "12",
      name: faker.name.fullName(),
      email: faker.internet.email(),
      document: faker.random.alphaNumeric(),
      street: faker.address.street(),
      number: faker.address.buildingNumber(),
      complement: "apt 21",
      city: faker.address.cityName(),
      state: faker.address.stateAbbr(),
      zipCode: faker.address.zipCode(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const productId = faker.random.numeric();
    await ProductModel.create({
      id: productId,
      name: faker.commerce.productName(),
      price: 200,
      description: faker.commerce.productDescription(),
      stock: 5,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const response = await request(app)
      .post("/checkout")
      .send({
        clientId: "12",
        products: [{ productId: productId }],
      });

    expect(response.status).toEqual(200);
    expect(response.body.id).toBeDefined();
    expect(response.body.invoiceId).toBeDefined();
    expect(response.body.total).toEqual(200);
    expect(response.body.status).toEqual("approved");
  });
});
