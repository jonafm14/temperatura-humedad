const axios = require('axios');
const sensorRepository = require('../repository/sensor.repository');

const SENSOR_URL = process.env.SENSOR_URL;

async function getLiveData() {
  const { data } = await axios.get(SENSOR_URL);
  return data;
}

async function saveSensorData() {
  const { data } = await axios.get(SENSOR_URL);
  const { temperatura, humedad } = data;
  await sensorRepository.insertMeasurement({ temperatura, humedad });
  return data;
}

async function getHistoryByInterval(interval = 5) {
  return await sensorRepository.getHistoryByInterval(interval);
}

async function getMaxTemperature(date) {
  const queryDate = date || new Date().toISOString().split('T')[0];
  return await sensorRepository.getMaxTemperature(queryDate);
}

async function getMinTemperature(date) {
  const queryDate = date || new Date().toISOString().split('T')[0];
  return await sensorRepository.getMinTemperature(queryDate);
}

async function getMaxHumidity(date) {
  const queryDate = date || new Date().toISOString().split('T')[0];
  return await sensorRepository.getMaxHumidity(queryDate);
}

async function getMinHumidity(date) {
  const queryDate = date || new Date().toISOString().split('T')[0];
  return await sensorRepository.getMinHumidity(queryDate);
}

module.exports = {
  saveSensorData,
  getLiveData,
  getHistoryByInterval,
  getMaxTemperature,
  getMinTemperature,
  getMaxHumidity,
  getMinHumidity
};
