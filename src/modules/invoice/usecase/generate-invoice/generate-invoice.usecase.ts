import InvoiceGateway from "../../gateway/invoice.gateway";
import InvoiceRepository from "../../repository/invoice.repository";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "./generate-invoice.usecase.dto";
import GenerateInvoiceUsecaseMapper from "./generate-invoice.usecase.mapper";

export default class GenerateInvoiceUseCase {
  private _invoiceRepository: InvoiceGateway;

  constructor(invoiceRepository: InvoiceRepository) {
    this._invoiceRepository = invoiceRepository;
  }

  async execute(
    input: GenerateInvoiceUseCaseInputDto
  ): Promise<GenerateInvoiceUseCaseOutputDto> {
    const entity = GenerateInvoiceUsecaseMapper.toEntity(input);
    await this._invoiceRepository.generate(entity);
    return GenerateInvoiceUsecaseMapper.toOutput(entity);
  }
}
