import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.dto";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

describe("PlaceOrderUseCase unit test", () => {
  describe("execute method", () => {
    it("should throw an error when client is not found", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - no params in constructor
      const useCase = new PlaceOrderUseCase();

      //@ts-expect-error - force set clientFacade
      useCase["clientFacade"] = mockClientFacade;

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(useCase.execute(input)).rejects.toThrowError(
        "Client not found"
      );
    });

    it("should throw an error when products are not valid", async () => {
      const mockClientFacade = {
        find: jest.fn().mockResolvedValue(true),
      };

      //@ts-expect-error - no params in constructor
      const useCase = new PlaceOrderUseCase();

      //@ts-expect-error - force set clientFacade
      useCase["clientFacade"] = mockClientFacade;

      const mockValidateProducts = jest
        //@ts-expect-error - spy on private method
        .spyOn(useCase, "validateProducts")
        //@ts-expect-error - not return never
        .mockRejectedValue(new Error("No products selected"));

      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(useCase.execute(input)).rejects.toThrowError(
        "No products selected"
      );
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
    });
  });

  describe("getProducts methods", () => {
    const mockDate = new Date(2000, 1, 1);

    beforeAll(() => {
      jest.useFakeTimers("modern");
      jest.setSystemTime(mockDate);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    //@ts-expect-error - no params in constructor
    const useCase = new PlaceOrderUseCase();

    it("should throw an error when product is not found", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue(null),
      };

      //@ts-expect-error - force set catalogFacade
      useCase["catalogFacade"] = mockCatalogFacade;

      await expect(useCase["getProduct"]("1")).rejects.toThrowError(
        "Product 1 not found"
      );
    });

    it("should return a product", async () => {
      const mockCatalogFacade = {
        find: jest.fn().mockResolvedValue({
          id: "0",
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        }),
      };

      //@ts-expect-error - force set catalogFacade
      useCase["catalogFacade"] = mockCatalogFacade;

      await expect(useCase["getProduct"]("0")).resolves.toEqual(
        new Product({
          id: new Id("0"),
          name: "Product 0",
          description: "Product 0 description",
          salesPrice: 0,
        })
      );
      expect(mockCatalogFacade.find).toHaveBeenCalledTimes(1);
    });
  });

  describe("ValidateProducts methods", () => {
    //@ts-expect-error - no params in constructor
    const useCase = new PlaceOrderUseCase();

    it("should throw error if no products are selected", async () => {
      const input: PlaceOrderInputDto = {
        clientId: "1",
        products: [],
      };

      await expect(useCase["validateProducts"](input)).rejects.toThrowError(
        "No products selected"
      );
    });

    it("should throw an error when product is out of stock", async () => {
      const mockProductFacade = {
        checkStock: jest.fn(({ productId }: { productId: string }) => {
          return Promise.resolve({
            productId,
            stock: productId === "1" ? 0 : 1,
          });
        }),
      };

      //@ts-expect-error - force set productFacade
      useCase["productFacade"] = mockProductFacade;

      let input: PlaceOrderInputDto = {
        clientId: "1",
        products: [{ productId: "1" }],
      };

      await expect(useCase["validateProducts"](input)).rejects.toThrowError(
        "Product 1 is not available in stock"
      );

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }],
      };

      await expect(useCase["validateProducts"](input)).rejects.toThrowError(
        "Product 1 is not available in stock"
      );
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(3);

      input = {
        clientId: "0",
        products: [{ productId: "0" }, { productId: "1" }, { productId: "2" }],
      };

      await expect(useCase["validateProducts"](input)).rejects.toThrowError(
        "Product 1 is not available in stock"
      );
      expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
    });
  });

  describe("place an order", () => {
    const clientProps = {
      id: "1c",
      name: "Client 0",
      document: "0000",
      email: "client@user.com",
      street: "some address",
      number: "1",
      complement: "",
      city: "some city",
      state: "some state",
      zipCode: "000",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const mockClientFacade = {
      add: jest.fn(),
      find: jest.fn().mockResolvedValue(clientProps),
    };

    const mockPaymentFacade = {
      process: jest.fn(),
    };

    const mockCheckoutRepository = {
      addOrder: jest.fn(),
      findOrder: jest.fn(),
    };

    const mockInvoiceFacade = {
      generate: jest.fn().mockResolvedValue({ id: "1c" }),
      find: jest.fn(),
    };

    const placeOrderUseCase = new PlaceOrderUseCase(
      mockClientFacade as any,
      null,
      null,
      mockCheckoutRepository as any,
      mockInvoiceFacade as any,
      mockPaymentFacade
    );

    const products = {
      "1": new Product({
        id: new Id("1"),
        name: "Product 1",
        description: "Product 1 description",
        salesPrice: 40,
      }),
      "2": new Product({
        id: new Id("2"),
        name: "Product 2",
        description: "Product 2 description",
        salesPrice: 30,
      }),
    };

    const mockValidateProducts = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUseCase, "validateProducts")
      //@ts-expect-error - not return never
      .mockResolvedValue(null);

    const mockGetProduct = jest
      //@ts-expect-error - spy on private method
      .spyOn(placeOrderUseCase, "getProduct")
      //@ts-expect-error - not return never
      .mockImplementation((productId: keyof typeof products) => {
        return products[productId];
      });

    it("should not be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "error",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBeNull();
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockValidateProducts).toHaveBeenCalledWith(input);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
    });

    it("should be approved", async () => {
      mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
        transactionId: "1t",
        orderId: "1o",
        amount: 100,
        status: "approved",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const input: PlaceOrderInputDto = {
        clientId: "1c",
        products: [{ productId: "1" }, { productId: "2" }],
      };

      let output = await placeOrderUseCase.execute(input);

      expect(output.invoiceId).toBe("1c");
      expect(output.total).toBe(70);
      expect(output.products).toStrictEqual([
        { productId: "1" },
        { productId: "2" },
      ]);
      expect(mockClientFacade.find).toHaveBeenCalledTimes(1);
      expect(mockClientFacade.find).toHaveBeenCalledWith({ id: "1c" });
      expect(mockValidateProducts).toHaveBeenCalledTimes(1);
      expect(mockGetProduct).toHaveBeenCalledTimes(2);
      expect(mockCheckoutRepository.addOrder).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
      expect(mockPaymentFacade.process).toHaveBeenCalledWith({
        orderId: output.id,
        amount: output.total,
      });
      expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
      expect(mockInvoiceFacade.generate).toHaveBeenCalledWith({
        name: clientProps.name,
        document: clientProps.document,
        street: clientProps.street,
        number: clientProps.number,
        complement: clientProps.complement,
        city: clientProps.city,
        state: clientProps.state,
        zipCode: clientProps.zipCode,
        items: [
          {
            id: products["1"].id.id,
            name: products["1"].name,
            price: products["1"].salesPrice,
          },
          {
            id: products["2"].id.id,
            name: products["2"].name,
            price: products["2"].salesPrice,
          },
        ],
      });
    });
  });
});
