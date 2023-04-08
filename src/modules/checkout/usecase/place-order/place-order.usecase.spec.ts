import PlaceOrderUseCase from "./place-order.usecase";
import { PlaceOrderInputDto } from "./place-order.dto";

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
          products: [
            { productId: "0" },
            { productId: "1" },
            { productId: "2" },
          ],
        };

        await expect(useCase["validateProducts"](input)).rejects.toThrowError(
          "Product 1 is not available in stock"
        );
        expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(5);
      });
    });
  });
});
