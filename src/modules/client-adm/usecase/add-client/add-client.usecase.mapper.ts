import {
  AddClientInputDto,
  AddClientOutputDto,
} from "./add-client.usecase.dto";
import Client, { ClientProps } from "../../domain/client.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";

export default class AddClientUseCaseMapper {
  static toOutput(client: Client): AddClientOutputDto {
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

  static toClientProps(input: AddClientInputDto): ClientProps {
    return {
      id: new Id(input.id) || new Id(),
      name: input.name,
      email: input.email,
      document: input.document,
      street: input.street,
      number: input.number,
      complement: input.complement,
      city: input.city,
      state: input.state,
      zipCode: input.zipCode,
    };
  }
}
