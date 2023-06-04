import { NextFunction, Request, Response } from 'express';
import { query, validationResult } from 'express-validator';
import { ALLOWED_FILTER_PARAMS } from '../constants';

export const validateAndSanitizeFilters = [
  // validate and sanitize the page query parameter
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Invalid page number')
    .bail()
    .toInt(),

  // validate and sanitize the limit query parameter
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Invalid limit number')
    .bail()
    .toInt(),

  // Validate and sanitize the type filter
  query('type')
    .optional()
    .customSanitizer((value) => {
      // If no operator is provided, default to "eq"
      let [operator, type] = value.split(':');

      if (!type) {
        type = operator;
        operator = 'eq';
      }

      return `${operator}:${parseInt(type)}`;
    })
    .matches(/^not:.+|^eq:.+/)
    .withMessage('Invalid operator for type filter')
    .bail()
    .customSanitizer((value) => {
      const [operator, type] = value.split(':');
      return `${operator}:${encodeURI(type)}`;
    }),

  // Validate and sanitize the address filter
  query('address')
    .optional()
    .trim()
    .isString()
    .withMessage('Invalid operator for address filter')
    .bail()
    .customSanitizer((value) => {
      return `eq:${encodeURI(value)}`;
    }),

  // Validate and sanitize the price filter
  query('price')
    .optional()
    .customSanitizer((value) => {
      let [operator, price] = value.split(':');

      // If no operator is provided, default to "eq"
      if (!price) {
        price = operator;
        operator = 'eq';
      }

      return `${operator}:${parseInt(price)}`;
    })
    .matches(/^gt:[0-9]+|^lt:[0-9]+|^eq:[0-9]+/)
    .withMessage('Invalid operator or value for price filter')
    .bail()
    .customSanitizer((value) => {
      const [operator, price] = value.split(':');
      return `${operator}:${parseInt(price)}`;
    }),

  // Validate and sanitize the bedrooms filter
  query('bedrooms')
    .optional()
    .customSanitizer((value) => {
      let [operator, bedrooms] = value.split(':');

      // If no operator is provided, default to "eq"
      if (!bedrooms) {
        bedrooms = operator;
        operator = 'eq';
      }

      return `${operator}:${parseInt(bedrooms)}`;
    })
    .matches(/^gt:[0-9]+|^lt:[0-9]+|^eq:[0-9]+/)
    .withMessage('Invalid operator or value for bedrooms filter')
    .bail()
    .customSanitizer((value) => {
      const [operator, bedrooms] = value.split(':');
      return `${operator}:${parseInt(bedrooms)}`;
    }),

  // Validate and sanitize the bathrooms filter
  query('bathrooms')
    .optional()
    .customSanitizer((value) => {
      let [operator, bathrooms] = value.split(':');

      // If no operator is provided, default to "eq"
      if (!bathrooms) {
        bathrooms = operator;
        operator = 'eq';
      }

      return `${operator}:${parseInt(bathrooms)}`;
    })
    .matches(/^gt:[0-9]+|^lt:[0-9]+|^eq:[0-9]+/)
    .withMessage('Invalid operator or value for bathrooms filter')
    .bail()
    .customSanitizer((value) => {
      const [operator, bathrooms] = value.split(':');
      return `${operator}:${parseInt(bathrooms)}`;
    }),

  // Middleware to check for unexpected parameters
  (req: Request, res: Response, next: NextFunction) => {
    const params = Object.keys(req.query);

    for (let param of params) {
      if (!ALLOWED_FILTER_PARAMS.includes(param)) {
        return res.status(400).json({ error: `Invalid parameter: ${param}` });
      }
    }

    next();
  },

  // Add a middleware to handle validation errors
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
