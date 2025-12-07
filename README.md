# OrderWorder – Sistema de Pedidos Contactless para Restaurantes

[![Live](https://img.shields.io/badge/Built_using-XtremeUI-blue?style=flat-square)](https://github.com/itzzritik/XtremeUI)
[![Live Demo](https://img.shields.io/badge/Try_Live-Demo-green?style=flat-square)](https://orderworder.ritik.me)
![Made with ❤️](https://img.shields.io/badge/Made_with-%E2%9D%A4-red?style=flat-square)
[![Next JS](https://img.shields.io/badge/Next-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat-square&logo=sass&logoColor=white)](https://sass-lang.com/)

![OrderWorder Banner](public/screenshots/restaurant_banner.jpg)

---

## 🚀 Vista General  
OrderWorder es una plataforma full-stack de comedor sin contacto diseñada para digitalizar las operaciones de restaurantes. Desde escanear un código QR hasta realizar un pedido y gestionar los flujos de trabajo de la cocina, todo funciona en una aplicación web moderna y limpia construida con **Next.js**, **MongoDB** y **SCSS**.

---

## ✨ Características  
- 📱 **Acceso Basado en Código QR**: Cada mesa obtiene un código QR único para acceso instantáneo al menú
- 🍽️ **Pedidos Inteligentes**: Los clientes pueden navegar menús, agregar artículos y realizar pedidos, sin necesidad de descargar una aplicación
- 🧑‍🍳 **Dashboard de Cocina en Vivo**: Actualizaciones de pedidos en tiempo real para que los chefs preparen eficientemente
- 🧑‍💼 **Panel de Administración**: Gestiona mesas, pedidos, inventario, nómina y más
- ⚡ **UI en Tiempo Real**: Rápida, responsiva y optimizada para móvil/tablet/escritorio
- 🌗 **Soporte de Tema Oscuro**: Diseño moderno con animación y transiciones suaves

---

## 🛠️ Stack Tecnológico  
- **Frontend**: React + Next.js 15.3.3
- **Estilos**: SCSS (SASS)
- **Backend**: API Routes en Next.js
- **Base de Datos**: MongoDB con Mongoose
- **Hosting**: Vercel
- **Autenticación**: NextAuth.js
- **Gestión de Estado**: React Context
- **UI Components**: XtremeUI
- **Generación de PDF**: @react-pdf/renderer
- **Escáner QR**: @zxing/browser

---

## 📁 Estructura del Proyecto

```
OrderWorder/
├── .vscode/                    # Configuración de Visual Studio Code
├── public/                     # Archivos estáticos públicos
│   ├── backgrounds/           # Imágenes de fondo
│   └── screenshots/           # Capturas de pantalla del proyecto
├── src/                       # Código fuente principal
│   ├── app/                   # Directorio de aplicación Next.js (App Router)
│   │   ├── [restaurant]/      # Ruta dinámica para menú del restaurante
│   │   ├── _homepage/         # Componentes de la página principal
│   │   ├── api/              # Rutas de API del backend
│   │   ├── dashboard/         # Panel de administración
│   │   ├── kitchen/          # Dashboard de cocina
│   │   ├── logout/           # Página de cierre de sesión
│   │   ├── globals.scss      # Estilos globales
│   │   ├── home.scss         # Estilos de la homepage
│   │   ├── layout.tsx        # Layout principal de la aplicación
│   │   └── page.tsx          # Página principal (Homepage)
│   ├── components/            # Componentes reutilizables
│   │   ├── base/             # Componentes base (botones, inputs, etc.)
│   │   ├── context/          # Contextos de React
│   │   └── layout/           # Componentes de layout
│   ├── types/                # Definiciones de tipos TypeScript
│   └── utils/                # Utilidades y helpers
│       ├── constants/        # Constantes de la aplicación
│       ├── database/         # Modelos y conexión a MongoDB
│       ├── helper/           # Funciones auxiliares
│       ├── hooks/            # Custom React Hooks
│       └── styles/           # Utilidades de estilos
├── .env.local                 # Variables de entorno locales
├── .gitignore                # Archivos ignorados por Git
├── .nvmrc                    # Versión de Node.js
├── .stylelintrc              # Configuración de Stylelint
├── eslint.config.mjs         # Configuración de ESLint
├── next.config.js            # Configuración de Next.js
├── package.json              # Dependencias del proyecto
├── pnpm-lock.yaml            # Lock file de pnpm
├── tsconfig.json             # Configuración de TypeScript
└── README.md                 # Este archivo
```

---

## 📄 Descripción de Rutas y Funcionalidades

### 🌐 Rutas de Páginas (`src/app/`)

#### **/** - Homepage
- **Archivo**: `src/app/page.tsx`
- **Descripción**: Página de inicio del proyecto con información del sistema
- **Secciones**:
  - `LandingSection`: Sección principal de bienvenida
  - `AboutSection`: Información sobre el proyecto
  - `FeatureSection`: Características destacadas  
  - `LoginSection`: Formulario de inicio de sesión para administradores
  - `FooterSection`: Pie de página
  - `Navbar`: Barra de navegación superior

#### **/[restaurant]** - Menú del Restaurante (Ruta Dinámica)
- **Archivo**: `src/app/[restaurant]/page.tsx`
- **Descripción**: Página del menú visible para los clientes
- **Funcionalidad**:
  - Muestra el menú completo del restaurante
  - Permite agregar items al carrito
  - Lectura de parámetro `table` desde la URL
  - Interfaz optimizada para móviles
  - Acceso mediante código QR único por mesa

#### **/dashboard** - Panel de Administración
- **Archivo**: `src/app/dashboard/page.tsx`
- **Descripción**: Dashboard completo para gestión del restaurante
- **Pestañas Principales**:
  - **Orders**: Gestión de pedidos
    - `requests`: Pedidos pendientes
    - `active`: Pedidos en preparación
    - `history`: Historial de pedidos
  - **Settings**: Configuración del restaurante
    - `profile`: Perfil del restaurante
    - `menu`: Gestión de menú (agregar/editar items)
    - `tables`: Gestión de mesas
    - `staff`: Gestión de personal
- **Acceso**: Requiere autenticación de administrador

#### **/logout** - Cierre de Sesión
- **Archivo**: `src/app/logout/page.tsx`
- **Descripción**: Maneja el proceso de cierre de sesión
- **Funcionalidad**:
  - Limpia la sesión del usuario
  - Redirige a la página principal

---

### 🔌 Rutas de API (`src/app/api/`)

#### **GET /api/admin**
- **Archivo**: `src/app/api/admin/route.ts`
- **Descripción**: Obtiene información completa del perfil del administrador
- **Respuesta**:
  - `profile`: Información del restaurante
  - `menus`: Lista de menús disponibles
  - `tables`: Lista de mesas configuradas
- **Autenticación**: Requerida (NextAuth)

#### **POST /api/auth/[...nextauth]**
- **Directorio**: `src/app/api/auth/`
- **Descripción**: Maneja la autenticación con NextAuth.js
- **Funcionalidad**:
  - Login/Logout
  - Gestión de sesiones
  - Callbacks de autenticación

#### **GET/POST /api/baseProfile**
- **Archivo**: `src/app/api/baseProfile/route.ts`
- **Descripción**: CRUD del perfil base del restaurante
- **Funcionalidad**:
  - Obtener información del restaurante
  - Actualizar datos del perfil
  - Configuración general

#### **GET /api/debug**
- **Archivo**: `src/app/api/debug/route.ts`
- **Descripción**: Endpoint para debugging y diagnóstico
- **Uso**: Solo en desarrollo

#### **GET/POST/PUT/DELETE /api/menu**
- **Archivo**: `src/app/api/menu/route.ts`
- **Descripción**: Gestión completa del menú
- **Operaciones**:
  - `GET`: Obtener items del menú
  - `POST`: Crear nuevo item
  - `PUT`: Actualizar item existente
  - `DELETE`: Eliminar item
- **Datos**:
  - Nombre del producto
  - Descripción
  - Precio
  - Categoría
  - Disponibilidad
  - Imagen

#### **GET/POST/PUT /api/order**
- **Archivo**: `src/app/api/order/route.ts`
- **Descripción**: Gestión de pedidos
- **Operaciones**:
  - `GET`: Obtener pedidos (activos/históricos)
  - `POST`: Crear nuevo pedido
  - `PUT`: Actualizar estado del pedido
- **Estados de Pedido**:
  - `pending`: Pendiente
  - `preparing`: En preparación
  - `ready`: Listo para servir
  - `delivered`: Entregado
  - `cancelled`: Cancelado

#### **POST /api/refreshDemoData**
- **Archivo**: `src/app/api/refreshDemoData/route.ts`
- **Descripción**: Reinicia los datos de demostración
- **Funcionalidad**:
  - Limpia la base de datos
  - Carga datos de ejemplo
  - Útil para pruebas y demos

#### **POST /api/register**
- **Archivo**: `src/app/api/register/route.ts`
- **Descripción**: Registro de nuevos restaurantes/administradores
- **Datos Requeridos**:
  - Email
  - Password (encriptado con bcrypt)
  - Información del restaurante
  - Configuración inicial

---

### 🧩 Componentes Principales (`src/components/`)

#### **Base Components** (`src/components/base/`)
- Componentes UI reutilizables
- Botones, inputs, modales, etc.
- Estilizados con SCSS y XtremeUI

#### **Context Providers** (`src/components/context/`)
- `DashboardProvider`: Estado global del dashboard
- `AuthContext`: Manejo de autenticación
- `OrderContext`: Estado de pedidos
- `MenuContext`: Estado del menú
- `CartContext`: Carrito de compras

#### **Layout Components** (`src/components/layout/`)
- `NavSideBar`: Barra lateral de navegación
- `Header`: Encabezado de la aplicación
- `Footer`: Pie de página
- Componentes de layout reutilizables

---

### 🗄️ Base de Datos (`src/utils/database/`)

#### **Modelos de MongoDB**

**Account (Cuenta)**
```typescript
{
  username: string,        // Email del administrador
  password: string,        // Hash de contraseña
  profile: ObjectId,       // Referencia a Profile
  tables: ObjectId[],      // Referencias a Table
  menus: ObjectId[]        // Referencias a Menu
}
```

**Profile (Perfil del Restaurante)**
```typescript
{
  name: string,           // Nombre del restaurante
  description: string,    // Descripción
  logo: string,          // URL del logo
  themeColor: string,    // Color del tema
  address: string,       // Dirección
  phone: string          // Teléfono
}
```

**Menu (Menú)**
```typescript
{
  name: string,          // Nombre del producto
  description: string,   // Descripción
  price: number,        // Precio
  category: string,     // Categoría
  image: string,        // URL de imagen
  available: boolean    // Disponibilidad
}
```

**Table (Mesa)**
```typescript
{
  number: number,       // Número de mesa
  qrCode: string,       // Código QR único
  capacity: number,     // Capacidad de personas
  status: string        // Estado (occupied/available)
}
```

**Order (Pedido)**
```typescript
{
  table: ObjectId,        // Referencia a Table
  items: [{
    menu: ObjectId,       // Referencia a Menu
    quantity: number,     // Cantidad
    notes: string         // Notas especiales
  }],
  customer: {
    name: string,         // Nombre del cliente
    phone: string         // Teléfono
  },
  status: string,         // Estado del pedido
  total: number,          // Total
  createdAt: Date,        // Fecha de creación
  updatedAt: Date         // Última actualización
}
```

---

## 🛠️ Utilidades (`src/utils/`)

### **Constants** (`src/utils/constants/`)
- Constantes globales de la aplicación
- Colores por defecto
- Configuraciones estáticas

### **Helpers** (`src/utils/helper/`)
- `authHelper.ts`: Configuración de NextAuth
- `common.ts`: Funciones utilitarias comunes
- Validadores y formateadores

### **Hooks** (`src/utils/hooks/`)
- Custom React Hooks
- Hooks para fetching de datos
- Hooks de UI

### **Styles** (`src/utils/styles/`)
- Utilidades de estilos SCSS
- Mixins y variables
- Temas y colores

---

## 🚀 Instalación y Uso

### Prerrequisitos
- Node.js (ver versión en `.nvmrc`)
- pnpm (gestor de paquetes)
- MongoDB (local o Atlas)

### Variables de Entorno (.env.local)
```env
MONGODB_URI=tu_uri_de_mongodb
NEXTAUTH_SECRET=tu_secret_key
NEXTAUTH_URL=http://localhost:3000
```

### Comandos Disponibles

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Construir para producción
pnpm build

# Iniciar en producción
pnpm start

# Ejecutar linter
pnpm lint

# Limpiar e reinstalar dependencias
pnpm clean
```

---

## 🔍 Flujo de Trabajo

### Para Clientes:
1. Escanear código QR de la mesa
2. Abrir menú del restaurante
3. Seleccionar items y agregar al carrito
4. Ingresar nombre y teléfono
5. Confirmar pedido
6. Recibir notificación cuando esté listo

### Para Administradores:
1. Login en `/` (sección de login)
2. Acceder a `/dashboard`
3. Gestionar pedidos en tiempo real
4. Configurar menú, mesas y personal
5. Ver estadísticas y reportes

### Para Cocina:
1. Login con credenciales de cocina
2. Acceder a `/kitchen`
3. Ver pedidos en tiempo real
4. Actualizar estado de preparación
5. Marcar como listo para servir

---

## 📱 Acceso de Prueba

### 🧑 Cliente:
- URL: `https://orderworder.ritik.me/starbucks?table=1`
- O escanear el código QR
- Ingresar nombre y teléfono (10 dígitos)

### 👨‍💼 Administrador:
- URL: `https://orderworder.ritik.me`
- Email: `admin@starbucks.com`
- Password: `starbucks@123`
- Dashboard: `https://orderworder.ritik.me/dashboard`
- Cocina: `https://orderworder.ritik.me/kitchen`

---

## 🖼️ Capturas de Pantalla

### 📋 Interfaz del Menú
<p align="center">
  <img src="public/screenshots/restaurant_menu.png" width="49%">
  <img src="public/screenshots/restaurant_cart.png" width="49%">
</p>

### 🛠️ Dashboard de Administración
<p align="center">
  <img src="public/screenshots/dashboard_requests.png" width="49%">
  <img src="public/screenshots/dashboard_active.png" width="49%">
</p>

---

## 📌 Tecnologías y Librerías

### Dependencias Principales
- `next` (15.3.3): Framework React
- `react` (19.1.0): Biblioteca UI
- `mongoose` (8.15.1): ODM para MongoDB
- `next-auth` (4.24.11): Autenticación
- `bcrypt` (6.0.0): Encriptación de contraseñas
- `@react-pdf/renderer` (4.3.0): Generación de PDFs
- `@zxing/browser` (0.1.5): Escáner QR
- `sass` (1.89.2): Preprocesador CSS
- `xtreme-ui` (0.0.121): Componentes UI
- `swr` (2.3.3): Fetching de datos
- `react-toastify` (11.0.5): Notificaciones

### Dependencias de Desarrollo
- `typescript` (5.8.3)
- `eslint` (9.28.0)
- `stylelint` (16.20.0)
- `@types/*`: Tipos TypeScript

---

## 📌 Tags  
`nextjs` `react` `javascript` `typescript` `mongodb` `mongoose` `sass` `scss` `admin-panel` `dashboard` `qr-code` `realtime` `restaurant` `orders` `menu` `contactless` `ecommerce` `responsive` `dark-theme` `ui` `animation` `scanner` `nextauth`

---

## 📝 Notas de Desarrollo

### Estructura de Routing
El proyecto usa **Next.js App Router** (Next.js 13+):
- Rutas de páginas en `src/app/`
- Rutas de API en `src/app/api/`
- Rutas dinámicas con `[parameter]`
- Layouts compartidos con `layout.tsx`

### Convenciones de Código
- Componentes en PascalCase
- Archivos de utilidades en camelCase
- Estilos SCSS modulares
- TypeScript estricto
- ESLint y Stylelint configurados

### Path Aliases
El proyecto usa alias de importación configurados en `tsconfig.json`:
```typescript
import { Component } from '#components/...'
import { helper } from '#utils/...'
```

---

## ⭐ Soporte al Proyecto  
Si encuentras útil OrderWorder, ¡dale una ⭐ en GitHub!  
¿Tienes ideas o mejoras? ¡Las contribuciones vía issues o pull requests son bienvenidas!

---

## 📄 Licencia
Este proyecto es de código abierto y está disponible bajo la licencia especificada en el repositorio.

---

**Desarrollado con ❤️ usando Next.js, MongoDB y SCSS**
