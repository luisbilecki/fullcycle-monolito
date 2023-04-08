import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Product from "../../domain/product.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private clientFacade: ClientAdmFacadeInterface;
  private productFacade: ProductAdmFacadeInterface;
  private catalogFacade: StoreCatalogFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface
  ) {
    this.clientFacade = clientFacade;
    this.productFacade = productFacade;
    this.catalogFacade = catalogFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this.clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }
    await this.validateProducts(input);
    const products = await Promise.all(
      input.products.map(async (p) => {
        return await this.getProduct(p.productId);
      })
    );
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

  private async getProduct(productId: string): Promise<Product> {
    const product = await this.catalogFacade.find({ id: productId });
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    const productProps = {
      id: new Id(product.id),
      name: product.name,
      description: product.description,
      salePrice: product.salesPrice,
    };
    return new Product(productProps);
  }
}
