import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacade from "../../../product-adm/facade/product-adm.facade";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private clientFacade: ClientAdmFacadeInterface;
  private productFacade: ProductAdmFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface
  ) {
    this.clientFacade = clientFacade;
    this.productFacade = productFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this.clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }
    await this.validateProducts(input);
    return Promise.resolve(undefined);
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    await this.checkStock(input.products);
  }

  private async checkStock(products: Array<any>): Promise<void> {
    for (const p of products) {
      const product = await this.productFacade.checkStock({
        productId: p.productId,
      });
      if (product.stock <= 0) {
        throw new Error(`Product ${p.productId} is not available in stock`);
      }
    }
  }
}
