import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import Product from "../../domain/product.entity";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import CheckoutGateway from "../../gateway/checkout.gateway";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private clientFacade: ClientAdmFacadeInterface;
  private productFacade: ProductAdmFacadeInterface;
  private catalogFacade: StoreCatalogFacadeInterface;
  private checkoutRepository: CheckoutGateway;
  private invoiceFacade: InvoiceFacadeInterface;
  private paymentFacade: PaymentFacadeInterface;

  constructor(
    clientFacade: ClientAdmFacadeInterface,
    productFacade: ProductAdmFacadeInterface,
    catalogFacade: StoreCatalogFacadeInterface,
    checkoutRepository: CheckoutGateway,
    invoiceFacade: InvoiceFacadeInterface,
    paymentFacade: PaymentFacadeInterface
  ) {
    this.clientFacade = clientFacade;
    this.productFacade = productFacade;
    this.catalogFacade = catalogFacade;
    this.checkoutRepository = checkoutRepository;
    this.invoiceFacade = invoiceFacade;
    this.paymentFacade = paymentFacade;
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
    const myClient = new Client({
      id: new Id(client.id),
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
    });
    const order = new Order({
      client: myClient,
      products: products,
    });
    const payment = await this.paymentFacade.process({
      orderId: order.id.id,
      amount: order.total,
    });
    const invoice =
      payment.status === "approved"
        ? await this.invoiceFacade.generate({
            name: client.name,
            document: client.document,
            complement: client.complement,
            street: client.street,
            number: client.number,
            city: client.city,
            state: client.state,
            zipCode: client.zipCode,
            items: products.map((p) => {
              return {
                id: p.id.id,
                name: p.name,
                price: p.price,
              };
            }),
          })
        : null;

    payment.status === "approved" && order.approve();
    await this.checkoutRepository.addOrder(order);
    return {
      id: order.id.id,
      invoiceId: payment.status === "approved" ? invoice.id : null,
      status: order.status,
      total: order.total,
      products: order.products.map((p) => {
        return {
          productId: p.id.id,
        };
      }),
    };
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }

    for (const p of input.products) {
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
      price: product.price,
    };
    return new Product(productProps);
  }
}
