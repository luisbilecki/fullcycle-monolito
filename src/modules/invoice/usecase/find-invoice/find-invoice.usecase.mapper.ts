import Invoice from "../../domain/invoice.entity";
import { FindInvoiceUseCaseOutputDto } from "./find-invoice.usecase.dto";

export default class FindInvoiceUsecaseMapper {
  static toOutput(invoice: Invoice): FindInvoiceUseCaseOutputDto {
    return {
      id: invoice.id.id,
      name: invoice.name,
      document: invoice.document,
      address: {
        street: invoice.address.street,
        number: invoice.address.number,
        complement: invoice.address.complement,
        city: invoice.address.city,
        state: invoice.address.state,
        zipCode: invoice.address.zipCode,
      },
      items: invoice.items.map((item) => {
        return {
          id: item.id.id,
          name: item.name,
          price: item.price,
        };
      }),
      total: invoice.total,
      createdAt: invoice.createdAt,
    };
  }
}
