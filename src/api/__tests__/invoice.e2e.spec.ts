import { app, sequelize } from "../express";
import request from "supertest";
import Id from "../../modules/@shared/domain/value-object/id.value-object";
import Product from "../../modules/invoice/domain/product.entity";
import Invoice from "../../modules/invoice/domain/invoice.entity";
import Address from "../../modules/invoice/valueobject/address.valueobject";
import InvoiceRepository from "../../modules/invoice/repository/invoice.repository";
import { faker } from "@faker-js/faker";

describe("Invoice E2E Test", () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  it("should do the invoice", async () => {
    const address = new Address({
      street: faker.address.street(),
      number: faker.address.buildingNumber(),
      complement: "apt 21",
      city: faker.address.cityName(),
      state: faker.address.stateAbbr(),
      zipCode: faker.address.zipCode(),
    });

    const product = new Product({
      id: new Id("1"),
      name: faker.commerce.productName(),
      price: Number(faker.commerce.price()),
    });

    const invoice = new Invoice({
      id: new Id("123"),
      name: "Invoice 1",
      document: faker.random.alpha(),
      items: [product],
      address,
    });

    const invoiceRepository = new InvoiceRepository();

    await invoiceRepository.generate(invoice);
    const response = await request(app).get(`/invoice/${123}`);

    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual("Invoice 1");
    expect(response.body.document).toEqual(invoice.document);
    expect(response.body.address.street).toEqual(address.street);
    expect(response.body.address.number).toEqual(address.number);
    expect(response.body.address.complement).toEqual(address.complement);
    expect(response.body.address.city).toEqual(address.city);
    expect(response.body.address.state).toEqual(address.state);
    expect(response.body.address.zipCode).toEqual(address.zipCode);
    expect(response.body.items[0].id).toEqual("1");
  });
});
