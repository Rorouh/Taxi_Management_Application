# Proyecto PSI - Gestión de una empresa de taxis

Este es un proyecto de la asignatura de **Proyectos de Sistemas de Información** en la Facultad de Ciencias.

## Descripción
Desarrollamos una **aplicación web** para gestionar una empresa de taxis. Permite:

- Registrar y listar **taxis** (matrícula, año, marca, modelo, nivel de confort).
- Registrar y listar **conductores** (NIF, nombre, género, año de nacimiento, dirección, licencia).
- Definir **precios por minuto** según nivel de confort y simulación de costes de viaje (tarifa diurna/nocturna).
- Una interfaz sencilla preparada en **Angular**.
- Un backend con **Node.js**, **Express** y **MongoDB**.

## Tecnologías
- **Frontend**: Angular, TypeScript, HTML, CSS
- **Backend**: Node.js, Express, Mongoose (MongoDB)
- **Base de datos**: MongoDB (local o Atlas)

## Estructura del proyecto
```
proyectoPSI/
├── backend/      # API REST
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── app.js    # Servidor Express
└── frontend/     # App Angular
    ├── src/app/
    │   ├── dashboard/
    │   ├── taxi/
    │   ├── conductor/
    │   └── precio-config/
    └── angular.json
```

## Cómo ejecutar

1. **Backend**
   ```bash
   cd proyectoPSI/backend
   npm install
   npm start
   ```
   El servidor arranca en http://localhost:3051

2. **Frontend**
   ```bash
   cd proyectoPSI/frontend
   npm install
   npm start
   ```
   La app corre en http://localhost:4200

## Uso rápido
- Entra en `/dashboard` y navega a cada sección:
  - Taxis: registro y listado
  - Conductores: registro y listado
  - Precios: configuración y simulador

¡Y listo! Cualquier duda, comenta con el equipo o revisa la documentación del proyecto.
