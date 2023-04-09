import { Column, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({
  tableName: "products",
  timestamps: false,
})
export default class ProductModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: true })
  name: string;

  @Column({ allowNull: true })
  description: string;

  @Column({ allowNull: false })
  price: number;

  @Column({ allowNull: true })
  stock: number;

  @Column({ allowNull: true })
  createdAt?: Date;

  @Column({ allowNull: true })
  updatedAt?: Date;
}
