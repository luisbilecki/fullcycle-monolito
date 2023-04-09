import express, { Request, Response } from "express";
import AddClientUseCase from "../../modules/client-adm/usecase/add-client/add-client.usecase";
import ClientRepository from "../../modules/client-adm/repository/client.repository";

export const clientRoute = express.Router();

const useCase = new AddClientUseCase(new ClientRepository());

clientRoute.post("/", async (req: Request, res: Response) => {
  try {
    const product = await useCase.execute(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});
