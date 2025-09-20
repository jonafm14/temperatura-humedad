const { logError } = require('../services/log.service');
const sensorService = require('../services/sensor.service');

const getLive = async (req, res) => {
  try {
    const data = await sensorService.getLiveData(); 
    res.json({
      temperatura: Number(data.temperatura.toFixed(1)),
      humedad: Number(data.humedad.toFixed(1))
    });
  } catch (err) {
    await logError(
      { level: 'error', message: err.message, stack_trace: err.stack, endpoint: req.originalUrl }
    )
    res.status(500).json({ error: "Error obteniendo la temperatura y la humedad." });
  }
};

const saveLive  = async (req, res) => {
  try {
    await sensorService.saveSensorData();

    res.json({
      message: 'Datos del sensor guardados correctamente'
    });
  } catch (err) {
    await logError(
      { level: 'error', message: err.message, stack_trace: err.stack, endpoint: req.originalUrl }
    )
    res.status(500).json({ error: "Error guardando los datos del sensor." });
  }
};

const getHistory = async (req, res) => {
  try {
    const interval = parseInt(req.query.interval) || 5;
    const data = await sensorService.getHistoryByInterval(interval);
    res.json(data);
  } catch (err) {
    await logError(
      { level: 'error', message: err.message, stack_trace: err.stack, endpoint: req.originalUrl }
    )
    res.status(500).json({ error: "Error obteniendo el historial." });
  }
};

// Temperatura máxima del día (o fecha indicada)
const getMaxTemperature = async (req, res) => {
  try {
    const dateParam = req.query.date; // esperado: YYYY-MM-DD
    const data = await sensorService.getMaxTemperature(dateParam);
    res.json(data);
  } catch (err) {
    await logError(
      { level: 'error', message: err.message, stack_trace: err.stack, endpoint: req.originalUrl }
    )
    res.status(500).json({ error: "Error obteniendo la maxima temperatura." });
  }
};

// Temperatura mínima del día (o fecha indicada)
const getMinTemperature = async (req, res) => {
  try {
    const dateParam = req.query.date;
    const data = await sensorService.getMinTemperature(dateParam);
    res.json(data);
  } catch (err) {
    await logError(
      { level: 'error', message: err.message, stack_trace: err.stack, endpoint: req.originalUrl }
    )
    res.status(500).json({ error: "Error obteniendo la minima temperatura." });
  }
};

// Humedad máxima del día (o fecha indicada)
const getMaxHumidity = async (req, res) => {
  try {
    const dateParam = req.query.date;
    const data = await sensorService.getMaxHumidity(dateParam);
    res.json(data);
  } catch (err) {
    await logError(
      { level: 'error', message: err.message, stack_trace: err.stack, endpoint: req.originalUrl }
    )
    res.status(500).json({ error: "Error obteniendo la maxima humedad." });
  }
};

// Humedad mínima del día (o fecha indicada)
const getMinHumidity = async (req, res) => {
  try {
    const dateParam = req.query.date;
    const data = await sensorService.getMinHumidity(dateParam);
    res.json(data);
  } catch (err) {
    await logError(
      { level: 'error', message: err.message, stack_trace: err.stack, endpoint: req.originalUrl }
    )
    res.status(500).json({ error: "Error obteniendo la minima humedad." });
  }
};

module.exports = { getLive, saveLive, getHistory, getMaxTemperature, getMinTemperature, getMaxHumidity, getMinHumidity };
