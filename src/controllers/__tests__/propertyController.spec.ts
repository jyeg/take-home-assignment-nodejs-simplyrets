import { Request, Response } from 'express';
import PropertyController from '../propertyController';

describe('PropertyController', () => {
  let propertyController: PropertyController;
  let mockService: any;
  let mockRequest: Request<Partial<{ id?: number }>>;
  let mockResponse: Response;
  let mockNextFunction: any;

  beforeEach(() => {
    mockService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    mockRequest = {
      query: {},
      params: {},
      body: {},
    } as Request<Partial<{ id?: number }>>;

    mockResponse = {
      json: jest.fn(),
      send: jest.fn(),
      status: jest.fn().mockReturnThis(),
      sendStatus: jest.fn(),
    } as any;

    mockNextFunction = jest.fn();

    propertyController = new PropertyController(mockService);
  });

  describe('getAll', () => {
    it('should call service.getAll with default values when no query param is provided', async () => {
      await propertyController.getAll(
        mockRequest as any,
        mockResponse,
        mockNextFunction,
      );
      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockService.getAll).toHaveBeenCalledWith(10, 0, {});
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });

    it('should call service.getAll with provided query params', async () => {
      mockRequest.query = {
        limit: '20',
        page: '3',
        address: 'eq:New York',
        price: 'gte:500',
      };

      await propertyController.getAll(
        mockRequest as any,
        mockResponse,
        mockNextFunction,
      );

      expect(mockService.getAll).toHaveBeenCalledTimes(1);
      expect(mockService.getAll).toHaveBeenCalledWith(20, 40, {
        address: { operator: 'eq', value: 'New York' },
        price: { operator: 'gte', value: '500' },
      });
      expect(mockResponse.json).toHaveBeenCalledTimes(1);
    });

    it('should handle service.getAll exception', async () => {
      const error = new Error('getAll failed');
      mockService.getAll.mockRejectedValueOnce(error);

      await propertyController.getAll(
        mockRequest as any,
        mockResponse,
        mockNextFunction,
      );

      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      expect(mockNextFunction).toHaveBeenCalledWith(error);
    });
  });

  describe('getById', () => {
    it('should call service.getById with provided id param', async () => {
      mockRequest.params = { id: 123 };

      await propertyController.getById(
        mockRequest as Request<{ id: number }>,
        mockResponse,
        mockNextFunction,
      );

      expect(mockService.getById).toHaveBeenCalledTimes(1);
      expect(mockService.getById).toHaveBeenCalledWith(123);
    });

    it('should return 404 when property is not found', async () => {
      mockService.getById.mockResolvedValueOnce(null);

      await propertyController.getById(
        mockRequest as Request<{ id: number }>,
        mockResponse,
        mockNextFunction,
      );

      expect(mockService.getById).toHaveBeenCalledTimes(1);
      expect(mockService.getById).toHaveBeenCalledWith(undefined);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.send).toHaveBeenCalledTimes(1);
    });

    it('should handle service.getById exception', async () => {
      const error = new Error('getById failed');
      mockService.getById.mockRejectedValueOnce(error);

      await propertyController.getById(
        mockRequest as Request<{ id: number }>,
        mockResponse,
        mockNextFunction,
      );

      expect(mockNextFunction).toHaveBeenCalledTimes(1);
      expect(mockNextFunction).toHaveBeenCalledWith(error);
    });
  });
});
