import { NextFunction, Request, Response } from 'express';
import PropertyService from '../services/propertyService';
import { Property } from '../entities/Property';
import { SearchParams, ParsedParamsWithOperator } from '../types';

// Define a class for the Property Controller, which handles API requests
class PropertyController {
  private service: PropertyService; // a private property to hold an instance of the property service

  // constructor takes an instance of PropertyService and assigns it to this.service property
  constructor(service: PropertyService) {
    this.service = service;
  }

  // method to get all properties
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

      // call the getAll method on the service instance, passing in the limit, skip, and filters as arguments
      const properties = await this.service.getAll(limit, skip, filters);

      // send the properties as a JSON response
      res.json({
        data: properties,
      });
    } catch (e) {
      // if an error occurs, pass it to the next middleware function
      next(e);
    }
  }

  // method to get a single property by ID
  async getById(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction,
  ) {
    let id: number;
    let property: Property | null;

    try {
      // extract the id from the request parameters
      id = req.params.id;

      // call the getById method on the service instance, passing in the id as an argument
      property = await this.service.getById(id);

      // if a property with the given id exists, send it as a JSON response
      if (property) {
        res.json(property);
      } else {
        // otherwise, send a 404 status code and a message indicating the property was not found
        res.status(404).send({ message: 'Property not found' });
      }
    } catch (e) {
      // if an error occurs, pass it to the next middleware function
      next(e);
      return;
    }
  }

  // method to create a new property
  async create(req: Request, res: Response, next: NextFunction) {
    const property = req.body as Property;
    try {
      // call the create method on the service instance, passing in the new property as an argument
      const createdProperty = await this.service.create(property);

      // if the property was not created for some reason, send a 400 status code and a "bad request" message
      if (!createdProperty) {
        res.status(400).json({ message: 'Bad request' });
        return;
      }

      // otherwise, send a 201 status code and the created property as a JSON response
      res.status(201).json(createdProperty);
    } catch (e) {
      // if an error occurs, pass it to the next middleware function
      next(e);
    }
  }

  // method to update an existing property by ID
  async update(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction,
  ) {
    const id = req.params.id;
    const updates = req.body as Partial<Property>;
    try {
      // call the update method on the service instance, passing in the id and updates as arguments
      const updatedProperty = await this.service.update(
        id,
        updates as Property,
      );

      // if the property was updated successfully, send it as a JSON response
      if (updatedProperty) {
        res.json(updatedProperty);
      } else {
        // otherwise, send a 404 status code and a message indicating the property was not found
        res.status(404).send({ message: 'Property not found' });
      }
    } catch (e) {
      // if an error occurs, pass it to the next middleware function
      next(e);
    }
  }

  // method to delete an existing property by ID
  async delete(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction,
  ) {
    const id = req.params.id;

    try {
      // call the delete method on the service instance, passing in the id as an argument
      const deletedProperty = await this.service.delete(id);

      // if the property was deleted successfully, send a 204 status code and an empty

      if (deletedProperty) {
        res.sendStatus(204);
      }
    } catch (e) {
      // if an error occurs, pass it to the next middleware function
      next(e);
    }
  }
}

export default PropertyController;
