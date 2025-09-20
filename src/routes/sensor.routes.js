const express = require('express');
const router = express.Router();
const sensorController = require('../controllers/sensor.controller');

router.get('/live', sensorController.getLive);
router.get('/save', sensorController.saveLive);
router.get('/history', sensorController.getHistory);
router.get('/tmax', sensorController.getMaxTemperature);
router.get('/tmin', sensorController.getMinTemperature);
router.get('/hmax', sensorController.getMaxHumidity);
router.get('/hmin', sensorController.getMinHumidity);

module.exports = router;
