# Sensor App - Node.js + MySQL + MicroPython

Sistema professionale di monitoraggio della temperatura e dell'umidità, progettato per ambienti IoT e domotica. Utilizza un sensore DHT22 collegato a un microcontrollore con MicroPython e un backend Node.js che centralizza, memorizza ed espone i dati tramite una API REST, oltre a gestire avvisi automatici.

---

## 🚀 Descrizione generale e obiettivi

L'obiettivo di questo progetto è offrire una soluzione robusta e scalabile per la raccolta, la memorizzazione e la consultazione di dati ambientali (temperatura e umidità) in tempo reale e in modo storico. Il sistema permette di:

- Consultare valori attuali e statistici da qualsiasi client (web, mobile, bot, ecc.).
- Automatizzare la raccolta e la memorizzazione dei dati.
- Inviare avvisi automatici in caso di condizioni fuori soglia.
- Facilitare l'integrazione con altri sistemi o dashboard.

---

## 📌 Funzionalità principale

- **API RESTful** per:
  - Ottenere valori in tempo reale (`/sensor/live`)
  - Consultare temperatura massima/minima (`/sensor/tmax`, `/sensor/tmin`)
  - Consultare umidità massima/minima (`/sensor/hmax`, `/sensor/hmin`)
  - Consultare lo storico del giorno (`/sensor/history`)
  - Ottenere medie per intervallo orario (`/sensor/average`)
- **Cron job** che:
  - Interroga periodicamente il sensore e memorizza i dati in MySQL.
  - Invia avvisi automatici (ad esempio, su Telegram) se vengono superate soglie configurabili.
- **Audit degli errori**: Tutti gli errori rilevanti vengono registrati in una tabella di log per analisi e tracciabilità.

---

## ⚙️ Tecnologie utilizzate

- **Node.js**: Backend, logica di business e cron job.
- **Express**: Framework per l'API REST.
- **MySQL**: Database relazionale per la memorizzazione storica e l'audit.
- **Axios**: Client HTTP per la comunicazione con il microcontrollore.
- **node-cron**: Programmazione di task automatici.
- **MicroPython**: Firmware del microcontrollore per esporre i dati del sensore.
- **dotenv**: Gestione delle variabili d'ambiente.
- **(Opzionale) Telegram Bot API**: Per notifiche e consultazioni da Telegram.

---

## 📂 Struttura delle cartelle

```text
src/
├── index.js              # Entry point, avvia il server
├── app.js                # Configurazione di Express e middleware
│
├── config/               # Configurazione globale (DB, variabili d'ambiente)
│   └── db.js             # Connessione e pool MySQL
│
├── controllers/          # Ricevono le richieste, chiamano i servizi e restituiscono la risposta
│   └── sensor.controller.js
│
├── services/             # Logica di business e accesso a dati esterni
│   ├── sensor.service.js # Ottiene i dati dal sensore e li salva nel DB
│   └── log.service.js    # Servizio per registrare log/audit
│
├── repository/           # Accesso diretto al DB
│   └── sensor.repository.js # Logica del DB
│
├── routes/               # Definiscono gli endpoint dell'API
│   └── sensor.routes.js
│
├── jobs/                 # Task automatici (cron job)
│   └── sensor.job.js     # Interroga il sensore ogni 5 minuti e gestisce gli avvisi
│
├── bot/                  # Integrazione con Telegram Bot
│   └── telegram.bot.js
│
├── utils/                # Funzioni ausiliarie e helper riutilizzabili
│
└── middlewares/          # Middleware Express (auth, logging, validazioni, rate limit)
```

**Note:**
- Le cartelle `repository`, `utils` e `middlewares` sono pronte per future estensioni.
- Il file `.env` (non incluso nel repo) memorizza credenziali e configurazioni sensibili.

---

## 📝 Best practice incluse

- **Separazione dei livelli:** Controller, servizi, route e configurazione ben distinti.
- **Gestione centralizzata degli errori:** Gli errori vengono loggati nel database e non vengono esposti dettagli sensibili al client.
- **Variabili sensibili in `.env`:** Sicurezza e portabilità.
- **Codice modulare e scalabile:** Facile da mantenere ed estendere.
- **Documentazione chiara:** Struttura e scopo di ogni cartella spiegati.
- **Pronto per autenticazione e validazioni:** Cartella dei middleware pronta per implementare sicurezza aggiuntiva.

---

## 📚 Esempi di utilizzo dell'API

### Ottenere valori in tempo reale

**GET** `/sensor/live`

**Risposta:**
```json
{
  "temperatura": 23.5,
  "umidità": 56.2
}
```

### Consultare la temperatura massima del giorno

**GET** `/sensor/tmax?date=2025-09-20`

**Risposta:**
```json
{
  "temperatura_max": 28.7,
  "data": "2025-09-20T14:35:00.000Z"
}
```

### Consultare lo storico del giorno (raggruppato per intervallo di 5 minuti)

**GET** `/sensor/history?interval=5`

**Risposta:**
```json
[
  {
    "gruppo_data": "2025-09-20 10:00:00",
    "temperatura_media": 22.1,
    "umidità_media": 55.0
  },
  ...
]
```

---

## 🛠️ Installazione e configurazione

1. Clona il repository.
2. Installa le dipendenze:
   ```
   npm install
   ```
3. Crea un file `.env` nella root con le seguenti variabili:
   ```
   SERVER_URL=http://<ip-locale>:3000
   SENSOR_URL=http://<ip-del-sensore>:5000/data
   DB_HOST=localhost
   DB_USER=utente
   DB_PASSWORD=password
   DB_NAME=nome_db
   CHAT_GROUP_ID=<id_telegram>
   ```
4. Crea le tabelle necessarie in MySQL:

```sql
CREATE TABLE mediciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  temperatura FLOAT NOT NULL,
  umidità FLOAT NOT NULL,
  data TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  level VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  stack_trace TEXT,
  endpoint VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

5. Avvia il server:
   ```
   npm start
   ```

---

## 🔮 Possibili estensioni future

- Implementazione di autenticazione e autorizzazione per l'API.
- Dashboard web per la visualizzazione grafica dei dati.
- Integrazione con altri servizi di messaggistica o notifica.
- Supporto per più sensori e località.
- Esportazione dei dati in formato CSV/Excel.
- Test automatizzati e copertura del codice.
- Miglioramenti nella gestione degli errori e avvisi intelligenti.