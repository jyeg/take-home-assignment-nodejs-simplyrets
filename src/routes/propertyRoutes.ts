import express, { NextFunction, Request, Response } from 'express';

import bodyParser from 'body-parser';
import PropertyController from '../controllers/propertyController';
import PropertyService from '../services/propertyService';
import { Property } from '../entities';
import AppDataSource from '../dataSource';
import { SearchParams } from '../types';
import { validateAndSanitizeFilters } from '../middlewares/filterParamsHandler';
import { param } from 'express-validator';

export const propertyRoutes = express.Router();

const repository = AppDataSource.getRepository(Property);
const service = new PropertyService(repository);
const controller = new PropertyController(service);

propertyRoutes.use(bodyParser.json());

propertyRoutes.get(
  '/',
  validateAndSanitizeFilters,
  async (req: Request, res: Response, next: NextFunction) => {
    return await controller.getAll(req as Request<SearchParams>, res, next);
  },
);

propertyRoutes.get(
  '/:id',
  param('id').isInt().withMessage('Must be an integer'),
  async (req, res, next) => {
    return await controller.getById(req as Request<{ id: number }>, res, next);
  },
);

propertyRoutes.post('/', async (req, res, next) => {
  return await controller.create(req, res, next);
});

propertyRoutes.put('/:id', async (req, res, next) => {
  return await controller.update(req, res, next);
});

propertyRoutes.delete('/:id', async (req, res, next) => {
  return await controller.delete(req, res, next);
});
