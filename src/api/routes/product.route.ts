import express, { Request, Response } from "express";
import AddProductUseCase from "../../modules/product-adm/usecase/add-product/add-product.usecase";
import ProductAdmProductRepository from "../../modules/product-adm/repository/product.repository";

export const productRoute = express.Router();

const useCase = new AddProductUseCase(new ProductAdmProductRepository());

productRoute.post("/", async (req: Request, res: Response) => {
  try {
    const product = await useCase.execute(req.body);
    res.status(201).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});
