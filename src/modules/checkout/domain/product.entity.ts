import Id from "../../@shared/domain/value-object/id.value-object";
import BaseEntity from "../../@shared/domain/entity/base.entity";
import AggregateRoot from "../../@shared/domain/entity/aggregate-root.interface";

type ProductProps = {
  id?: Id;
  name: string;
  description: string;
  salePrice: number;
};

export default class Product extends BaseEntity implements AggregateRoot {
  private readonly _name: string;
  private readonly _description: string;
  private readonly _salePrice: number;

  constructor(props: ProductProps) {
    super(props.id);
    this._name = props.name;
    this._description = props.description;
    this._salePrice = props.salePrice;
  }

  get name(): string {
    return this._name;
  }

  get description(): string {
    return this._description;
  }

  get salePrice(): number {
    return this._salePrice;
  }
}
