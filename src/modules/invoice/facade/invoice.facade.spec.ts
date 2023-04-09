import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import ProductModel from "../repository/product.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { faker } from "@faker-js/faker";

describe("Invoice Facade test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should create an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: faker.name.fullName(),
      document: faker.random.alphaNumeric(),
      street: faker.address.street(),
      number: faker.address.buildingNumber(),
      complement: faker.random.word(),
      city: faker.address.cityName(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
      items: [
        {
          id: faker.random.numeric(),
          name: faker.commerce.productName(),
          price: Number(faker.commerce.price()),
        },
      ],
    };

    const invoice = await facade.generate(input);

    expect(invoice).toBeDefined();
    expect(input.name).toEqual(invoice.name);
    expect(input.document).toEqual(invoice.document);
    expect(input.street).toEqual(invoice.street);
    expect(input.number).toEqual(invoice.number);
    expect(input.complement).toEqual(invoice.complement);
    expect(input.city).toEqual(invoice.city);
    expect(input.state).toEqual(invoice.state);
    expect(input.zipCode).toEqual(invoice.zipCode);
    expect(input.items[0].id).toEqual(invoice.items[0].id);
    expect(input.items[0].name).toEqual(invoice.items[0].name);
    expect(input.items[0].price).toEqual(invoice.items[0].price);
  });

  it("should find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const input = {
      name: faker.name.fullName(),
      document: faker.random.alphaNumeric(),
      street: faker.address.street(),
      number: faker.address.buildingNumber(),
      complement: faker.random.word(),
      city: faker.address.cityName(),
      state: faker.address.state(),
      zipCode: faker.address.zipCode(),
      items: [
        {
          id: faker.random.numeric(),
          name: faker.commerce.productName(),
          price: Number(faker.commerce.price()),
        },
      ],
    };

    const invoiceSaved = await facade.generate(input);
    const result = await facade.find({ id: invoiceSaved.id });

    expect(result.id).toBeDefined();
    expect(result.name).toEqual(result.name);
    expect(result.document).toEqual(result.document);
    expect(result.address.street).toEqual(result.address.street);
    expect(result.address.number).toEqual(result.address.number);
    expect(result.address.complement).toEqual(result.address.complement);
    expect(result.address.city).toEqual(result.address.city);
    expect(result.address.state).toEqual(result.address.state);
    expect(result.address.zipCode).toEqual(result.address.zipCode);
    expect(result.items[0].id).toEqual(result.items[0].id);
    expect(result.items[0].name).toEqual(result.items[0].name);
    expect(result.items[0].price).toEqual(result.items[0].price);
    expect(result.total).toEqual(result.total);
  });
});
