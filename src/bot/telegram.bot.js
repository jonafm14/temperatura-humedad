const TelegramBot = require('node-telegram-bot-api');
const sensorService = require('../services/sensor.service');
const axios = require('axios');

const TOKEN = process.env.TELEGRAM_TOKEN;
const SERVER_URL = process.env.SERVER_URL;
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/consultar/, async (msg) => {
  const chatId = msg.chat.id;

  try {
    const req = await axios.get(`${SERVER_URL}/sensor/live`);
    bot.sendMessage(chatId, `Temperatura: ${req.data.temperatura} °C\nHumedad: ${req.data.humedad} %`);
  } catch (err) {
    bot.sendMessage(chatId, `Error al consultar el sensor: ${err.message}`);
  }
});

bot.onText(/\/historial(?:\s+(\d+))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  const interval = match[1] ? parseInt(match[1]) : 5;

  try {
    const { data } = await axios.get(`${SERVER_URL}/sensor/history?interval=${interval}`);

    if (!data.length) {
      return bot.sendMessage(chatId, 'No hay datos para mostrar.');
    }

    let message = `📊 Historial del día (cada ${interval} min):\n`;
    data.forEach(row => {
      const date = new Date(row.fecha_group).toLocaleTimeString('es-AR', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      message += `${date} → Temp: ${row.temperatura_prom.toFixed(1)} °C, Hum: ${row.humedad_prom.toFixed(1)} %\n`;
    });


    bot.sendMessage(chatId, message);
  } catch (err) {
    bot.sendMessage(chatId, `Error al consultar el historial: ${err.message}`);
  }
});

bot.onText(/\/tmax(?:\s+(\d{2}\/\d{2}\/\d{4}))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let date = null;
  if (match[1]) {
    const parts = match[1].split('/');
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  try {
    const data = await sensorService.getMaxTemperature(date);
    if (!data || data.temperatura_max === null) {
      return bot.sendMessage(chatId, 'No hay datos disponibles para esa fecha.');
    }
    bot.sendMessage(
      chatId,
      `🌡 Temperatura máxima: ${data.temperatura_max.toFixed(1)} °C\n📅 Fecha y hora: ${new Date(data.fecha).toLocaleString()}`
    );
  } catch (err) {
    bot.sendMessage(chatId, `Error al consultar temperatura máxima: ${err.message}`);
  }
});

bot.onText(/\/tmin(?:\s+(\d{2}\/\d{2}\/\d{4}))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let date = null;
  if (match[1]) {
    const parts = match[1].split('/');
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  try {
    const data = await sensorService.getMinTemperature(date);
    if (!data || data.temperatura_min === null) {
      return bot.sendMessage(chatId, 'No hay datos disponibles para esa fecha.');
    }
    bot.sendMessage(
      chatId,
      `🌡 Temperatura mínima: ${data.temperatura_min.toFixed(1)} °C\n📅 Fecha y hora: ${new Date(data.fecha).toLocaleString()}`
    );
  } catch (err) {
    bot.sendMessage(chatId, `Error al consultar temperatura mínima: ${err.message}`);
  }
});

bot.onText(/\/hmax(?:\s+(\d{2}\/\d{2}\/\d{4}))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let date = null;
  if (match[1]) {
    const parts = match[1].split('/');
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  try {
    const data = await sensorService.getMaxHumidity(date);
    if (!data || data.humedad_max === null) {
      return bot.sendMessage(chatId, 'No hay datos disponibles para esa fecha.');
    }
    bot.sendMessage(
      chatId,
      `💧 Humedad máxima: ${data.humedad_max.toFixed(1)} %\n📅 Fecha y hora: ${new Date(data.fecha).toLocaleString()}`
    );
  } catch (err) {
    bot.sendMessage(chatId, `Error al consultar humedad máxima: ${err.message}`);
  }
});

bot.onText(/\/hmin(?:\s+(\d{2}\/\d{2}\/\d{4}))?/, async (msg, match) => {
  const chatId = msg.chat.id;
  let date = null;
  if (match[1]) {
    const parts = match[1].split('/');
    date = `${parts[2]}-${parts[1]}-${parts[0]}`;
  }
  try {
    const data = await sensorService.getMinHumidity(date);
    if (!data || data.humedad_min === null) {
      return bot.sendMessage(chatId, 'No hay datos disponibles para esa fecha.');
    }
    bot.sendMessage(
      chatId,
      `💧 Humedad mínima: ${data.humedad_min.toFixed(1)} %\n📅 Fecha y hora: ${new Date(data.fecha).toLocaleString()}`
    );
  } catch (err) {
    bot.sendMessage(chatId, `Error al consultar humedad mínima: ${err.message}`);
  }
});

module.exports = bot;
