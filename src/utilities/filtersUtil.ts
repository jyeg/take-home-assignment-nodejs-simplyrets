import { Not, MoreThan, LessThan } from 'typeorm';
import { FilterParams, ParsedParamsWithOperator } from '../types';

export const createWhereFromParams = (
  filters?: ParsedParamsWithOperator,
): FilterParams => {
  const where: any = {};

  if (filters) {
    Object.keys(filters).forEach((key) => {
      const { operator, value } = filters[key];
      switch (operator) {
        case 'not':
          where[key] = Not(value);
          break;
        case 'gt':
          where[key] = MoreThan(value);
          break;
        case 'lt':
          where[key] = LessThan(value);
          break;
        default:
          where[key] = value;
      }
    });
  }

  return where;
};
