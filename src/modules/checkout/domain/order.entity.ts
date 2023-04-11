import Client from "./client.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "./product.entity";
import BaseEntity from "../../@shared/domain/entity/base.entity";

type OrderProps = {
  id?: Id;
  invoiceId?: string;
  client: Client;
  products: Product[];
  status?: string;
};

export default class Order extends BaseEntity {
  private readonly _invoiceId: string;
  private readonly _client: Client;
  private readonly _products: Product[];
  private _status: string;

  constructor(props: OrderProps) {
    super(props.id);
    this._invoiceId = props.invoiceId || null;
    this._client = props.client;
    this._products = props.products;
    this._status = props.status || "pending";
  }

  get invoiceId() {
    return this._invoiceId;
  }

  get client(): Client {
    return this._client;
  }

  get products(): Product[] {
    return this._products;
  }

  get status(): string {
    return this._status;
  }

  approve(): void {
    this._status = "approved";
  }

  get total(): number {
    return this._products.reduce((total, product) => total + product.price, 0);
  }
}
