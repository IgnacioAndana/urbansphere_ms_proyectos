# MS Projects — UrbanSphere

Microservicio de **catálogo comercial** de la plataforma **UrbanSphere**. Gestiona proyectos inmobiliarios con tipologías (2D/2B, m², UF), imágenes generales y por tipología, equipamiento común y geolocalización. Publica eventos RabbitMQ al crear proyectos.

| Dato | Valor |
|------|-------|
| Puerto por defecto | `3002` |
| Prefijo API | `/api` |
| Swagger | `/api/docs` |
| Esquema MySQL | `porsusde_urbansphere` (compartido con MS Users y MS AI) |

---

## Roles y permisos

Los roles vienen en el JWT emitido por **MS Users** (`admin`, `agent`, `user`).

| Acción | admin | agent | user |
|--------|:-----:|:-----:|:----:|
| CRUD proyectos, tipologías, equipamiento | ✅ | ✅ | ❌ |
| CRUD imágenes (proyecto y tipología) | ✅ | ✅ | ❌ |
| Consultar proyectos, tipologías, imágenes y equipamiento | ✅ (todos) | ✅ (todos) | ✅ (solo `activo`) |
| Marcar "me interesa" | — | — | ✅ en **MS Users** |

> **"Me interesa"** no vive en este microservicio. Los usuarios normales registran interés en **MS Users** con `POST /api/solicitudes-interes` (tabla `solicitudes_interes`, campo `proyecto_id`).

---

## Requisitos previos

- **Node.js** 20+ (recomendado 22)
- **npm** 10+
- **MySQL** 8.x con el esquema `porsusde_urbansphere`
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
AWS_S3_BUCKET=urbansphere-images

NODE_ENV=development
DB_SYNCHRONIZE=false
DB_LOGGING=false
```

> Usa el **mismo** `JWT_SECRET` que MS Users. Los tokens se obtienen con `POST /api/autenticacion/iniciar-sesion` en MS Users (puerto 3001).

### AWS S3 — bucket y rutas

Bucket: **`urbansphere-images`** (mismo que MS Users para logos en `logos/`).

| Tipo de imagen | Prefijo en S3 | URL pública (ejemplo) |
|----------------|---------------|------------------------|
| Galería del proyecto | `proyectos/{id}/galeria/` | `https://urbansphere-images.s3.us-east-1.amazonaws.com/proyectos/1/galeria/uuid.jpg` |
| Tipología | `proyectos/{id}/tipologias/{tipologiaId}/` | `https://urbansphere-images.s3.us-east-1.amazonaws.com/proyectos/1/tipologias/2/uuid.jpg` |

Al subir archivo con `POST .../imagenes` + multipart, el servicio genera la URL automáticamente. También puedes enviar `urlS3` manualmente si la imagen ya está en el bucket.

Verifica en EC2/local que `.env` tenga `AWS_S3_BUCKET=urbansphere-images` y la región correcta (`AWS_REGION=us-east-1`).

### 3. Base de datos

**Instalación nueva** (BD vacía):

```bash
mysql -u TU_USUARIO -p -h TU_HOST porsusde_urbansphere < database/init-all.sql
```

**BD existente con usuarios:** ejecuta en Navicat, en este orden:

1. `database/migracion-simplificar-proyectos.sql` — si aún tienes el esquema antiguo (propiedades)
2. `database/migracion-ampliar-proyectos.sql` — tipologías, equipamiento, comuna, fecha entrega

**Tablas que usa este microservicio:**

| Tabla | Descripción |
|-------|-------------|
| `proyectos` | Título, dirección, comuna, fecha entrega, geo, descripción |
| `proyecto_imagenes` | Imágenes generales (fachada, ubicación, etc.) |
| `tipologias` | Unidades disponibles: código, dormitorios, baños, m², valor UF |
| `tipologia_imagenes` | Imágenes por tipología |
| `proyecto_equipamiento` | Gimnasio, quincho, piscina, coworking, etc. |

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

Reemplaza `TU_TOKEN_ACCESO` por el token de MS Users (rol `admin` o `agent` para crear/editar).

### Proyectos

#### POST `/api/proyectos` — Crear proyecto (admin, agent)

```bash
curl -X POST http://localhost:3002/api/proyectos \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"titulo\":\"Edificio Vista Parque\",\"direccion\":\"Av. Providencia 1234\",\"comuna\":\"Providencia\",\"fechaEntregaEstimada\":\"2027-06-30\",\"latitud\":-33.4489,\"longitud\":-70.6693,\"descripcion\":\"Proyecto residencial\",\"estado\":\"borrador\"}"
```

#### GET `/api/proyectos` — Listar proyectos

```bash
curl -X GET http://localhost:3002/api/proyectos \
  -H "Authorization: Bearer TU_TOKEN_ACCESO"
```

> Usuarios `user` solo ven proyectos con `estado: activo`.

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

### Imágenes de proyecto

#### POST `/api/proyectos/:proyectoId/imagenes` — Por URL

```bash
curl -X POST http://localhost:3002/api/proyectos/1/imagenes \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"urlS3\":\"https://urbansphere-images.s3.us-east-1.amazonaws.com/proyectos/1/galeria/img.jpg\",\"etiqueta\":\"fachada\",\"esPortada\":true,\"orden\":0}"
```

#### POST `/api/proyectos/:proyectoId/imagenes` — Subir archivo a S3

```bash
curl -X POST http://localhost:3002/api/proyectos/1/imagenes \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -F "archivo=@./foto.jpg" \
  -F "esPortada=true" \
  -F "esPanoramica360=false"
```

#### Imagen panorámica 360°

```bash
curl -X POST http://localhost:3002/api/proyectos/1/imagenes \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -F "archivo=@./panorama.jpg" \
  -F "esPanoramica360=true"
```

### Tipologías

```bash
# Crear tipología 2D/2B 64m²
curl -X POST http://localhost:3002/api/proyectos/1/tipologias \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"codigoTipologia\":\"2D2B-64\",\"dormitorios\":2,\"banos\":2,\"superficieM2\":64,\"valorEnUf\":3200}"

# Listar tipologías
curl -X GET http://localhost:3002/api/proyectos/1/tipologias \
  -H "Authorization: Bearer TU_TOKEN_ACCESO"
```

### Imágenes de tipología

```bash
curl -X POST http://localhost:3002/api/proyectos/1/tipologias/1/imagenes \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -F "archivo=@./planta.jpg" \
  -F "esPortada=true"
```

### Equipamiento

```bash
curl -X PUT http://localhost:3002/api/proyectos/1/equipamiento \
  -H "Authorization: Bearer TU_TOKEN_ACCESO" \
  -H "Content-Type: application/json" \
  -d "{\"gimnasio\":true,\"piscina\":true,\"coworkingRoom\":true,\"areasVerdes\":true}"
```

---

## Endpoints

| Método | Ruta | Descripción | Roles |
|--------|------|-------------|-------|
| POST | `/api/proyectos` | Crear proyecto (+ evento RabbitMQ) | admin, agent |
| GET | `/api/proyectos` | Listar proyectos | admin, agent, user |
| GET | `/api/proyectos/:id` | Obtener proyecto | admin, agent, user |
| PATCH | `/api/proyectos/:id` | Actualizar proyecto | admin, agent |
| DELETE | `/api/proyectos/:id` | Eliminar proyecto | admin, agent |
| POST | `/api/proyectos/:proyectoId/imagenes` | Agregar imagen (URL o archivo) | admin, agent |
| GET | `/api/proyectos/:proyectoId/imagenes` | Listar imágenes | admin, agent, user |
| PATCH | `/api/proyectos/:proyectoId/imagenes/:id` | Actualizar imagen | admin, agent |
| DELETE | `/api/proyectos/:proyectoId/imagenes/:id` | Eliminar imagen | admin, agent |
| POST | `/api/proyectos/:proyectoId/tipologias` | Crear tipología | admin, agent |
| GET | `/api/proyectos/:proyectoId/tipologias` | Listar tipologías | admin, agent, user |
| GET/PATCH/DELETE | `/api/proyectos/:proyectoId/tipologias/:id` | CRUD tipología | admin, agent |
| POST/GET/PATCH/DELETE | `/api/proyectos/:proyectoId/tipologias/:tipologiaId/imagenes` | Imágenes por tipología | ver roles arriba |
| GET/PUT | `/api/proyectos/:proyectoId/equipamiento` | Equipamiento común | GET: todos; PUT: admin, agent |

---

## Arquitectura

```text
Controller → Service → Repository → Entity → MySQL (porsusde_urbansphere)
                              ↓
                    RabbitMQ (project.created)
                              ↓
                           MS AI
```

## Stack

- NestJS + TypeScript
- TypeORM + MySQL
- JWT (validación con tokens de MS Users)
- RabbitMQ (amqplib) — evento `project.created`
- AWS S3 — bucket `urbansphere-images`, rutas `proyectos/{id}/galeria/` y `proyectos/{id}/tipologias/{tipologiaId}/`
- Swagger / OpenAPI
- Jest + Supertest

## Modelo de datos

| Tabla | Columnas principales |
|-------|---------------------|
| `proyectos` | `titulo`, `slug`, `direccion`, `comuna`, `fecha_entrega_estimada`, `latitud`, `longitud`, `descripcion`, `estado` |
| `proyecto_imagenes` | `proyecto_id`, `url_s3`, `etiqueta`, `es_portada`, `es_panoramica_360`, `orden` |
| `tipologias` | `proyecto_id`, `codigo_tipologia`, `dormitorios`, `banos`, `superficie_m2`, `valor_en_uf` |
| `tipologia_imagenes` | `tipologia_id`, `url_s3`, `es_portada`, `es_panoramica_360`, `orden` |
| `proyecto_equipamiento` | `proyecto_id`, `gimnasio`, `quincho`, `areas_verdes`, `bicicletero`, `piscina`, `juegos_infantiles`, `gourmet_lounge`, `coworking_room` |

Estados de proyecto: `borrador`, `activo`, `inactivo`, `archivado`.

## Formato de fechas

| Capa | Formato | Ejemplo |
|------|---------|---------|
| Base de datos MySQL | `DATETIME` → `yyyy-mm-dd HH:mm:ss` | `2025-06-20 14:30:45` |
| Respuestas API | `dd-mm-yyyy HH:mm:ss` | `20-06-2025 14:30:45` |

El interceptor `FormatearFechasInterceptor` aplica el formato automáticamente.

---

## RabbitMQ

Al crear un proyecto se publica:

```json
{
  "event": "project.created",
  "projectId": 10
}
```

Exchange: `urbansphere.events` · Routing key: `project.created`

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
npm run test:cov    # Cobertura
npm run test:e2e    # E2E — requiere .env con BD accesible
```

Para E2E autenticado, define en `.env`:

```env
E2E_JWT_TOKEN=eyJhbGciOiJIUzI1NiIs...
```

(obtenido desde MS Users tras iniciar sesión con rol admin o agent)

---

## Estructura del proyecto

```text
MS_PROYECTOS/
├── database/
│   ├── init-all.sql                        # Esquema completo (instalación nueva)
│   └── migracion-simplificar-proyectos.sql # Migración manual (BD con usuarios)
├── src/
│   ├── config/               # database, jwt, rabbitmq, aws
│   ├── common/               # guards, roles, filters, interceptors
│   ├── messaging/            # productor RabbitMQ
│   ├── modules/
│   │   ├── auth/             # validación JWT
│   │   ├── storage/          # AWS S3
│   │   ├── projects/         # proyectos
│   │   ├── project-images/   # proyecto_imagenes
│   │   ├── typologies/       # tipologias
│   │   ├── typology-images/  # tipologia_imagenes
│   │   └── project-amenities/# proyecto_equipamiento
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
| `403 Forbidden` | Rol insuficiente | CRUD requiere `admin` o `agent` |
| `ECONNREFUSED` MySQL | BD no accesible | Verifica `DB_HOST`, firewall y credenciales |
| `Table doesn't exist` | Migración no ejecutada | Ejecuta `migracion-simplificar-proyectos.sql` en Navicat |
| Evento RabbitMQ no llega | RabbitMQ caído | Verifica `RABBITMQ_URL`; el MS sigue funcionando sin él |
| Error al subir imagen S3 | Credenciales AWS incorrectas | Revisa `AWS_*` o usa `urlS3` en JSON |
| Puerto en uso | Otro proceso en 3002 | Cambia `PORT` en `.env` |

---

## Referencias

- Plantilla del ecosistema: [`MICROSERVICIO_TEMPLATE.md`](./MICROSERVICIO_TEMPLATE.md)
- Script SQL completo: [`database/init-all.sql`](./database/init-all.sql)
- Migración ampliar: [`database/migracion-ampliar-proyectos.sql`](./database/migracion-ampliar-proyectos.sql)
- MS Users (login JWT, solicitudes de interés): `../MS_USUARIOS/README.md`
