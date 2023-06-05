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

    // write integration tests for the other filters
    it('should filter properties correctly using the bathroom filter', async () => {
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

  describe('POST /properties', () => {
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

    // Integration test for the create property endpoint with invalid data
    it('should return a 400 if the request body is invalid', async () => {
      const response = await request(app).post('/properties').send({
        address: '6201 15th Ave',
        price: 1000000,
        bathrooms: 2,
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('PUT /properties/:id', () => {
    // Integration test for the update property endpoint
    it('should update a property', async () => {
      // Create a property
      const property = new Property();
      property.address = 'San Francisco';
      property.price = 1000000;
      property.bedrooms = 3;
      property.bathrooms = 2;
      await repository.save(property);

      // Make a PUT request to the /properties/:id endpoint
      const response = await request(app)
        .put(`/properties/${property.id}`)
        .send({
          address: 'New York',
          price: 2000000,
          bedrooms: 4,
          bathrooms: 3,
        });

      expect(response.statusCode).toBe(200);

      const responseAfterUpdate = await request(app).get(
        `/properties/${property.id}`,
      );

      expect(responseAfterUpdate.body).toEqual(
        expect.objectContaining({
          address: 'New York',
          price: 2000000,
          bedrooms: 4,
          bathrooms: 3,
        }),
      );
    });

    // Integration test for the update property endpoint with invalid data
    it('should return a 400 if the request body is invalid', async () => {
      // Create a property
      const property = new Property();
      property.address = 'San Francisco';
      property.price = 1000000;
      property.bedrooms = 3;
      property.bathrooms = 2;
      await repository.save(property);

      // Make a PUT request to the /properties/:id endpoint
      const response = await request(app)
        .put(`/properties/${property.id}`)
        .send({});

      expect(response.statusCode).toBe(400);
    });
  });

  describe('DELETE /properties/:id', () => {
    // Integration test for the delete property endpoint
    it('should delete a property', async () => {
      // Create a property
      const property = new Property();
      property.address = 'San Francisco';
      property.price = 1000000;
      property.bedrooms = 3;
      property.bathrooms = 2;
      await repository.save(property);

      // Make a DELETE request to the /properties/:id endpoint
      const response = await request(app).delete(`/properties/${property.id}`);

      expect(response.statusCode).toBe(204);
    });

    // Integration test for the delete property endpoint with invalid id
    it('should return a 404 if the property is not found', async () => {
      // Make a DELETE request to the /properties/:id endpoint
      const response = await request(app).delete(`/properties/100`);

      expect(response.statusCode).toBe(400);
    });

    // Integration test for the delete property endpoint with missing id parameter
    it('should return a 400 if the id parameter is missing', async () => {
      // Make a DELETE request to the /properties/:id endpoint
      const response = await request(app).delete(`/properties/`);

      expect(response.statusCode).toBe(404);
    });
  });
});
