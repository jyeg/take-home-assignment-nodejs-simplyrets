import express, { NextFunction, Request, Response } from 'express';

import bodyParser from 'body-parser';
import PropertyController from '../controllers/propertyController1';
import PropertyService from '../services/propertyService1';
import { Property } from '../entities';
import AppDataSource from '../dataSource';
import { SearchParams } from '../types';
import { validateAndSanitizeFilters } from '../middlewares/filterParamsHandler';

export const propertyRoutes = express.Router();

const repository = AppDataSource.getRepository(Property);
const service = new PropertyService(repository);
const controller = new PropertyController(service);

propertyRoutes.use(bodyParser.json());

propertyRoutes.get(
  '/',
  validateAndSanitizeFilters,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await controller.getAll(req as Request<SearchParams>, res);
    } catch (e) {
      next(e);
    }
  },
);

propertyRoutes.get('/:id', async (req, res, next) => {
  try {
    await controller.getById(req, res);
  } catch (e) {
    next(e);
  }
});

propertyRoutes.post('/', controller.create);

propertyRoutes.put('/:id', controller.update);

propertyRoutes.delete('/:id', controller.delete);
