require('dotenv').config();
const scheduleSensorJob = require('./src/jobs/sensor.job');
const app = require('./src/app');
const bot = require('./src/bot/telegram.bot');

const PORT = process.env.PORT || 3000;

scheduleSensorJob();

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
