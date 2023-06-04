export type PaginationParams = {
  page?: string;
  limit?: string;
};

export type FilterParams = {
  address?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  type?: string;
};

export interface SearchParams extends PaginationParams, FilterParams {}

export type ParsedParamsWithOperator = {
  // [K in keyof FilterParams]: { operator: string; value: string };
  [key: string]: { operator: string; value: string };
};
