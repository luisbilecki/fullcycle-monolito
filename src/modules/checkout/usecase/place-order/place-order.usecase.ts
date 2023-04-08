import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";

export default class PlaceOrderUseCase implements UseCaseInterface {
  private clientFacade: ClientAdmFacadeInterface;

  constructor(clientFacade: ClientAdmFacadeInterface) {
    this.clientFacade = clientFacade;
  }

  async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
    const client = await this.clientFacade.find({ id: input.clientId });
    if (!client) {
      throw new Error("Client not found");
    }
    await this.validateProducts(input);
    return Promise.resolve(undefined);
  }

  private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
    if (input.products.length === 0) {
      throw new Error("No products selected");
    }
  }
}
