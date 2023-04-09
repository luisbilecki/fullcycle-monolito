import Id from "../../../@shared/domain/value-object/id.value-object";
import Client from "../../domain/client.entity";
import ClientGateway from "../../gateway/client.gateway";
import {
  AddClientInputDto,
  AddClientOutputDto,
} from "./add-client.usecase.dto";
import AddClientUseCaseMapper from "./add-client.usecase.mapper";

export default class AddClientUseCase {
  private repository: ClientGateway;

  constructor(clientRepository: ClientGateway) {
    this.repository = clientRepository;
  }

  async execute(input: AddClientInputDto): Promise<AddClientOutputDto> {
    const props = AddClientUseCaseMapper.toClientProps(input);
    const client = new Client(props);
    await this.repository.add(client);
    return AddClientUseCaseMapper.toOutput(client);
  }
}
