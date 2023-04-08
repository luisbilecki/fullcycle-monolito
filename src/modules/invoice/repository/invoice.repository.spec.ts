import { Sequelize } from "sequelize-typescript";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import { InvoiceModel } from "./invoice.model";
import InvoiceRepository from "./invoice.repository";
import { faker } from "@faker-js/faker";
import Address from "../valueobject/address.valueobject";
import Product from "../domain/product.entity";
import { ProductModel } from "./product.model";

describe("InvoiceRepository test", () => {
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

  it("should generate a new invoice", async () => {
    const invoiceProps = {
      id: new Id("1"),
      name: faker.name.fullName(),
      document: faker.random.alphaNumeric(),
      address: new Address({
        street: faker.address.street(),
        number: faker.address.buildingNumber(),
        complement: faker.random.word(),
        city: faker.address.cityName(),
        state: faker.address.state(),
        zipCode: faker.address.zipCode(),
      }),
      items: [
        new Product({
          id: new Id("1"),
          name: faker.commerce.productName(),
          price: Number(faker.commerce.price()),
        }),
      ],
      createdAt: new Date(),
    };
    const invoice = new Invoice(invoiceProps);
    const repository = new InvoiceRepository();
    await repository.generate(invoice);

    const invoiceDb = await InvoiceModel.findOne({
      where: { id: invoiceProps.id.id },
      include: [{ model: ProductModel }],
    });

    expect(invoiceProps.id.id).toEqual(invoiceDb.id);
    expect(invoiceProps.name).toEqual(invoiceDb.name);
    expect(invoiceProps.document).toEqual(invoiceDb.document);
    expect(invoiceProps.address.street).toEqual(invoiceDb.street);
    expect(invoiceProps.address.number).toEqual(invoiceDb.number);
    expect(invoiceProps.address.complement).toEqual(invoiceDb.complement);
    expect(invoiceProps.address.city).toEqual(invoiceDb.city);
    expect(invoiceProps.address.state).toEqual(invoiceDb.state);
    expect(invoiceProps.address.zipCode).toEqual(invoiceDb.zipCode);
    expect(invoiceProps.items[0].id.id).toEqual(invoiceDb.items[0].id);
    expect(invoiceProps.items[0].name).toEqual(invoiceDb.items[0].name);
    expect(invoiceProps.items[0].price).toEqual(invoiceDb.items[0].price);
  });

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();
    const invoiceProps = {
      id: "1",
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
          id: "1",
          name: faker.commerce.productName(),
          price: Number(faker.commerce.price()),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await InvoiceModel.create(invoiceProps, {
      include: [{ model: ProductModel }],
    });
    const invoice = await repository.find("1");

    expect(invoice.id.id).toEqual(invoiceProps.id);
    expect(invoice.name).toEqual(invoiceProps.name);
    expect(invoice.document).toEqual(invoiceProps.document);
    expect(invoice.address.street).toEqual(invoiceProps.street);
    expect(invoice.address.number).toEqual(invoiceProps.number);
    expect(invoice.address.complement).toEqual(invoiceProps.complement);
    expect(invoice.address.city).toEqual(invoiceProps.city);
    expect(invoice.address.state).toEqual(invoiceProps.state);
    expect(invoice.address.zipCode).toEqual(invoiceProps.zipCode);
    expect(invoice.items[0].id.id).toEqual(invoiceProps.items[0].id);
    expect(invoice.items[0].name).toEqual(invoiceProps.items[0].name);
    expect(invoice.items[0].price).toEqual(invoiceProps.items[0].price);
    expect(invoice.total).toEqual(invoiceProps.items[0].price);
  });

  it("should not find an invoice", async () => {});
});
