# Green Bunny Store – Panel Administrador

Sistema web para la gestión administrativa de una tienda virtual.
Incluye backend con Spring Boot (API REST y base de datos MySQL) y frontend con React (panel administrativo con autenticación simple, módulos de usuarios y productos).

## Tecnologías
- Backend: Spring Boot 3.5.6, Spring Data JPA, MySQL, Spring Validation, Spring Security Crypto (BCrypt), Springdoc OpenAPI/Swagger
- Frontend: React 19, Vite 7, React Router DOM 7, Axios, Bootstrap 5, Bootstrap Icons
- Node: >= 18
- Java: >= 17
- Base de datos: MySQL 8

## Arquitectura
- Capas separadas en backend: controllers (API), services (lógica), repositories (persistencia), entities (modelo), config (Swagger, CORS)
- Frontend con componentes por página y módulos: Dashboard, Usuarios, Inventario, Login, layout admin y navegación
- Integración vía API REST a `http://localhost:8080`

## Estructura del Proyecto
```
Proyecto-Fullstack2-React/
├── Proyecto2Fullstack/           # Backend Spring Boot
│   ├── src/main/java/com/tiendavirtual/projectbackend/
│   │   ├── controllers/          # REST Controllers
│   │   ├── services/             # Lógica de negocio
│   │   ├── repositories/         # Persistencia/JPA
│   │   ├── entities/             # Modelos/Entidades JPA
│   │   ├── config/               # OpenAPI/Swagger, WebConfig
│   │   └── exceptions/           # Manejo global de errores
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── data.sql              # Poblamiento inicial
│   └── pom.xml
├── frontend/                     # Frontend React
│   ├── src/pages/                # Dashboard, Inventario, Usuarios, Login
│   ├── src/componentes/Admin/    # AdminLayout, Navbar, Sidebar
│   ├── src/services/             # api.js, productos.js, usuarios.js, categorias.js, auth.js
│   ├── public/img                # Assets públicos
│   └── index.html                # Documento base Vite
└── uploads/                      # Imágenes de productos servidas por backend
```

## Requisitos Previos
- Instalar Java 17, Maven, Node.js (>=18), MySQL 8
- Crear la base de datos en MySQL:
  - Nombre: `tienda_virtual`
  - Usuario: `usuario_proyecto`
  - Contraseña: `1234`

## Configuración Backend
Archivo `Proyecto2Fullstack/src/main/resources/application.properties` (ya configurado):
- `spring.datasource.url=jdbc:mysql://localhost:3306/tienda_virtual?serverTimezone=UTC&useSSL=false`
- `spring.datasource.username=usuario_proyecto`
- `spring.datasource.password=1234`
- `spring.jpa.hibernate.ddl-auto=update`
- `springdoc.swagger-ui.path=/swagger-ui.html`
- `app.uploads.dir=${user.dir}/uploads` (directorio de imágenes)

Directorio de imágenes del backend:
- Usa `uploads/` en la raíz del repositorio; contiene imágenes referenciadas en `data.sql`.

CORS:
- Habilitado para `http://localhost:5173` (y puertos alternativos) en controladores donde aplica.

## Poblamiento de Datos
Script: `Proyecto2Fullstack/src/main/resources/data.sql`.
Incluye:
- Categorías: Hombre, Mujer, Niños, Accesorios
- 15 productos con rutas de imagen a `/uploads/...`
- 1 usuario administrador por defecto: `admin@duocuc.cl` (password `admin123`)

Cómo cargar datos:
- Opción A: importar `data.sql` manualmente en MySQL.
- Opción B: habilitar ejecución automática en desarrollo cambiando `spring.sql.init.mode=always` (si la BD está vacía).

## Ejecución Backend
En `Proyecto2Fullstack/`:
- `mvn spring-boot:run`
- Servidor: `http://localhost:8080`

Swagger UI:
- `http://localhost:8080/swagger-ui.html`

Verificación rápida:
- `mvn test` ejecuta pruebas unitarias con Mockito.
- Al iniciar, se imprime `BCrypt(123456)=...` en consola (validación del encoder).

## Ejecución Frontend
En `frontend/`:
- `npm install`
- `npm run dev`
- Servidor: `http://localhost:5173/` (o puerto alternativo si está ocupado)

Configuración de API:
- Base en `src/services/api.js`: `http://localhost:8080`
- Assets públicos servidos desde raíz (`/img/logo3.png`, favicon, etc.).

## Autenticación y Sesión
- Login simple sin JWT.
- Sesión en `localStorage` bajo la clave `usuarioLogueado`.
- Rutas protegidas con `ProtectedRoute`.
- Redirección a `/dashboard` después del login.
- Logout limpia sesión y redirige a `/login`.

## Credenciales de Prueba
- Admin por defecto:
  - Email: `admin@duocuc.cl`
  - Contraseña: `admin123`
  - Rol: `SUPER_ADMIN`

## Módulos y Funcionalidades (Frontend)
- Dashboard
  - Estadísticas de productos, usuarios y stock bajo.
  - Accesos rápidos a Inventario y Usuarios.
- Usuarios
  - Lista responsive.
  - Crear/Editar/Eliminar/Cambio de estado con confirmación.
  - Validación de formularios en tiempo real (email, requeridos, longitudes).
  - Búsqueda/filtrado por nombre.
- Inventario/Productos
  - Lista con imágenes.
  - Crear con subida de imagen (vía backend).
  - Editar/Eliminar/Cambio de estado con confirmación.
  - Filtros: nombre y categoría.
  - Alerta de stock bajo (<5) reflejada en el dashboard.

## API REST (Backend)
- Autenticación
  - `POST /api/auth/login` → Login simple (email, password)
- Productos (`/api/productos`)
  - `GET /api/productos` → Listado con filtros opcionales (`nombre`, `categoriaId`)
  - `GET /api/productos/{id}` → Obtener por ID
  - `POST /api/productos` → Crear producto
  - `PUT /api/productos/{id}` → Actualizar producto
  - `DELETE /api/productos/{id}` → Eliminar/inhabilitar
  - `PATCH /api/productos/{id}/stock` → Actualizar stock
  - `POST /api/productos/upload` → Subir imagen (usa `app.uploads.dir`)
- Usuarios (`/api/usuarios`)
  - `GET /api/usuarios` → Listado
  - `GET /api/usuarios/{id}` → Obtener por ID
  - `POST /api/usuarios` → Crear usuario
  - `PUT /api/usuarios/{id}` → Actualizar usuario
  - `DELETE /api/usuarios/{id}` → Eliminar/Cambiar estado
- Categorías (`/api/categorias`)
  - `GET /api/categorias` → Listado
  - `GET /api/categorias/{id}` → Obtener por ID

La documentación detallada está disponible en Swagger (`/swagger-ui.html`).

## Testing
- Backend: `mvn test` ejecuta pruebas unitarias. Mockito configurado para `ProductoServices` y `UsersService`.
- Frontend: No se incluye suite de tests; validar manualmente en navegador.

## Manejo de Errores
- Backend: `GlobalExceptionHandler` + respuestas HTTP estandarizadas.
- Frontend: Interceptor de Axios convierte respuestas de error en mensajes claros.
- UI: `ToastProvider` muestra mensajes de éxito/error.

## GitHub y Entrega
- Repositorio con estructura clara.
- `.gitignore` recomendado en la raíz para cubrir backend y frontend (además del existente en `frontend/`).
- README (este documento) debe estar en la raíz del repositorio.
- Scripts BD: `src/main/resources/data.sql` incluido.
- Presentación: demostrar módulos, arquitectura y endpoints vía Swagger.

## Bonificaciones sugeridas
- Paginación en listados (productos y usuarios).
- Filtros avanzados: rango de precio, estado, stock.
- Librerías útiles (por ejemplo, `react-hook-form` para validaciones avanzadas).

## Guía Rápida
- Backend:
  - Crear DB `tienda_virtual` en MySQL.
  - Verificar credenciales en `application.properties`.
  - `mvn spring-boot:run` y abrir `http://localhost:8080/swagger-ui.html`.
- Frontend:
  - `npm install` → `npm run dev` → abrir `http://localhost:5173/`.
- Probar login:
  - Email: `admin@duocuc.cl`
  - Password: `admin123`