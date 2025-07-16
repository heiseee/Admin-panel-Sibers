const express = require('express');
const authRoute = require('./authRoute');
const showRoute = require('./showRoute');

const route = express.Router();

route.use('/auth', authRoute);
route.use('/show', showRoute);

module.exports = route;