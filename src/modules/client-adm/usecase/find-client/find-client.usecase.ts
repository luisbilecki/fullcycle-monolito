import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientGateway from "../../gateway/client.gateway";
import {
  FindClientInputDto,
  FindClientOutputDto,
} from "./find-client.usecase.dto";
import FindClientUseCaseMapper from "./find-client.usecase.mapper";

export default class FindClientUseCase implements UseCaseInterface {
  private repository: ClientGateway;

  constructor(repository: ClientGateway) {
    this.repository = repository;
  }

  async execute(input: FindClientInputDto): Promise<FindClientOutputDto> {
    const client = await this.repository.find(input.id);
    return FindClientUseCaseMapper.toOutput(client);
  }
}
