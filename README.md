# MS Projects — UrbanSphere

Microservicio de proyectos inmobiliarios de la plataforma **UrbanSphere**. Gestiona proyectos, propiedades, imágenes (S3), características, tours virtuales y publica eventos RabbitMQ al crear propiedades.

| Dato | Valor |
|------|-------|
| Puerto por defecto | `3002` |
| Prefijo API | `/api` |
| Swagger | `/api/docs` |
| Esquema MySQL | `porsusde_urbansphere` (compartido con MS Users y MS AI) |

---

## Requisitos previos

- **Node.js** 20+ (recomendado 22)
- **npm** 10+
- **MySQL** 8.x con el esquema `porsusde_urbansphere` creado y tablas inicializadas
- **JWT** emitido por MS Users (mismo `JWT_SECRET`)
- **RabbitMQ** (opcional; el servicio arranca aunque no esté disponible)
- **AWS S3** (opcional; para subida de imágenes por archivo)

---

## Configuración inicial

### 1. Clonar e instalar dependencias

```bash
cd MS_PROYECTOS
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env
```

Ejemplo de `.env`:

```env
PORT=3002

DB_HOST=207.210.83.165
DB_PORT=3306
DB_NAME=porsusde_urbansphere
DB_USER=tu_usuario
DB_PASSWORD=tu_password

JWT_SECRET=cambia-este-secreto-en-produccion
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

RABBITMQ_URL=amqp://guest:guest@localhost:5672

AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=tu_access_key
AWS_SECRET_ACCESS_KEY=tu_secret_key
AWS_S3_BUCKET=urbansphere

NODE_ENV=development
DB_SYNCHRONIZE=false
DB_LOGGING=false
```

> Usa el **mismo** `JWT_SECRET` que MS Users. Los tokens se obtienen iniciando sesión en MS Users (`POST /api/autenticacion/iniciar-sesion`).

### 3. Base de datos

Ejecuta el script SQL **antes** de levantar el servicio (si aún no lo hiciste con MS Users):

```bash
mysql -u TU_USUARIO -p -h TU_HOST porsusde_urbansphere < database/init-all.sql
```

**Tablas que usa este microservicio:**

| Tabla | Descripción |
|-------|-------------|
| `proyectos` | Proyectos inmobiliarios |
| `propiedades` | Unidades dentro de un proyecto |
| `propiedad_imagenes` | URLs de imágenes en S3 |
| `propiedad_caracteristicas` | Atributos clave-valor de propiedades |
| `tours_virtuales` | Tours virtuales por propiedad |

> También lee `usuarios` (solo validación JWT).

Variables recomendadas:

```env
DB_SYNCHRONIZE=false
DB_LOGGING=false
```

---

## Cómo levantar el servicio

### Desarrollo (con hot-reload)

```bash
npm run start:dev
```

Salida esperada:

```text
MS Proyectos en http://localhost:3002
Swagger: http://localhost:3002/api/docs
```

### Producción

```bash
npm run build
npm run start:prod
```

---

## Verificar que funciona

1. Obtén un JWT desde **MS Users** (puerto 3001):

```bash
curl -X POST http://localhost:3001/api/autenticacion/iniciar-sesion \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"juan@example.com\",\"contrasena\":\"SecurePass123!\"}"
```

2. Abre Swagger: `http://localhost:3002/api/docs`

3. Usa **Authorize** con `Bearer TU_TOKEN_ACCESO`

---

## Ejemplos curl

Base URL: `http://localhost:3002/api`

Reemplaza `TU_TOKEN_ACCESO` por el token de MS Users.

### Proyectos

#### POST `/api/proyectos` — Crear proyecto

```bash
curl -X POST http://localhost:3002/api/proyectos \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"nombre\":\"Residencial Las Palmas\",\"ciudad\":\"Santiago\",\"estado\":\"borrador\"}"
```

#### GET `/api/proyectos` — Listar proyectos

```bash
curl -X GET http://localhost:3002/api/proyectos \
  -H "Authorization: Bearer TU_TOKEN_ACCESO"
```

#### GET `/api/proyectos/:id` — Obtener proyecto

```bash
curl -X GET http://localhost:3002/api/proyectos/1 \
  -H "Authorization: Bearer TU_TOKEN_ACCESO"
```

#### PATCH `/api/proyectos/:id` — Actualizar proyecto

```bash
curl -X PATCH http://localhost:3002/api/proyectos/1 \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"estado\":\"activo\"}"
```

#### DELETE `/api/proyectos/:id` — Eliminar proyecto

```bash
curl -X DELETE http://localhost:3002/api/proyectos/1 \
  -H "Authorization: Bearer TU_TOKEN_ACCESO"
```

### Propiedades

#### POST `/api/propiedades` — Crear propiedad (publica evento `property.created`)

```bash
curl -X POST http://localhost:3002/api/propiedades \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"proyectoId\":1,\"titulo\":\"Depto 3D/2B\",\"precio\":185000000,\"dormitorios\":3,\"banos\":2,\"areaM2\":95.5}"
```

#### GET `/api/propiedades?proyectoId=1` — Listar por proyecto

```bash
curl -X GET "http://localhost:3002/api/propiedades?proyectoId=1" \
  -H "Authorization: Bearer TU_TOKEN_ACCESO"
```

### Imágenes, características y tours

```bash
# Imagen por URL
curl -X POST http://localhost:3002/api/propiedades/1/imagenes \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"urlS3\":\"https://urbansphere.s3.amazonaws.com/properties/1/img.jpg\",\"esPortada\":true}"

# Característica
curl -X POST http://localhost:3002/api/propiedades/1/caracteristicas \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"nombreCaracteristica\":\"Estacionamiento\",\"valorCaracteristica\":\"2 vehículos\"}"

# Tour virtual
curl -X POST http://localhost:3002/api/propiedades/1/tours-virtuales \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"estado\":\"pendiente\"}"
```

---

## Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| POST | `/api/proyectos` | Crear proyecto | JWT |
| GET | `/api/proyectos` | Listar proyectos | JWT |
| GET | `/api/proyectos/:id` | Obtener proyecto | JWT |
| PATCH | `/api/proyectos/:id` | Actualizar proyecto | JWT |
| DELETE | `/api/proyectos/:id` | Eliminar proyecto | JWT |
| POST | `/api/propiedades` | Crear propiedad (+ evento RabbitMQ) | JWT |
| GET | `/api/propiedades` | Listar propiedades | JWT |
| GET | `/api/propiedades?proyectoId=:id` | Filtrar por proyecto | JWT |
| GET | `/api/propiedades/:id` | Obtener propiedad | JWT |
| PATCH | `/api/propiedades/:id` | Actualizar propiedad | JWT |
| DELETE | `/api/propiedades/:id` | Eliminar propiedad | JWT |
| POST | `/api/propiedades/:id/imagenes` | Agregar imagen | JWT |
| GET | `/api/propiedades/:id/imagenes` | Listar imágenes | JWT |
| PATCH | `/api/propiedades/:id/imagenes/:imagenId` | Actualizar imagen | JWT |
| DELETE | `/api/propiedades/:id/imagenes/:imagenId` | Eliminar imagen | JWT |
| POST | `/api/propiedades/:id/caracteristicas` | Agregar característica | JWT |
| GET | `/api/propiedades/:id/caracteristicas` | Listar características | JWT |
| PATCH | `/api/propiedades/:id/caracteristicas/:caractId` | Actualizar característica | JWT |
| DELETE | `/api/propiedades/:id/caracteristicas/:caractId` | Eliminar característica | JWT |
| POST | `/api/propiedades/:id/tours-virtuales` | Crear tour virtual | JWT |
| GET | `/api/propiedades/:id/tours-virtuales` | Listar tours | JWT |
| GET | `/api/tours-virtuales/:id` | Obtener tour | JWT |
| PATCH | `/api/tours-virtuales/:id` | Actualizar tour | JWT |
| DELETE | `/api/tours-virtuales/:id` | Eliminar tour | JWT |

---

## Arquitectura

```text
Controller → Service → Repository → Entity → MySQL (porsusde_urbansphere)
                              ↓
                    RabbitMQ (property.created)
                              ↓
                           MS AI
```

## Stack

- NestJS + TypeScript
- TypeORM + MySQL
- JWT (validación con tokens de MS Users)
- RabbitMQ (amqplib) — evento `property.created`
- AWS S3 — imágenes de propiedades
- Swagger / OpenAPI
- Jest + Supertest

## Modelo de datos (columnas en español)

| Tabla | Columnas principales |
|-------|---------------------|
| `proyectos` | `nombre`, `slug`, `descripcion`, `ciudad`, `direccion`, `estado`, `creado_en`, `actualizado_en` |
| `propiedades` | `proyecto_id`, `titulo`, `descripcion`, `precio`, `dormitorios`, `banos`, `area_m2`, `estado` |
| `propiedad_imagenes` | `propiedad_id`, `url_s3`, `es_portada`, `orden`, `creado_en` |
| `propiedad_caracteristicas` | `propiedad_id`, `nombre_caracteristica`, `valor_caracteristica` |
| `tours_virtuales` | `propiedad_id`, `url_tour`, `estado`, `creado_en` |

## Formato de fechas

| Capa | Formato | Ejemplo |
|------|---------|---------|
| Base de datos MySQL | `DATETIME` → `yyyy-mm-dd HH:mm:ss` | `2025-06-20 14:30:45` |
| Respuestas API | `dd-mm-yyyy HH:mm:ss` | `20-06-2025 14:30:45` |

El interceptor `FormatearFechasInterceptor` aplica el formato automáticamente.

---

## RabbitMQ

Al crear una propiedad se publica:

```json
{
  "event": "property.created",
  "propertyId": 10
}
```

Exchange: `urbansphere.events` · Routing key: `property.created`

Si RabbitMQ no está disponible, el servicio registra un warning y continúa.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run start:dev` | Desarrollo con recarga automática |
| `npm run build` | Compilar a `dist/` |
| `npm run start:prod` | Ejecutar build de producción |
| `npm run test` | Tests unitarios |
| `npm run test:cov` | Tests con cobertura |
| `npm run test:e2e` | Tests E2E (requiere BD + opcional `E2E_JWT_TOKEN`) |
| `npm run lint` | ESLint |

---

## Tests

```bash
npm run test        # Unitarios
npm run test:cov    # Cobertura (controllers, services, repositories ≥ 80%)
npm run test:e2e    # E2E — requiere .env con BD accesible
```

Para E2E autenticado, define en `.env`:

```env
E2E_JWT_TOKEN=eyJhbGciOiJIUzI1NiIs...
```

(obtenido desde MS Users tras iniciar sesión)

---

## Estructura del proyecto

```text
MS_PROYECTOS/
├── database/
│   └── init-all.sql          # Esquema compartido (13 tablas)
├── src/
│   ├── config/               # database, jwt, rabbitmq, aws
│   ├── common/               # guards, filters, interceptors, utils, enums
│   ├── messaging/            # productor RabbitMQ
│   ├── modules/
│   │   ├── auth/             # validación JWT
│   │   ├── storage/          # AWS S3
│   │   ├── projects/         # proyectos
│   │   ├── properties/       # propiedades
│   │   ├── property-images/  # propiedad_imagenes
│   │   ├── property-features/# propiedad_caracteristicas
│   │   └── virtual-tours/    # tours_virtuales
│   ├── app.module.ts
│   └── main.ts
├── test/                     # E2E
└── .env.example
```

---

## Solución de problemas

| Problema | Posible causa | Solución |
|----------|---------------|----------|
| `401 Unauthorized` | Token inválido o `JWT_SECRET` distinto a MS Users | Usa el mismo `JWT_SECRET` y un token reciente |
| `ECONNREFUSED` MySQL | BD no accesible | Verifica `DB_HOST`, firewall y credenciales |
| `Table doesn't exist` | Script SQL no ejecutado | Ejecuta `database/init-all.sql` |
| Evento RabbitMQ no llega | RabbitMQ caído | Verifica `RABBITMQ_URL`; el MS sigue funcionando sin él |
| Error al subir imagen S3 | Credenciales AWS incorrectas | Revisa variables `AWS_*` o usa `urlS3` en JSON |
| Puerto en uso | Otro proceso en 3002 | Cambia `PORT` en `.env` |

---

## Referencias

- Plantilla del ecosistema: [`MICROSERVICIO_TEMPLATE.md`](./MICROSERVICIO_TEMPLATE.md)
- Script SQL compartido: [`database/init-all.sql`](./database/init-all.sql)
- MS Users (login JWT): `../MS_USUARIOS/README.md`
