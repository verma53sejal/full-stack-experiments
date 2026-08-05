const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const roles = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roles('Admin'), userController.getUsers);
router.put('/:id/role', authMiddleware, roles('Admin'), userController.updateUserRole);
router.delete('/:id', authMiddleware, roles('Admin'), userController.deleteUser);

module.exports = router;
