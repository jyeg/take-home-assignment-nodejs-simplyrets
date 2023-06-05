import { Repository } from 'typeorm';
import { Property } from '../entities/Property';
import { ParsedParamsWithOperator } from '../types';
import { createWhereFromParams } from '../utilities/filtersUtil';

const DEFAULT_LIMIT = 10;

class PropertyService {
  private repository: Repository<Property>;

  constructor(repository: Repository<Property>) {
    this.repository = repository;
  }

  async getAll(
    limit: number = DEFAULT_LIMIT,
    page?: number,
    filters?: ParsedParamsWithOperator,
  ): Promise<Property[]> {
    const where = filters ? createWhereFromParams(filters) : undefined;

    return await this.repository.find({
      ...(page ? { skip: page } : {}), // If page is defined, add skip to the query
      where,
      take: limit,
      order: {
        id: 'ASC',
      },
    });
  }

  async getById(id: number): Promise<Property | null> {
    return await this.repository.findOne({ where: { id } });
  }

  async create(property: Property): Promise<Property> {
    return await this.repository.save(property);
  }

  async update(id: string, property: Property): Promise<void> {
    await this.repository.update(id, property);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}

export default PropertyService;
