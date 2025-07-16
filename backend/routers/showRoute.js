const express = require('express');
const showController = require('../controllers/showController');
const checkRole = require('../middleware/checkRoleMiddleware');

const route = express.Router();

route.get('/', checkRole(2), showController.getAll)
route.get('/:id', checkRole(2), showController.getOne)


module.exports = route;