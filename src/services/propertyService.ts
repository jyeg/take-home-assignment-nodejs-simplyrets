import { Repository, FindManyOptions } from 'typeorm';
import { Property } from '../entities/Property';
import { ParsedParamsWithOperator } from '../types';
import { createWhereFromParams } from '../utilities/filtersUtil';

// Set a default limit for queries if none is provided
const DEFAULT_LIMIT = 10;

/**
 * A service class for handling Property CRUD operations.
 */
class PropertyService {
  private repository: Repository<Property>;

  /**
   * Constructor for PropertyService.
   * @param repository - A TypeORM repository for the Property entity.
   */
  constructor(repository: Repository<Property>) {
    this.repository = repository;
  }

  /**
   * Returns all Property entities with pagination and filtering options.
   * @param limit - The number of entities to retrieve. Defaults to DEFAULT_LIMIT.
   * @param page - The page number to start retrieving entities from.
   * @param filters - A parsed query parameter object with filtering operators.
   * @returns A Promise that resolves to an array of Property entities.
   */
  async getAll(
    limit: number = DEFAULT_LIMIT,
    page?: number,
    filters?: ParsedParamsWithOperator,
  ): Promise<Property[]> {
    // Set options for the find operation
    const findOptions: FindManyOptions<Property> = {
      ...(page ? { skip: page } : {}),
      take: limit,
      order: {
        id: 'ASC',
      },
    };

    // Add where clause based on provided filters
    if (filters) {
      const where = createWhereFromParams(filters);
      findOptions.where = where;
    }

    // Return the result of the find operation
    return await this.repository.find(findOptions);
  }

  /**
   * Returns a Property entity by its id.
   * @param id - The id of the Property entity to retrieve.
   * @returns A Promise that resolves to the found Property entity or null if not found.
   */
  async getById(id: number): Promise<Property | null> {
    return await this.repository.findOne({ where: { id } });
  }

  /**
   * Creates a new Property entity.
   * @param property - The Property entity to create.
   * @returns A Promise that resolves to the created Property entity.
   */
  async create(property: Property): Promise<Property> {
    return await this.repository.save(property);
  }

  /**
   * Updates a Property entity by its id.
   * @param id - The id of the Property entity to update.
   * @param property - The updated Property entity.
   * @returns A Promise that resolves to the id of the updated Property entity.
   */
  async update(id: number, property: Property): Promise<number> {
    const response = await this.repository.update(id, property);
    if (!response.affected) {
      throw new Error('Property not found');
    }
    return id;
  }

  /**
   * Deletes a Property entity by its id.
   * @param id - The id of the Property entity to delete.
   * @returns A Promise that resolves to the id of the deleted Property entity.
   */
  async delete(id: number): Promise<number> {
    const response = await this.repository.delete(id);
    if (!response.affected) {
      throw new Error('Property not found');
    }
    return id;
  }
}

export default PropertyService;
