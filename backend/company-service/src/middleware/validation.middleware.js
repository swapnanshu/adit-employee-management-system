const Joi = require('joi');

/**
 * Validation schemas using Joi
 */
const schemas = {
  createCompany: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .required()
      .messages({
        'string.empty': 'Company name is required',
        'string.min': 'Company name must be at least 2 characters',
        'string.max': 'Company name must not exceed 100 characters'
      }),
    
    industry: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Industry is required',
        'string.min': 'Industry must be at least 2 characters',
        'string.max': 'Industry must not exceed 50 characters'
      })
  }),

  updateCompany: Joi.object({
    name: Joi.string()
      .min(2)
      .max(100)
      .messages({
        'string.min': 'Company name must be at least 2 characters',
        'string.max': 'Company name must not exceed 100 characters'
      }),
    
    industry: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Industry must be at least 2 characters',
        'string.max': 'Industry must not exceed 50 characters'
      })
  }).min(1).messages({
    'object.min': 'At least one field is required for update'
  }),

  uuidParam: Joi.object({
    id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.guid': 'ID must be a valid UUID'
      })
  })
};

/**
 * Middleware factory for request validation
 * @param {string} schemaName - Name of the schema to use
 * @param {string} source - Source of data to validate (body, params, query)
 */
const validate = (schemaName, source = 'body') => {
  return (req, res, next) => {
    const schema = schemas[schemaName];
    
    if (!schema) {
      return res.status(500).json({
        success: false,
        error: 'Validation schema not found'
      });
    }

    const dataToValidate = req[source];
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: errors
      });
    }

    // Replace request data with validated and sanitized data
    req[source] = value;
    next();
  };
};

module.exports = {
  validate,
  schemas
};
