import { FindClientOutputDto } from "./find-client.usecase.dto";
import Client from "../../domain/client.entity";

export default class FindClientUseCaseMapper {
  static toOutput(client: Client): FindClientOutputDto {
    return {
      id: client.id.id,
      name: client.name,
      email: client.email,
      document: client.document,
      street: client.street,
      number: client.number,
      complement: client.complement,
      city: client.city,
      state: client.state,
      zipCode: client.zipCode,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    };
  }
}
