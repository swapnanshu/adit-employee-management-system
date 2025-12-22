const Joi = require('joi');

/**
 * Validation schemas using Joi
 */
const schemas = {
  createEmployee: Joi.object({
    first_name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'First name is required',
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must not exceed 50 characters'
      }),
    
    last_name: Joi.string()
      .min(2)
      .max(50)
      .required()
      .messages({
        'string.empty': 'Last name is required',
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must not exceed 50 characters'
      }),
    
    email: Joi.string()
      .email()
      .required()
      .messages({
        'string.empty': 'Email is required',
        'string.email': 'Email must be a valid email address'
      }),
    
    company_id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.empty': 'Company ID is required',
        'string.guid': 'Company ID must be a valid UUID'
      }),
    
    role_id: Joi.string()
      .uuid()
      .required()
      .messages({
        'string.empty': 'Role ID is required',
        'string.guid': 'Role ID must be a valid UUID'
      })
  }),

  updateEmployee: Joi.object({
    first_name: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'First name must be at least 2 characters',
        'string.max': 'First name must not exceed 50 characters'
      }),
    
    last_name: Joi.string()
      .min(2)
      .max(50)
      .messages({
        'string.min': 'Last name must be at least 2 characters',
        'string.max': 'Last name must not exceed 50 characters'
      }),
    
    email: Joi.string()
      .email()
      .messages({
        'string.email': 'Email must be a valid email address'
      }),
    
    company_id: Joi.string()
      .uuid()
      .messages({
        'string.guid': 'Company ID must be a valid UUID'
      }),
    
    role_id: Joi.string()
      .uuid()
      .messages({
        'string.guid': 'Role ID must be a valid UUID'
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
