# Proyecto PSI – Gestión de Taxis y Viajes

Este repositorio contiene el **backend** en Node.js/Express y el **frontend** en Angular para una aplicación de gestión de taxis, conductores, turnos, clientes, pedidos y viajes. Está diseñado para conectarse a una base de datos MongoDB (local o de la facultad) y exponer una API REST consumida desde la interfaz web.

---

## Índice

1. [Descripción General](#descripción-general)
2. [Tecnologías Utilizadas](#tecnologías-utilizadas)
3. [Estructura del Repositorio](#estructura-del-repositorio)
4. [Instalación y Configuración](#instalación-y-configuración)

   1. [Requisitos Previos](#requisitos-previos)
   2. [Configuración de la Base de Datos](#configuración-de-la-base-de-datos)
   3. [Instalación del Backend](#instalación-del-backend)
   4. [Instalación del Frontend](#instalación-del-frontend)
5. [Uso en Desarrollo](#uso-en-desarrollo)

   1. [Arrancar el Backend](#arrancar-el-backend)
   2. [Arrancar el Frontend](#arrancar-el-frontend)
6. [Despliegue en Producción](#despliegue-en-producción)

   1. [Build del Frontend](#build-del-frontend)
   2. [Servir Frontend estático desde Express](#servir-frontend-estático-desde-express)
   3. [Arrancar el Servidor Unificado](#arrancar-el-servidor-unificado)
7. [Descripción de la API](#descripción-de-la-api)

   1. [Rutas Principales](#rutas-principales)
   2. [Ejemplos de Peticiones](#ejemplos-de-peticiones)
8. [Estructura de Datos (Modelos)](#estructura-de-datos-modelos)
9. [Estructura del Frontend](#estructura-del-frontend)
10. [Notas y Recomendaciones](#notas-y-recomendaciones)

---

## Descripción General

Esta aplicación cubre los siguientes casos de uso:

* **Gestión de conductores**: creación, listado, modificación y eliminación de conductores.
* **Gestión de taxis**: creación, listado, actualización y eliminación de taxis.
* **Gestión de turnos**: asignación de taxis y conductores a turnos, consulta de turnos activos y disponibles.
* **Gestión de clientes**: alta de nuevos clientes y consulta por NIF o ID.
* **Gestión de pedidos**: creación de un pedido de viaje, listado de pedidos pendientes, consulta y cambio de estado.
* **Gestión de viajes**: creación de un viaje vinculado a un pedido y a un turno, consulta de viajes por conductor, finalización de viajes (cálculo de precio, kilómetros y tiempo).
* **Reportes**: generación de totales, subtotales y detalles de viajes, horas y kilómetros por conductor o taxi en un rango de fechas.

El frontend (Angular) consume estas rutas REST y presenta formularios y vistas interactivas para cada uno de los módulos.

---

## Tecnologías Utilizadas

* **Backend**

  * Node.js v16.x
  * Express
  * Mongoose
  * MongoDB (conexión local o Universidad)
  * CORS / Morgan / Http-errors
* **Frontend**

  * Angular v16.x
  * TypeScript
  * RxJS
  * Leaflet (mapas, opcional)
  * Bootstrap o CSS personalizado
* **Despliegue / Servidor**

  * appserver.alunos.di.fc.ul.pt (Linux/CentOS)
  * Puertos asignados:

    * Backend: **3000**
    * Frontend desarrollo: **<tu-puerto-angular>** (e.g. 3046)
  * MongoDB en la Facultad: puerto 27017, base `PSI046`, usuario/clave `PSI046`.

---

## Estructura del Repositorio

```
/
├── backend/
│   ├── bin/
│   │   └── www                  # Script de arranque del servidor
│   ├── controllers/             # Lógica de cada recurso (taxi, conductor, turno, ...)
│   │   ├── taxiController.js
│   │   ├── conductorController.js
│   │   ├── turnoController.js
│   │   ├── clienteController.js
│   │   ├── pedidoController.js
│   │   ├── viajeController.js
│   │   └── reportController.js
│   ├── data/                    # JSONs de apoyo (códigos postales, etc.)
│   │   └── codigos_postais.json
│   ├── models/                  # Esquemas Mongoose
│   │   ├── Taxi.js
│   │   ├── Conductor.js
│   │   ├── Turno.js
│   │   ├── Cliente.js
│   │   ├── Pedido.js
│   │   ├── Viaje.js
│   │   └── Precio.js
│   ├── routes/
│   │   ├── api.js               # Define todas las rutas `/taxi`, `/conductor`, `/turno`, etc.
│   │   ├── index.js             # Ruta raíz (opcional)
│   │   └── users.js             # Ruta de usuarios (ejemplo generado por Express)
│   ├── views/                   # Vistas Jade/HTML (no se usa en API propiamente)
│   ├── public/                  # Archivos estáticos si se sirven desde Express
│   ├── app.js                   # Configuración de Express, conexión Mongo, middleware
│   └── package.json             # Dependencias del backend
│
└── frontend/                     # (En desarrollo) Proyecto Angular
    ├── e2e/                     # Tests end-to-end
    ├── src/
    │   ├── app/
    │   │   ├── services/        # Servicios HTTP para consumir la API
    │   │   │   ├── taxi.service.ts
    │   │   │   ├── conductor.service.ts
    │   │   │   ├── turno.service.ts
    │   │   │   ├── cliente.service.ts
    │   │   │   ├── pedido.service.ts
    │   │   │   ├── viaje.service.ts
    │   │   │   ├── precio.service.ts
    │   │   │   └── report.service.ts
    │   │   ├── components/      # Componentes Angular (conductor, taxi, dashboard, etc.)
    │   │   │   ├── conductor/
    │   │   │   ├── taxi/
    │   │   │   ├── turno/
    │   │   │   ├── cliente/
    │   │   │   ├── pedido/
    │   │   │   ├── viaje/
    │   │   │   ├── reportes/
    │   │   │   └── …  
    │   │   └── app.module.ts    # Módulo raíz
    │   ├── assets/              # Imágenes, JSON estáticos, mapas, etc.
    │   ├── environments/        # (Opcional) environment.ts, environment.prod.ts
    │   ├── index.html
    │   ├── main.ts
    │   ├── polyfills.ts
    │   ├── styles.css
    │   └── …  
    ├── angular.json             
    ├── package.json             # Dependencias del frontend
    └── tsconfig.json
```

---

## Instalación y Configuración

### 1. Requisitos Previos

* **Node.js** v16.x (en el servidor de la Facultad: ya instalado; localmente puedes usar compatible).
* **npm** v8.x (el que acompaña a Node 16).
* **MongoDB** (en servidor local o “appserver” de la Facultad, puerto 27017).
* **Angular CLI** (solo para desarrollo local, no necesario en el servidor “appserver” si no corriges versión de Node).
* **SSH** configurado para conectar a `appserver.alunos.di.fc.ul.pt` con tu usuario `PSI046`.

### 2. Configuración de la Base de Datos

* Cada grupo (p. ej. 046) tiene su propia BD en MongoDB en el servidor:

  ```
  URI: mongodb://PSI046:PSI046@localhost:27017/PSI046?retryWrites=true&authSource=PSI046
  ```
* **Opcional**: Si quieres usar tu MongoDB local, sustituye esa URI por la tuya:

  ```
  mongodb://localhost:27017/PSI046_local
  ```
* El backend lee la variable de entorno `MONGO_URI`. Si no está definida, usará la URI por defecto (la de la Facultad).

### 3. Instalación del Backend

1. Conéctate al servidor (o en tu máquina local) y ve a la carpeta `backend/`.
2. Crea (si no existe) un fichero de entorno en `backend/.env` (opcional) con:

   ```
   MONGO_URI=mongodb://PSI046:PSI046@localhost:27017/PSI046?retryWrites=true&authSource=PSI046
   PORT=3000
   ```
3. Instala dependencias:

   ```bash
   cd backend
   npm install
   ```
4. Verifica que tu `app.js` (o `server.js`) use `process.env.MONGO_URI` o la URI por defecto:

   ```js
   const defaultUri = 'mongodb://PSI046:PSI046@localhost:27017/PSI046?retryWrites=true&authSource=PSI046';
   const mongoUri  = process.env.MONGO_URI || defaultUri;
   mongoose.connect(mongoUri)
     .then(() => console.log('✅ Conectado a MongoDB'))
     .catch(err => console.error('❌ Error conectando a MongoDB:', err));
   ```

### 4. Instalación del Frontend

1. En tu máquina local, instala Angular CLI (si no lo tienes):

   ```bash
   npm install -g @angular/cli@16
   ```
2. Ve a la carpeta `frontend/` y edita (o crea) `src/environments/environment.ts`:

   ```ts
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000'  // o la IP/dominio del servidor si pruebas “remoto”
   };
   ```
3. Instala dependencias:

   ```bash
   cd frontend
   npm install
   ```

---

## Uso en Desarrollo

### 1. Arrancar el Backend

* **Localmente**:

  ```bash
  cd backend
  export MONGO_URI="mongodb://localhost:27017/PSI046_local"
  npm start
  ```

  Por defecto arranca en el puerto **3000** y se conectará a tu MongoDB local.
* **En el servidor “appserver”**:

  ```bash
  cd ~/PSIServer/backend
  export MONGO_URI="mongodb://PSI046:PSI046@localhost:27017/PSI046?retryWrites=true&authSource=PSI046"
  npm start
  ```

  El backend escuchará en `http://localhost:3000/` de ese servidor.

### 2. Arrancar el Frontend

* **Localmente** (suponiendo que el backend local está en `http://localhost:3000`):

  ```bash
  cd frontend
  ng serve --host 0.0.0.0 --port 4200
  ```

  Luego abres `http://localhost:4200` en tu navegador.
* **En el servidor “appserver”** (para pruebas remotas, con Node 16 y Angular 16, si no tienes Angular CLI global):

  ```bash
  cd ~/PSIServer/frontend
  npm install
  npx ng serve --host 0.0.0.0 --port 3046 --allowed-hosts all
  ```

  Para acceder desde tu navegador local:

  ```
  http://appserver.alunos.di.fc.ul.pt:3046/
  ```

  Y tu backend (API) queda en `http://appserver.alunos.di.fc.ul.pt:3000/`.

> **Importante**: Asegúrate de que en todos los servicios Angular (`*.service.ts`) apuntes a `environment.apiUrl`. Por ejemplo:
>
> ```ts
> // taxi.service.ts
> private url = `${environment.apiUrl}/taxi`;
> ```

---

## Despliegue en Producción

La forma recomendada de desplegar en un único puerto (3000) es:

1. **Build del Frontend en modo “producción”** y copiar los archivos compilados a `backend/public`:

   ```bash
   cd frontend
   ng build --configuration production --output-path=../backend/public
   ```

   Esto genera `backend/public/index.html`, `backend/public/*.js`, `*.css`, etc.

2. **Configurar Express para servir estáticos** y fallback a `index.html`. En `backend/app.js`, añade al final *antes* del catch 404:

   ```js
   const path = require('path');
   // Sirve el contenido estático de la carpeta public
   app.use(express.static(path.join(__dirname, 'public')));
   // Cualquier ruta que no sea API, devuelve index.html (HTML5 mode)
   app.get('*', (req, res) => {
     res.sendFile(path.join(__dirname, 'public/index.html'));
   });
   ```

3. **Arrancar solo Express** en el puerto 3000:

   ```bash
   cd backend
   export MONGO_URI="mongodb://PSI046:PSI046@localhost:27017/PSI046?retryWrites=true&authSource=PSI046"
   npm start
   ```

   Con esto, quien acceda a `http://appserver.alunos.di.fc.ul.pt:3000/` recibirá la aplicación Angular completa y cualquier llamada AJAX a `/api/...` o `/taxi`, `/conductor`, etc., se resolverá por las rutas definidas en Express.

---

## Descripción de la API

Toda la API está prefijada por `/` (sin namespace explícito). A continuación se detallan las rutas principales agrupadas por módulo:

### Rutas Principales

#### 1. Taxi

* **POST** `/taxi`

  * Crea un nuevo taxi.
  * Body JSON: `{ matricula: string, modelo: string, … }`
* **GET** `/taxi`

  * Devuelve lista de todos los taxis.
* **PUT** `/taxi/:id`

  * Actualiza datos del taxi con *id = id*.
* **DELETE** `/taxi/:id`

  * Elimina el taxi con *id = id* (si no está en turnos activos).

#### 2. Conductor

* **POST** `/conductor`

  * Crea un nuevo conductor.
  * Body JSON: `{ nif: string, nombre: string, genero: string, anoNacimiento: number, direccion: string, licencia: string }`
* **GET** `/conductor`

  * Devuelve lista de todos los conductores.
* **GET** `/conductor/:nif`

  * Obtiene conductor por su NIF.
* **PUT** `/conductor/:nif`

  * Actualiza conductor con NIF = `:nif`.
* **DELETE** `/conductor/:nif`

  * Elimina conductor si no está en turno activo.

#### 3. Turno

* **GET** `/turno`

  * Lista todos los turnos (últimos creados primero).
* **GET** `/turno/activos`

  * Lista solo turnos activos (con conductor y taxi asignados y no finalizados).
* **GET** `/turno/:nif`

  * Lista turnos de un conductor (por su NIF).
* **POST** `/turno`

  * Crea un nuevo turno. Body JSON: `{ conductor: ObjectID, taxi: ObjectID, inicio: Date, … }`
* **POST** `/turno/taxis-disponibles`

  * Body JSON: `{ fecha: Date, ubicacion: { lat, lng }, … }` → devuelve taxis libres cerca.

#### 4. Cliente

* **POST** `/cliente`

  * Crea un nuevo cliente. Body JSON: `{ nif: string, nombre: string, direccion: string, … }`
* **GET** `/cliente/:nif`

  * Obtiene cliente por NIF.
* **GET** `/cliente/:id`

  * Obtiene cliente por *id*.

#### 5. Pedido

* **POST** `/pedido`

  * Crea un pedido de viaje. Body JSON: `{ cliente: ObjectID, origen: coords, destino: coords, estado: "pendiente" }`
* **GET** `/pedido/:id`

  * Obtiene un pedido por su ID.
* **POST** `/pedido/cambiar-estado/:id`

  * Cambia el estado de un pedido (`pendiente` → `aceptado` → `en progreso` → `finalizado`).
* **POST** `/pedido/pendientes`

  * Body JSON: `{ conductor: ObjectID, proximidad: Number }` → Lista pedidos pendientes disponibles.

#### 6. Viaje

* **POST** `/viaje`

  * Crea un viaje asociado a un pedido y un turno. Body JSON: `{ pedido: ObjectID, turno: ObjectID, distanciaCliente: number, tiempoTotal: number, inicio: Date, precio: number }`
* **GET** `/viaje/pedido/:id`

  * Busca viaje asociado a un pedido (`id` de pedido).
* **GET** `/viaje/:id`

  * Obtiene un viaje por su *id*.
* **PUT** `/viaje/finalizar/:id`

  * Finaliza el viaje: recibe `{ fin: Date, kilometros: number, precio?: number }`.
* **GET** `/viaje/conductor/:nif`

  * Lista viajes de un conductor (por NIF).
* **GET** `/viaje/taxi/:id/existe`

  * Comprueba si un taxi (por ID) está en algún viaje en curso.

#### 7. Precio

* **POST** `/precios`

  * Crea o actualiza la tarifa por minuto y km. Body JSON: `{ precioMinuto: number, precioKm: number }`
* **GET** `/precios`

  * Recupera la tarifa actual.
* **POST** `/precios/simular`

  * Simula precio: Body JSON `{ minutos: number, km: number }` → devuelve `{ total: number }`.

#### 8. Reportes

* **GET** `/reportes/totales?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`

  * Devuelve totales de viajes, horas y km en el rango de fechas.
* **GET** `/reportes/subtotales/:tipo?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`

  * `:tipo` = `viajes` | `horas` | `km`. Devuelve subtotales por conductor y por taxi.
* **GET** `/reportes/detalles/:tipo/:entidad/:id?inicio=YYYY-MM-DD&fin=YYYY-MM-DD`

  * `:tipo` = `viajes` | `horas` | `km`, `:entidad` = `conductor` | `taxi`.
  * `:id` = el *id* del conductor o taxi. Devuelve lista de detalles (fechas + valor).

---

### Ejemplos de Peticiones

1. **Crear Conductor**

   ```bash
   curl -X POST http://localhost:3000/conductor \
     -H "Content-Type: application/json" \
     -d '{
       "nif": "12345678A",
       "nombre": "Juan Pérez",
       "genero": "M",
       "anoNacimiento": 1985,
       "direccion": "Calle Falsa 123",
       "licencia": "LIC-987654"
     }'
   ```
2. **Listar Conductores**

   ```bash
   curl http://localhost:3000/conductor
   ```
3. **Crear Turno (asignar taxi + conductor)**

   ```bash
   curl -X POST http://localhost:3000/turno \
     -H "Content-Type: application/json" \
     -d '{
       "conductor": "64b1d2e987a1f82b31c2f0e9",
       "taxi": "64b1d2e987a1f82b31c2f0f0",
       "inicio": "2025-05-27T08:00:00.000Z"
     }'
   ```
4. **Simular Precio**

   ```bash
   curl -X POST http://localhost:3000/precios/simular \
     -H "Content-Type: application/json" \
     -d '{"minutos": 15, "km": 5}'
   # Respuesta: { "total": 15*precioMinuto + 5*precioKm }
   ```
5. **Detallar Reporte de Horas de un Conductor**

   ```bash
   curl http://localhost:3000/reportes/detalles/horas/conductor/64b1d2e987a1f82b31c2f0e9?inicio=2025-05-01&fin=2025-05-31
   ```

---

## Estructura de Datos (Modelos)

En la carpeta `backend/models` hay un archivo por cada colección. A modo de ejemplo:

```js
// models/Conductor.js
const mongoose = require('mongoose');
const ConductorSchema = new mongoose.Schema({
  nif:       { type: String, unique: true, required: true },
  nombre:    { type: String, required: true },
  genero:    { type: String, enum: ['M','F'], required: true },
  anoNacimiento: { type: Number, required: true },
  direccion: { type: String, required: true },
  licencia:  { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Conductor', ConductorSchema);
```

De forma similar:

* **Taxi.js**: `{ matricula: String, modelo: String, capacidad: Number, … }`
* **Turno.js**: `{ conductor: ObjectId, taxi: ObjectId, inicio: Date, fin?: Date }`
* **Cliente.js**: `{ nif: String, nombre: String, direccion: String, … }`
* **Pedido.js**: `{ cliente: ObjectId, origen: coords, destino: coords, estado: String, … }`
* **Viaje.js**: `{ pedido: ObjectId, turno: ObjectId, distanciaCliente: Number, tiempoTotal: Number, inicio: Date, fin: Date, precio: Number }`
* **Precio.js**: `{ precioMinuto: Number, precioKm: Number, updatedAt: Date }`

---

## Estructura del Frontend

En `frontend/src/app` encontrarás:

* **services/**

  * `taxi.service.ts`
  * `conductor.service.ts`
  * `turno.service.ts`
  * `cliente.service.ts`
  * `pedido.service.ts`
  * `viaje.service.ts`
  * `precio.service.ts`
  * `report.service.ts`

  > Cada service consume `environment.apiUrl + '/recurso'`.
* **components/**

  * **taxi/**: componente para listar/crear/editar taxis.
  * **conductor/**: componente para gestionar conductores.
  * **turno/**: componente para asignar/ver turnos.
  * **cliente/**: componente para alta y consulta de clientes.
  * **pedido/**: flujo de creación de pedido.
  * **viaje/**: interfaz para iniciar y finalizar viajes.
  * **reportes/**: pantalla de selección de fecha/tipo y visor de resultados.
* **app.module.ts**

  * Importa los módulos de Angular (`BrowserModule`, `FormsModule`, `HttpClientModule`, `RouterModule`) y declara todas las rutas y componentes.
* **app-routing.module.ts**

  * Define las rutas de navegación:

    ```
    /conductor       → ConductorComponent  
    /taxi            → TaxiComponent  
    /turno           → TurnoComponent  
    /cliente         → ClienteComponent  
    /pedido          → PedidoComponent  
    /viaje           → ViajeComponent  
    /reportes        → ReportesComponent  
    ```
* **environments/** (si está presente)

  * `environment.ts` y `environment.prod.ts` con:

    ```ts
    export const environment = {
      production: false,
      apiUrl: 'http://localhost:3000'  // Cambiar a la URL del backend en producción
    };
    ```

---

## Notas y Recomendaciones

* **CORS**: El backend habilita CORS globalmente (`app.use(cors())`), por lo que el frontend en otro puerto (3046) podrá hacer peticiones a `localhost:3000` sin problema.
* **Puertos**:

  * El backend **SIEMPRE** escucha en el puerto **3000** (a menos que cambies `process.env.PORT`).
  * El frontend en desarrollo suele usar **4200** (o 3046 en el servidor de la Facultad).
  * En producción, todo se sirve desde el mismo 3000 (Express sirve archivos estáticos de Angular).
* **Errores comunes**:

  1. *“Port 3000 is already in use”* → el backend ya está corriendo en 3000, no puedes arrancar Angular en ese mismo puerto. Usa otro (4200/3046).
  2. *“Error connecting to MongoDB: ECONNREFUSED 127.0.0.1:27017”* → MongoDB no corre local, usa la URI correcta (`mongodb://PSI046:PSI046@localhost:27017/PSI046`).
  3. *Rutas Angular apuntan a `localhost:3000` mientras estás probando en servidor remoto* → cambia `environment.apiUrl` a `http://appserver.alunos.di.fc.ul.pt:3000`.
* **SSH Remoto con VSCode**:

  * Añade en `~/.ssh/config`:

    ```
    Host PSI
      HostName appserver.alunos.di.fc.ul.pt
      User PSI046
    ```
  * Luego usa “Remote-SSH: Connect to Host…” → “PSI” para editar código directamente en el servidor.
* **Ambientes**: Se sugiere usar archivos `environment.ts` para cambiar entre:

  ```ts
  // local development
  apiUrl: 'http://localhost:3000'
  // servidor de la Facultad
  apiUrl: 'http://appserver.alunos.di.fc.ul.pt:3000'
  ```
* **Build y optimización**:

  * Cuando hagas `ng build --configuration production`, revisa el directorio `dist/` y mueve todo a `backend/public`.
  * Ajusta presupuestos (budgets) en `angular.json` si las advertencias por tamaño (CSS, JS) te molestan, o bien comprime CSS/JS.

---

### Resumen de Pasos Clave

1. **Clona** el repositorio en tu local / servidor.
2. **Backend**:

   ```bash
   cd backend
   npm install
   export MONGO_URI="mongodb://PSI046:PSI046@localhost:27017/PSI046?retryWrites=true&authSource=PSI046"
   npm start
   ```

   * Comprueba `http://localhost:3000/conductor` → `[]` o lista vacía.
3. **Frontend (Desarrollo Local)**:

   ```bash
   cd frontend
   npm install
   ng serve --host 0.0.0.0 --port 4200
   ```

   * Asegura `environment.apiUrl = 'http://localhost:3000'`.
   * Navega a `http://localhost:4200` → Interfaz interactiva.
4. **Frontend (Servidor Facultad)**:

   ```bash
   cd ~/PSIServer/frontend
   npm install
   npx ng serve --host 0.0.0.0 --port 3046 --allowed-hosts all
   ```

   * `environment.apiUrl = 'http://appserver.alunos.di.fc.ul.pt:3000'`
   * Navega a `http://appserver.alunos.di.fc.ul.pt:3046`.
5. **Producción Unificada**:

   ```bash
   cd frontend
   ng build --configuration production --output-path=../backend/public
   cd ../backend
   npm start
   ```

   * Accede todo por `http://appserver.alunos.di.fc.ul.pt:3000`.
