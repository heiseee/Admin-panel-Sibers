const express = require('express');
const authController = require('../controllers/authController');
const checkRole = require('../middleware/checkRoleMiddleware');
const authMiddleware = require('../middleware/authMiddleware');

const route = express.Router();

route.post('/create', checkRole(2), authController.create);
route.post('/login', authController.login);
route.put('/update/:id', checkRole(2), authController.update);
route.delete('/delete/:id', checkRole(2), authController.delete);
route.get('/check', checkRole(2), authMiddleware, authController.check);

module.exports = route;