import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import Product from "../../domain/product.entity";
import Address from "../../valueobject/address.valueobject";
import FindInvoiceUseCase from "./find-invoice.usecase";
import { faker } from "@faker-js/faker";

const invoice = new Invoice({
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
});
const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
  };
};

describe("Find Invoice Usecase unit test", () => {
  it("should find an invoice", async () => {
    const repository = MockRepository();
    const usecase = new FindInvoiceUseCase(repository);

    const input = {
      id: "1",
    };

    const result = await usecase.execute(input);

    expect(repository.find).toHaveBeenCalled();
    expect(result.id).toEqual(input.id);
    expect(result.name).toEqual(invoice.name);
    expect(result.document).toEqual(invoice.document);
    expect(result.address.street).toEqual(invoice.address.street);
    expect(result.address.number).toEqual(invoice.address.number);
    expect(result.address.complement).toEqual(invoice.address.complement);
    expect(result.address.city).toEqual(invoice.address.city);
    expect(result.address.state).toEqual(invoice.address.state);
    expect(result.address.zipCode).toEqual(invoice.address.zipCode);
    expect(result.items[0].id).toEqual(invoice.items[0].id.id);
    expect(result.items[0].name).toEqual(invoice.items[0].name);
    expect(result.items[0].price).toEqual(invoice.items[0].price);
    expect(result.total).toEqual(invoice.items[0].price);
  });
});
