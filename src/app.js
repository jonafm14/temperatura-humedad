const express = require('express');
const sensorRoutes = require('./routes/sensor.routes');

const app = express();

app.use(express.json());

app.use('/sensor', sensorRoutes);

module.exports = app;
