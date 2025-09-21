# Sensor App - Node.js + MySQL + MicroPython

Sistema profesional de monitoreo de temperatura y humedad, diseñado para entornos IoT y domótica. Utiliza un sensor DHT22 conectado a un microcontrolador con MicroPython, y un backend Node.js que centraliza, almacena y expone los datos mediante una API REST, además de gestionar alertas automáticas.

---

## 🚀 Descripción general y objetivos

El objetivo de este proyecto es ofrecer una solución robusta y escalable para la recolección, almacenamiento y consulta de datos ambientales (temperatura y humedad) en tiempo real y de forma histórica. El sistema permite:

- Consultar valores actuales y estadísticos desde cualquier cliente (web, móvil, bot, etc.).
- Automatizar la recolección y almacenamiento de datos.
- Enviar alertas automáticas ante condiciones fuera de rango.
- Facilitar la integración con otros sistemas o dashboards.

---

## 📌 Funcionalidad principal

- **API RESTful** para:
  - Obtener valores en vivo (`/sensor/live`)
  - Consultar temperatura máxima/mínima (`/sensor/tmax`, `/sensor/tmin`)
  - Consultar humedad máxima/mínima (`/sensor/hmax`, `/sensor/hmin`)
  - Consultar historial del día (`/sensor/history`)
  - Obtener promedios por intervalo horario (`/sensor/average`)
- **Cron job** que:
  - Consulta el sensor periódicamente y almacena los datos en MySQL.
  - Envía alertas automáticas (por ejemplo, a Telegram) si se superan umbrales configurables.
- **Auditoría de errores**: Todos los errores relevantes se registran en una tabla de logs para análisis y trazabilidad.

---

## ⚙️ Tecnologías utilizadas

- **Node.js**: Backend, lógica de negocio y cron jobs.
- **Express**: Framework para la API REST.
- **MySQL**: Base de datos relacional para almacenamiento histórico y auditoría.
- **Axios**: Cliente HTTP para comunicación con el microcontrolador.
- **node-cron**: Programación de tareas automáticas.
- **MicroPython**: Firmware del microcontrolador para exponer datos del sensor.
- **dotenv**: Gestión de variables de entorno.
- **(Opcional) Telegram Bot API**: Para notificaciones y consultas desde Telegram.

---

## 📂 Estructura de carpetas

```text
src/
├── index.js              # Punto de entrada, arranca el servidor
├── app.js                # Configuración de Express y middlewares
│
├── config/               # Configuración global (DB, variables de entorno)
│   └── db.js             # Conexión y pool a MySQL
│
├── controllers/          # Reciben requests, llaman a los services y devuelven la respuesta
│   └── sensor.controller.js
│
├── services/             # Lógica de negocio y acceso a datos externos
│   ├── sensor.service.js # Obtiene datos del sensor y los guarda en la DB
│   └── log.service.js    # Servicio para registrar logs/auditoría
│
├── repository/           # Acceso directo a la DB
│   └── sensor.repository.js # Lógica de la DB
│
├── routes/               # Definen los endpoints de la API
│   └── sensor.routes.js
│
├── jobs/                 # Tareas automáticas (cron jobs)
│   └── sensor.job.js     # Consulta al sensor cada 5 minutos y gestiona alertas
│
├── utils/                # Funciones auxiliares y helpers reutilizables
│
└── middlewares/          # Middlewares Express (auth, logging, validaciones, rate limit)
```

**Notas:**
- Las carpetas `repository`, `utils` y `middlewares` están preparadas para futuras ampliaciones.
- El archivo `.env` (no incluido en el repo) almacena credenciales y configuraciones sensibles.

---

## 📝 Buenas prácticas incluidas

- **Separación de capas:** Controladores, servicios, rutas y configuración bien diferenciados.
- **Manejo centralizado de errores:** Los errores se loguean en la base de datos y no se exponen detalles sensibles al cliente.
- **Variables sensibles en `.env`:** Seguridad y portabilidad.
- **Código modular y escalable:** Fácil de mantener y ampliar.
- **Documentación clara:** Estructura y propósito de cada carpeta explicados.
- **Preparado para autenticación y validaciones:** Carpeta de middlewares lista para implementar seguridad adicional.

---

## 📚 Ejemplos de uso de la API

### Obtener valores en vivo

**GET** `/sensor/live`

**Respuesta:**
```json
{
  "temperatura": 23.5,
  "humedad": 56.2
}
```

### Consultar temperatura máxima del día

**GET** `/sensor/tmax?date=2025-09-20`

**Respuesta:**
```json
{
  "temperatura_max": 28.7,
  "fecha": "2025-09-20T14:35:00.000Z"
}
```

### Consultar historial del día (agrupado por intervalo de 5 minutos)

**GET** `/sensor/history?interval=5`

**Respuesta:**
```json
[
  {
    "fecha_group": "2025-09-20 10:00:00",
    "temperatura_prom": 22.1,
    "humedad_prom": 55.0
  },
  ...
]
```

---

## 🛠️ Instalación y configuración

1. Clona el repositorio.
2. Instala dependencias:
   ```
   npm install
   ```
3. Crea un archivo `.env` en la raíz con las siguientes variables:
   ```
   SERVER_URL=http://<ip-local>:3000
   SENSOR_URL=http://<ip-del-sensor>:5000/data
   DB_HOST=localhost
   DB_USER=usuario
   DB_PASSWORD=contraseña
   DB_NAME=nombre_db
   CHAT_GROUP_ID=<id_telegram>
   ```
4. Crea las tablas necesarias en MySQL:

```sql
CREATE TABLE mediciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  temperatura FLOAT NOT NULL,
  humedad FLOAT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

5. Inicia el servidor:
   ```
   npm start
   ```

---

## 🔮 Futuras ampliaciones posibles

- Implementación de autenticación y autorización para la API.
- Dashboard web para visualización gráfica de los datos.
- Integración con otros servicios de mensajería o notificación.
- Soporte para múltiples sensores y ubicaciones.
- Exportación de datos en formatos CSV/Excel.
- Tests automatizados y cobertura de código.
- Mejoras en la gestión de errores y alertas inteligentes.
