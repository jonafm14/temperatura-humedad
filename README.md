# Sensor App - Node.js + MySQL + MicroPython

Este proyecto consiste en un **sistema de monitoreo de temperatura y humedad** usando un sensor DHT22 conectado a un microcontrolador con **MicroPython**.  
El backend está desarrollado en **Node.js con Express** y almacena los datos en **MySQL**, exponiendo endpoints para consultar los valores en tiempo real, el historial y promedios horarios.

El proyecto está organizado de manera profesional para mostrar buenas prácticas de arquitectura y escalabilidad.

---

## 📌 Funcionalidad principal

1. API REST para consultar:
   - **Valores en vivo** (`/sensor/live`)  
   - **Temperatura maxima o minima** (`/sensor/tmax`) (`/sensor/tmin`)  
   - **Humedad maxima o minima** (`/sensor/hmax`) (`/sensor/hmin`)  
   - **Historial del día** (`/sensor/history`)  
   - **Promedios por rango horario** (`/sensor/average`)  
2. Cron job que automatiza la recolección de datos y envia alertas segun un umbral.

---

## 📂 Estructura de carpetas

```text
src/
├── index.js              # Punto de entrada, arranca el servidor
├── app.js                # Configuración de Express y middlewares
│
├── config/               # Configuración global del proyecto
│   └── db.js             # Conexión y pool a MySQL
│
├── controllers/          # Reciben requests, llaman a los services y devuelven la respuesta
│   └── sensor.controller.js
│
├── models/               # Definen la estructura de la base de datos y queries
│   # Actualmente no se usa, pero están para futuras ampliaciones
│
├── services/             # Lógica de negocio
│   └── sensor.service.js # Obtiene datos del ESP y los guarda en la DB
│
├── repository/             # Lógica encargada de interactuar con la DB
│   # Actualmente no se usa, pero están para futuras ampliaciones
│
├── routes/               # Definen los endpoints de la API
│   └── sensor.routes.js
│
├── jobs/                 # Tareas automáticas (cron jobs)
│   └── sensor.job.js     # Consulta al sensor cada 5 minutos
│
├── utils/                # Funciones auxiliares y helpers reutilizables
│   # Actualmente no se usa, pero están para futuras ampliaciones
│
└── middlewares/          # Middlewares Express (auth, logging, validaciones, rate limit)
    # Actualmente no se usa, pero están para futuras ampliaciones

```

---

## ⚙️ Tecnologías utilizadas

- **Node.js** → Backend y cron job  
- **Express** → Servidor y API REST  
- **MySQL** → Base de datos para histórico de mediciones  
- **Axios** → Para hacer peticiones HTTP al sensor  
- **node-cron** → Para programar consultas periódicas al sensor  
- **MicroPython** → Servidor embebido en el sensor DHT22  

---

## 📝 Buenas prácticas incluidas

- Separación de capas: rutas → controladores → servicios → modelos  
- Modularidad para facilitar escalabilidad  
- Carpeta `middlewares` para futuras validaciones o autenticación  
- Variables sensibles en `.env`  
- Documentación de cada carpeta para mostrar profesionalismo en entrevistas

---
