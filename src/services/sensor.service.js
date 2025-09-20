const axios = require('axios');
const pool = require('../config/db');

const SENSOR_URL = process.env.SENSOR_URL;

async function getLiveData() {
  try {
    const { data } = await axios.get(SENSOR_URL);
    return data;
  } catch (err) {
    throw err;
  }
}

async function saveSensorData() {
  try {
    const { data } = await axios.get(SENSOR_URL);
    const { temperatura, humedad } = data;

    await pool.execute(
      'INSERT INTO mediciones (temperatura, humedad) VALUES (?, ?)',
      [temperatura, humedad]
    );

    return data;
  } catch (err) {
    throw err;
  }
}

async function getHistoryByInterval(interval = 5) {
  try {
    const [rows] = await pool.execute(
      `SELECT 
          FROM_UNIXTIME(FLOOR(UNIX_TIMESTAMP(fecha)/(?*60))*?*60) AS fecha_group,
          AVG(temperatura) AS temperatura_prom,
          AVG(humedad) AS humedad_prom
       FROM mediciones
       WHERE DATE(fecha) = CURDATE()
       GROUP BY fecha_group
       ORDER BY fecha_group ASC`,
      [interval, interval]
    );

    return rows;
  } catch (err) {
    throw err;
  }
}

/**
 * Temperatura máxima del día (o de la fecha indicada)
 */
async function getMaxTemperature(date) {
  try {
    const queryDate = date || new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const [rows] = await pool.execute(
      `SELECT temperatura AS temperatura_max, fecha
       FROM mediciones
       WHERE DATE(fecha) = ?
       ORDER BY temperatura DESC
       LIMIT 1`,
      [queryDate]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

/**
 * Temperatura mínima del día (o de la fecha indicada)
 */
async function getMinTemperature(date) {
  try {
    const queryDate = date || new Date().toISOString().split('T')[0];
    const [rows] = await pool.execute(
      `SELECT temperatura AS temperatura_min, fecha
       FROM mediciones
       WHERE DATE(fecha) = ?
       ORDER BY temperatura ASC
       LIMIT 1`,
      [queryDate]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

/**
 * Humedad máxima del día (o de la fecha indicada)
 */
async function getMaxHumidity(date) {
  try {
    const queryDate = date || new Date().toISOString().split('T')[0];
    const [rows] = await pool.execute(
      `SELECT humedad AS humedad_max, fecha
       FROM mediciones
       WHERE DATE(fecha) = ?
       ORDER BY humedad DESC
       LIMIT 1`,
      [queryDate]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

/**
 * Humedad mínima del día (o de la fecha indicada)
 */
async function getMinHumidity(date) {
  try {
    const queryDate = date || new Date().toISOString().split('T')[0];
    const [rows] = await pool.execute(
      `SELECT humedad AS humedad_min, fecha
       FROM mediciones
       WHERE DATE(fecha) = ?
       ORDER BY humedad ASC
       LIMIT 1`,
      [queryDate]
    );
    return rows[0];
  } catch (err) {
    throw err;
  }
}

module.exports = { saveSensorData, getLiveData, getHistoryByInterval, getMaxTemperature, getMinTemperature, getMaxHumidity, getMinHumidity };
