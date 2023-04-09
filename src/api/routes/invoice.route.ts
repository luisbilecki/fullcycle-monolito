import express, { Request, Response } from "express";

import InvoiceFacadeFactory from "../../modules/invoice/factory/invoice.facade.factory";
import { FindInvoiceFacadeInputDto } from "../../modules/invoice/facade/invoice.facade.dto";

export const invoiceRoute = express.Router();

const facade = InvoiceFacadeFactory.create();

invoiceRoute.get("/:id", async (request: Request, response: Response) => {
  try {
    const input: FindInvoiceFacadeInputDto = {
      id: request.params.id,
    };

    const invoice = await facade.find(input);

    response.status(200).json(invoice);
  } catch (error) {
    console.error(error);
    response.status(500).send(error);
  }
});
