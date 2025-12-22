const Joi = require('joi');

/**
 * Validation schemas using Joi
 */
const schemas = {
  createRole: Joi.object({
    title: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Role title is required',
        'string.min': 'Role title must be at least 2 characters',
        'string.max': 'Role title must not exceed 50 characters'
      }),
    
    description: Joi.string()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 5 characters',
        'string.max': 'Description must not exceed 200 characters'
      })
  }),

  updateRole: Joi.object({
    title: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Role title must be at least 2 characters',
        'string.max': 'Role title must not exceed 50 characters'
      }),
    
    description: Joi.string()
      .min(5)
      .max(200)
      .messages({
        'string.min': 'Description must be at least 5 characters',
        'string.max': 'Description must not exceed 200 characters'
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
