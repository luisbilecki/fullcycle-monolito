import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.dto";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

describe("PlaceOrderUseCase unit test", () => {
  // describe("execute method", () => {});

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
});
