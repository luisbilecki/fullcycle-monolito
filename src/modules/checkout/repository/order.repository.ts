import Id from "../../@shared/domain/value-object/id.value-object";
import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import OrderModel from "./order.model";
import ClientModel from "./client.model";
import ProductModel from "./product.model";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";

export default class OrderRepository implements CheckoutGateway {
  async addOrder(order: Order): Promise<void> {
    await ClientModel.destroy({
      where: { id: order.client.id.id },
    });

    await ProductModel.destroy({
      where: { id: order.products.map((product) => product.id.id) },
    });

    await OrderModel.create(
      {
        id: order.id.id,
        status: order.status,
        client: {
          id: order.client.id.id,
          name: order.client.name,
          document: order.client.document,
          email: order.client.email,
          street: order.client.street,
          number: order.client.number,
          complement: order.client.complement,
          city: order.client.city,
          state: order.client.state,
          zipCode: order.client.zipCode,
        },
        products: order.products.map((product) => ({
          id: product.id.id,
          name: product.name,
          price: product.price,
          description: product.description,
        })),
        invoiceId: order.invoiceId,
      },
      {
        include: [{ model: ProductModel }, { model: ClientModel }],
      }
    );
  }

  async findOrder(id: string): Promise<Order> {
    const order = await OrderModel.findOne({
      where: { id },
      include: [{ model: ProductModel }, { model: ClientModel }],
    });
    return new Order({
      id: new Id(order.id),
      status: order.status,
      client: new Client({
        id: new Id(order.client.id),
        name: order.client.name,
        document: order.client.document,
        email: order.client.email,
        street: order.client.street,
        number: order.client.number,
        complement: order.client.complement,
        city: order.client.city,
        state: order.client.state,
        zipCode: order.client.zipCode,
      }),
      products: order.products.map(
        (product) =>
          new Product({
            id: new Id(product.id),
            name: product.name,
            price: product.price,
            description: product.description,
          })
      ),
      invoiceId: order.invoiceId,
    });
  }
}
