import GenerateInvoiceUseCase from "./generate-invoice.usecase";
import { faker } from "@faker-js/faker";

const MockRepository = () => {
  return {
    generate: jest.fn(),
    find: jest.fn(),
  };
};

describe("Generate Invoice Usecase unit test", () => {
  it("should generate a new invoice", async () => {
    const repository = MockRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const invoiceInput = {
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

    const result = await usecase.execute(invoiceInput);

    expect(repository.generate).toHaveBeenCalled();
    expect(result.id).not.toBeNull();
    expect(result.name).toEqual(invoiceInput.name);
    expect(result.document).toEqual(invoiceInput.document);
    expect(result.street).toEqual(invoiceInput.street);
    expect(result.number).toEqual(invoiceInput.number);
    expect(result.complement).toEqual(invoiceInput.complement);
    expect(result.city).toEqual(invoiceInput.city);
    expect(result.state).toEqual(invoiceInput.state);
    expect(result.zipCode).toEqual(invoiceInput.zipCode);
    expect(result.items[0].id).toEqual(invoiceInput.items[0].id);
    expect(result.items[0].name).toEqual(invoiceInput.items[0].name);
    expect(result.items[0].price).toEqual(invoiceInput.items[0].price);
    expect(result.total).toBeDefined();
  });
});
