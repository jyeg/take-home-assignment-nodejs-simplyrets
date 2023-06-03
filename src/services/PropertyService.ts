import { Repository } from 'typeorm';
import { Property } from '../entities/Property';

class PropertyService {
  private repository: Repository<Property>;

  constructor(repository: Repository<Property>) {
    this.repository = repository;
  }

  async getAll(cursor?: number, limit: number = 10): Promise<Property[]> {
    if (cursor) {
      return await this.repository.find({
        skip: cursor,
        take: limit,
        order: {
          id: 'ASC',
        },
      });
    } else {
      return await this.repository.find({
        take: limit,
        order: {
          id: 'ASC',
        },
      });
    }
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
