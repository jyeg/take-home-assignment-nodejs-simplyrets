import { Request, Response } from 'express';
import PropertyService from '../services/PropertyService';
import { Property } from '../entities/Property';
import { PaginationParams } from '../types';

class PropertyController {
  private service: PropertyService;

  constructor(service: PropertyService) {
    this.service = service;
  }

  async getAll(req: Request<PaginationParams>, res: Response) {
    const parsedLimit = parseInt(req.query.limit as string) || 10;
    const parsedCursor = req.query.cursor
      ? parseInt(req.query.cursor as string)
      : undefined;

    const properties = await this.service.getAll(parsedCursor, parsedLimit);

    res.json({
      data: properties,
      cursor: properties.length ? properties[properties.length - 1].id : null,
      hasMore: properties.length === parsedLimit,
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
