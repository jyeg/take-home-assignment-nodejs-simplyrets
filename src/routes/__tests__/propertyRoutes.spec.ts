import request from 'supertest';
import app from '../../app';
import AppDataSource, { seedDb } from '../../dataSource';
import { Property } from '../../entities/Property';
import { Repository } from 'typeorm';

describe('propertyRoutes', () => {
  let repository: Repository<Property>;

  beforeAll(async () => {
    await AppDataSource.initialize();
    repository = AppDataSource.getRepository(Property);
  });

  afterEach(async () => {
    await repository.clear(); // Clear the repository between tests
  });

  afterAll(async () => {
    await repository.manager.connection.destroy(); // Close the database connection after all tests
  });

  describe('GET /properties', () => {
    // Itegration test for the create property endpoint
    it('should create a new property', async () => {
      const response = await request(app).post('/properties').send({
        address: '6201 15th Ave',
        price: 1000000,
        bedrooms: 3,
        bathrooms: 2,
        type: 'MultiFamily',
      });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.address).toBe('6201 15th Ave');
      expect(response.body.price).toBe(1000000);
      expect(response.body.bedrooms).toBe(3);
    });

    // Integration test for the get all properties endpoint
    it('should return all properties', async () => {
      // Create a few properties
      const property1 = new Property();
      property1.address = 'San Francisco';
      property1.price = 1000000;
      property1.bedrooms = 3;
      property1.bathrooms = 2;
      await repository.save(property1);

      const property2 = new Property();
      property2.address = 'New York';
      property2.price = 2000000;
      property2.bedrooms = 4;
      property2.bathrooms = 3;

      await repository.save(property2);

      // Make a GET request to the /properties endpoint
      const response = await request(app).get('/properties');

      expect(response.statusCode).toBe(200);
      expect(response.body?.data).toHaveLength(2);
      expect(response.body?.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            address: 'San Francisco',
            price: 1000000,
            bedrooms: 3,
            bathrooms: 2,
          }),
          expect.objectContaining({
            address: 'New York',
            price: 2000000,
            bedrooms: 4,
            bathrooms: 3,
          }),
        ]),
      );
    });

    // Integration test for the filter on the get all properties endpoint
    it('should filter properties correctly using the bedroom filter', async () => {
      // Create a few properties
      const property1 = new Property();
      property1.address = 'San Francisco';
      property1.price = 1000000;
      property1.bedrooms = 3;
      property1.bathrooms = 2;
      await repository.save(property1);

      const property2 = new Property();
      property2.address = 'New York';
      property2.price = 2000000;
      property2.bedrooms = 4;
      property2.bathrooms = 3;

      await repository.save(property2);

      // Make a GET request to the /properties endpoint
      const response = await request(app).get(
        '/properties?bedrooms=3&bathrooms=2',
      );

      expect(response.statusCode).toBe(200);
      expect(response.body?.data).toHaveLength(1);
      expect(response.body?.data).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            address: 'San Francisco',
            price: 1000000,
            bedrooms: 3,
            bathrooms: 2,
          }),
        ]),
      );
    });
  });
});
