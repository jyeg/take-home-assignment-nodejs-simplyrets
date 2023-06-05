import { ParsedParamsWithOperator } from '../../types';
import { createWhereFromParams } from '../filtersUtil'; // replace with the actual path to your util function
import { Not, MoreThan, LessThan } from 'typeorm';

describe('createWhereFromParams', () => {
  it('should return an empty object if no filters are provided', () => {
    const where = createWhereFromParams();
    expect(where).toEqual({});
  });

  it('should handle "not" operator', () => {
    const filters: ParsedParamsWithOperator = {
      type: { operator: 'not', value: 'house' },
    };
    const where = createWhereFromParams(filters);
    expect(where).toEqual({ type: Not('house') });
  });

  it('should handle "gt" operator', () => {
    const filters: ParsedParamsWithOperator = {
      price: { operator: 'gt', value: 500000 },
    };
    const where = createWhereFromParams(filters);
    expect(where).toEqual({ price: MoreThan(500000) });
  });

  it('should handle "lt" operator', () => {
    const filters: ParsedParamsWithOperator = {
      bedrooms: { operator: 'lt', value: 4 },
    };
    const where = createWhereFromParams(filters);
    expect(where).toEqual({ bedrooms: LessThan(4) });
  });

  it('should handle "eq" operator', () => {
    const filters: ParsedParamsWithOperator = {
      bathrooms: { operator: 'eq', value: 2 },
    };
    const where = createWhereFromParams(filters);
    expect(where).toEqual({ bathrooms: 2 });
  });

  it('should handle multiple filters', () => {
    const filters: ParsedParamsWithOperator = {
      type: { operator: 'not', value: 'house' },
      price: { operator: 'gt', value: 500000 },
      bedrooms: { operator: 'lt', value: 4 },
      bathrooms: { operator: 'eq', value: 2 },
    };
    const where = createWhereFromParams(filters);
    expect(where).toEqual({
      type: Not('house'),
      price: MoreThan(500000),
      bedrooms: LessThan(4),
      bathrooms: 2,
    });
  });
});
