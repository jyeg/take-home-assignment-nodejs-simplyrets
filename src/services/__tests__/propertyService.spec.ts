// uses jest to mock out the propertyService and its methods. This allows us to test the controller without having to worry about the service. We can also test the service separately.

import { MoreThan } from 'typeorm';
import PropertyService from '../propertyService';

describe('PropertyService unit tests', () => {
  // Create mock instances of the service methods
  const mockGetAll = jest.fn();
  const mockGetById = jest.fn();
  const mockCreate = jest.fn();
  const mockUpdate = jest.fn();
  const mockDelete = jest.fn();

  // create a mock for the type orm repository dependency
  const mockRepository = {
    find: mockGetAll,
    findOne: mockGetById,
    create: mockCreate,
    save: mockUpdate,
    delete: mockDelete,
  };

  // Mock the PropertyService
  const propertyService = new PropertyService(mockRepository as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return the expected response when get all', async () => {
    // Arrange
    const expectedResponse = [{ id: 1, name: 'test' }];
    mockGetAll.mockResolvedValue(expectedResponse);

    // Act
    const response = await propertyService.getAll(1, 10, {
      bedrooms: { operator: 'gt', value: 1 },
    });

    // Assert
    expect(response).toEqual(expectedResponse);
    expect(mockGetAll).toHaveBeenCalledTimes(1);
    expect(mockGetAll).toHaveBeenCalledWith({
      skip: 10,
      take: 1,
      where: {
        bedrooms: MoreThan(1),
      },
      order: {
        id: 'ASC',
      },
    });
  });
});
