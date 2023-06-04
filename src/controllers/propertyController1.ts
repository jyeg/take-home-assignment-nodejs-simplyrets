import { Request, Response } from 'express';
import PropertyService from '../services/propertyService1';
import { Property } from '../entities/Property';
import { SearchParams, ParsedParamsWithOperator } from '../types';

class PropertyController {
  private service: PropertyService;

  constructor(service: PropertyService) {
    this.service = service;
  }

  async getAll(req: Request<SearchParams>, res: Response) {
    // TODO: extract into reusable functions to parse the query parameters.
    // extract the limit and cursor from the query parameters
    const limit = parseInt(req.query.limit as string) || 10;
    const page = parseInt(req.query.page as string) || 1;
    // Calculate the number of items to skip:
    const skip = (page - 1) * limit;

    // Parse the filters from the query parameters
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
  }

  async getById(req: Request<{ id: string }>, res: Response) {
    let id: number;
    let property: Property | null;

    try {
      id = parseInt(req.params.id);
    } catch (e) {
      res.status(400).send({ message: 'Invalid id' });
      return;
    }
    // attempt to get the property from the service
    property = await this.service.getById(id);

    if (property) {
      res.json(property);
    } else {
      res.status(404).send({ message: 'Property not found' });
    }
  }

  async create(req: Request, res: Response) {
    const property = req.body as Property;
    const createdProperty = await this.service.create(property);
    res.status(201).json(createdProperty);
  }

  async update(req: Request, res: Response) {
    const id = req.params.id;
    const property = req.body as Property;
    await this.service.update(id, property);
    res.status(204).end();
  }

  async delete(req: Request, res: Response) {
    const id = req.params.id;
    await this.service.delete(id);
    res.status(204).end();
  }
}

export default PropertyController;
