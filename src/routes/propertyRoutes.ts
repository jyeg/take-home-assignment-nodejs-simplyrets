import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import PropertyController from '../controllers/propertyController';
import PropertyService from '../services/propertyService';
import { Property } from '../entities';
import AppDataSource from '../dataSource';
import { SearchParams } from '../types';
import { validateAndSanitizeFilters } from '../middlewares/filterParamsHandler';
import { param } from 'express-validator';

// Create a new router using express.Router()
export const propertyRoutes = express.Router();

// Obtain repository, service and controller instances
const repository = AppDataSource.getRepository(Property);
const service = new PropertyService(repository);
const controller = new PropertyController(service);

// Set request body parser middleware
propertyRoutes.use(bodyParser.json());

// Set up route to get all properties
propertyRoutes.get(
  '/',
  validateAndSanitizeFilters,
  (req: Request, res: Response, next: NextFunction) =>
    controller.getAll(req as Request<SearchParams>, res, next),
);

// Set up route to get a single property by id
propertyRoutes.get(
  '/:id',
  param('id').isInt().withMessage('Must be an integer'),
  (req, res, next) =>
    controller.getById(req as Request<{ id: number }>, res, next),
);

// Set up route to create a new property
propertyRoutes.post('/', (req, res, next) => controller.create(req, res, next));

// Set up route to update a property by id
propertyRoutes.put(
  '/:id',
  param('id').isInt().withMessage('Must be an integer'),
  (req, res, next) =>
    controller.update(req as Request<{ id: number }>, res, next),
);

// Set up route to delete a property by id
propertyRoutes.delete(
  '/:id',
  param('id').isInt().withMessage('Must be an integer'),
  (req, res, next) =>
    controller.delete(req as Request<{ id: number }>, res, next),
);
