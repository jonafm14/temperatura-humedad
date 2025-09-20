const pool = require('../config/db');

async function insertMeasurement({ temperatura, humedad }) {
  await pool.execute(
    'INSERT INTO mediciones (temperatura, humedad) VALUES (?, ?)',
    [temperatura, humedad]
  );
}

async function getHistoryByInterval(interval = 5) {
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
}

async function getMaxTemperature(date) {
  const [rows] = await pool.execute(
    `SELECT temperatura AS temperatura_max, fecha
     FROM mediciones
     WHERE DATE(fecha) = ?
     ORDER BY temperatura DESC
     LIMIT 1`,
    [date]
  );
  return rows[0];
}

async function getMinTemperature(date) {
  const [rows] = await pool.execute(
    `SELECT temperatura AS temperatura_min, fecha
     FROM mediciones
     WHERE DATE(fecha) = ?
     ORDER BY temperatura ASC
     LIMIT 1`,
    [date]
  );
  return rows[0];
}

async function getMaxHumidity(date) {
  const [rows] = await pool.execute(
    `SELECT humedad AS humedad_max, fecha
     FROM mediciones
     WHERE DATE(fecha) = ?
     ORDER BY humedad DESC
     LIMIT 1`,
    [date]
  );
  return rows[0];
}

async function getMinHumidity(date) {
  const [rows] = await pool.execute(
    `SELECT humedad AS humedad_min, fecha
     FROM mediciones
     WHERE DATE(fecha) = ?
     ORDER BY humedad ASC
     LIMIT 1`,
    [date]
  );
  return rows[0];
}

module.exports = {
  insertMeasurement,
  getHistoryByInterval,
  getMaxTemperature,
  getMinTemperature,
  getMaxHumidity,
  getMinHumidity
};