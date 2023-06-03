import express, { Request } from 'express';
import bodyParser from 'body-parser';
import PropertyController from '../controllers/PropertyController';
import PropertyService from '../services/PropertyService';
import { Property } from '../entities';
import AppDataSource from '../dataSource';
import { PaginationParams } from '../types';

export const propertyRoutes = express.Router();

const repository = AppDataSource.getRepository(Property);
const service = new PropertyService(repository);
const controller = new PropertyController(service);

propertyRoutes.use(bodyParser.json());

propertyRoutes.get('/', async (req, res, next) => {
  try {
    return await controller.getAll(req as Request<PaginationParams>, res);
  } catch (e) {
    next(e);
  }
});

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
