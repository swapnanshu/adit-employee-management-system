const express = require('express');
const router = express.Router();
const RoleController = require('../controllers/role.controller');
const { validate } = require('../middleware/validation.middleware');

/**
 * Role Routes
 * All routes are prefixed with /api/v1/roles
 */

// GET /api/v1/roles - Get all roles
router.get('/', RoleController.getAllRoles);

// GET /api/v1/roles/:id - Get role by ID
router.get('/:id', 
  validate('uuidParam', 'params'),
  RoleController.getRoleById
);

// POST /api/v1/roles - Create new role
router.post('/', 
  validate('createRole'),
  RoleController.createRole
);

// PATCH /api/v1/roles/:id - Update role
router.patch('/:id', 
  validate('uuidParam', 'params'),
  validate('updateRole'),
  RoleController.updateRole
);

// DELETE /api/v1/roles/:id - Delete role
router.delete('/:id', 
  validate('uuidParam', 'params'),
  RoleController.deleteRole
);

module.exports = router;
