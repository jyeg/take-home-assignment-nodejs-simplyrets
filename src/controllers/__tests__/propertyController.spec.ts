// Import necessary libraries
import { Application } from 'express';
import request from 'supertest';
import { createConnection, getRepository, Repository } from 'typeorm';
import { Property } from '../../entities/Property';
import AppDataSource, { seedDb } from '../../dataSource';
import app from '../../app';

describe('Properties Controller', () => {
  let repository: Repository<Property>;

  beforeAll(async () => {
    await AppDataSource.initialize();
    // await seedDb();
    repository = AppDataSource.getRepository(Property);
  });

  afterEach(async () => {
    await repository.clear(); // Clear the repository between tests
  });

  afterAll(async () => {
    await repository.manager.connection.close(); // Close the database connection after all tests
  });

  // Unit test for the create property endpoint
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
    await repository.save(property1);

    const property2 = new Property();
    property2.address = 'New York';
    property2.price = 2000000;
    property2.bedrooms = 4;
    await repository.save(property2);

    // Make a GET request to the /properties endpoint
    const response = await request(app).get('/properties');

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          address: 'San Francisco',
          price: 1000000,
          bedrooms: 3,
        }),
        expect.objectContaining({
          address: 'New York',
          price: 2000000,
          bedrooms: 4,
        }),
      ]),
    );
  });
});
