const cron = require('node-cron');
const sensorService = require('../services/sensor.service');
const { logError } = require('../services/log.service');
const bot = require('../bot/telegram.bot');

const CHAT_ID = process.env.CHAT_GROUP_ID;
const TEMP_MAX = 30;
const TEMP_MIN = 15;

const scheduleSensorJob = () => {
  cron.schedule('*/5 * * * *', async () => {
     try {
    const data = await sensorService.saveSensorData();

      if (data.temperatura > TEMP_MAX) {
        bot.sendMessage(CHAT_ID, `⚠️ Alerta: temperatura alta detectada: ${data.temperatura.toFixed(1)} °C`);
      } else if (data.temperatura < TEMP_MIN) {
        bot.sendMessage(CHAT_ID, `⚠️ Alerta: temperatura baja detectada: ${data.temperatura.toFixed(1)} °C`);
      }
      } catch (err) {
        await logError(
          { level: 'error', message: err.message, stack_trace: err.stack  }
        );
      }
  });
};

module.exports = scheduleSensorJob;
