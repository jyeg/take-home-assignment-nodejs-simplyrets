import { NextFunction, Request, Response } from 'express';
import PropertyService from '../services/propertyService';
import { Property } from '../entities/Property';
import { SearchParams, ParsedParamsWithOperator } from '../types';

class PropertyController {
  private service: PropertyService;

  constructor(service: PropertyService) {
    this.service = service;
  }

  async getAll(req: Request<SearchParams>, res: Response, next: NextFunction) {
    try {
      // extract the limit and cursor from the query parameters
      const limit = parseInt(req.query.limit as string) || 10;
      const page = parseInt(req.query.page as string) || 1;
      // Calculate the number of items to skip:
      const skip = (page - 1) * limit;

      // Parse the filters from the query parameters remove page and limit
      const filters = Object.keys(req.query).reduce((acc, key) => {
        if (key === 'limit' || key === 'page') {
          return acc;
        }

        const [operator, value] = (req.query[key] as string).split(':');
        acc[key] = { operator, value };
        return acc;
      }, {} as ParsedParamsWithOperator);

      const properties = await this.service.getAll(limit, skip, filters);

      res.json({
        data: properties,
      });
    } catch (e) {
      next(e);
    }
  }

  async getById(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction,
  ) {
    let id: number;
    let property: Property | null;

    try {
      id = req.params.id;

      property = await this.service.getById(id);

      if (property) {
        res.json(property);
      } else {
        res.status(404).send({ message: 'Property not found' });
      }
    } catch (e) {
      next;
      return;
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    const property = req.body as Property;
    try {
      const createdProperty = await this.service.create(property);
      if (!createdProperty) {
        res.status(400).json({ message: 'Bad request' });
        return;
      }

      res.status(201).json(createdProperty);
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    const property = req.body as Property;
    try {
      await this.service.update(id, property);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const id = req.params.id;
    try {
      await this.service.delete(id);
      res.status(204).end();
    } catch (e) {
      next(e);
    }
  }
}

export default PropertyController;
