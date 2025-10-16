# Eureka Project UI - Frontend Angular

Aplicación web moderna desarrollada con Angular 20 para la gestión visual de candidatos y sus documentos adjuntos, implementando las últimas características de Angular como Signals, Computed Properties y Control Flow Syntax.

## Descripción

Este proyecto implementa una interfaz de usuario completa que se conecta con la API de microservicios del backend, proporcionando:

### **Características Principales**
- **Dashboard de Candidatos**: Visualización paginada de todos los candidatos con información detallada
- **Gestión de Documentos**: Visualización de archivos adjuntos por candidato
- **Diseño Responsive**: Optimizado para dispositivos móviles, tablets y desktop
- **Arquitectura Moderna**: Implementación de Angular Signals para estado reactivo
- **UI/UX Moderna**: Diseño atractivo con Tailwind CSS y DaisyUI

### **Páginas**
- **Inicio**: Landing page con información del sistema
- **Candidatos**: Vista principal con tabla paginada, detalles expandibles y gestión de adjuntos
- **Nosotros**: Información sobre el proyecto y tecnologías utilizadas

## Tecnologías Utilizadas

### Stack Principal
- **Angular 20.3.0** - Framework principal
- **TypeScript 5.9.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva
- **Tailwind CSS 4.1.14** - Framework de CSS utility-first
- **DaisyUI 5.3.1** - Componentes UI para Tailwind
- **PostCSS 8.5.6** - Procesador de CSS

### Herramientas de Desarrollo
- **Angular CLI 20.3.5**

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│                   Usuario / Browser                      │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  Angular App    │
                │ (Port 4200)     │
                │                 │
                │  ┌───────────┐  │
                │  │  Navbar   │  │
                │  └───────────┘  │
                │                 │
                │  ┌───────────┐  │
                │  │ Routing   │  │
                │  └─────┬─────┘  │
                │        │        │
                │  ┌─────┴─────┐  │
                │  │   Pages   │  │
                │  │           │  │
                │  │  Inicio   │  │
                │  │Candidatos │  │
                │  │ Nosotros  │  │
                │  └───────────┘  │
                │                 │
                │  ┌───────────┐  │
                │  │ Services  │  │
                │  └─────┬─────┘  │
                └────────┼─────────┘
                         │ HTTP
                         ▼
                ┌─────────────────┐
                │  API Gateway    │
                │  (Port 8090)    │
                └─────────────────┘
```

## Estructura del Proyecto

```
ek-project-ui/
├── src/
│   ├── app/
│   │   ├── core/                      # Funcionalidad central
│   │   │   └── services/
│   │   │       └── adjunto.service.ts # Servicio API
│   │   │
│   │   ├── pages/                     # Páginas/Vistas
│   │   │   ├── inicio/
│   │   │   │   ├── inicio.component.ts
│   │   │   │   └── inicio.component.html
│   │   │   │
│   │   │   ├── candidatos/            # Vista principal
│   │   │   │   ├── candidatos.component.ts
│   │   │   │   └── candidatos.component.html
│   │   │   │
│   │   │   └── nosotros/
│   │   │       ├── nosotros.component.ts
│   │   │       └── nosotros.component.html
│   │   │
│   │   ├── shared/                    # Componentes compartidos
│   │   │   ├── components/
│   │   │   │   └── navbar/
│   │   │   │       ├── navbar.component.ts
│   │   │   │       └── navbar.component.html
│   │   │   │
│   │   │   └── models/               # Interfaces TypeScript
│   │   │       ├── candidato.model.ts
│   │   │       ├── candidato-view.model.ts
│   │   │       └── adjunto.model.ts
│   │   │
│   │   ├── app.ts                    # Componente raíz
│   │   ├── app.html                  # Template raíz
│   │   ├── app.config.ts             # Configuración app
│   │   └── app.routes.ts             # Configuración rutas
│   │
│   ├── environments/                  # Variables de entorno
│   │   ├── environment.ts            # Producción
│   │   └── environment.development.ts # Desarrollo
│   │
│   ├── styles.css                    # Estilos globales
│   ├── main.ts                       # Punto de entrada
│   └── index.html                    # HTML principal
│
├── public/                           # Assets estáticos
│   └── images/
│
├── angular.json                      # Configuración Angular CLI
├── package.json                      # Dependencias npm
├── tsconfig.json                     # Configuración TypeScript
├── tailwind.config.js               # Configuración Tailwind (generado)
└── README.md                        # Este archivo
```

## Requisitos Previos

- **Node.js** 18.x o superior
- **npm** 9.x o superior
- **Angular CLI** 20.x (se instalará automáticamente)
- **API Backend** ejecutándose en `http://localhost:8090` (ver [backend README](https://github.com/MlecarosC/ek-project))

## Instalación y Configuración

### 1. Clonar el Repositorio

```bash
git clone https://github.com/MlecarosC/ek-project-ui.git
cd ek-project-ui
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

El proyecto usa diferentes configuraciones para desarrollo y producción.

**Desarrollo** (`src/environments/environment.development.ts`):
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8090/api/v1',
  apiTimeout: 30000,
  enableDebugMode: true,
} as const;
```

**Producción** (`src/environments/environment.ts`):
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.tu-dominio.com/api/v1',  // ← Cambiar aquí
  apiTimeout: 30000,
  enableDebugMode: false,
} as const;
```

### 4. Iniciar la Aplicación

**Modo desarrollo:**
```bash
npm start
# o
ng serve
```

La aplicación estará disponible en: **http://localhost:4200**

**Modo producción (build):**
```bash
npm run build
# o
ng build
```

Los archivos compilados estarán en `dist/ek-project-ui/`

## Funcionalidades Principales

### 1. Vista de Candidatos

**Características:**
- ✅ **Tabla paginada** con 5 candidatos por página
- ✅ **Detalles expandibles** por candidato
- ✅ **Información completa** de cada candidato
- ✅ **Listado de documentos adjuntos** con iconos según tipo
- ✅ **Persistencia de página** en localStorage
- ✅ **Avatares únicos** por candidato (aleatorios pero persistentes)
- ✅ **Responsive design** adaptado a móvil y desktop

### 2. Navegación

**Rutas disponibles:**
- `/` → Redirige a `/inicio`
- `/inicio` → Página de bienvenida
- `/candidatos` → Vista principal con tabla de candidatos
- `/nosotros` → Información del proyecto
- `/**` → Cualquier ruta no existente redirige a `/inicio`

**Navbar responsive:**
- Desktop: Menú horizontal
- Mobile: Menú hamburguesa con overlay

### 3. Gestión de Estado

**localStorage:**
- Página actual de la tabla
- Avatares asignados a cada candidato

## Integración con el Backend

### Configuración del Servicio

**AdjuntoService** (`src/app/core/services/adjunto.service.ts`):
```typescript
@Injectable({ providedIn: 'root' })
export class AdjuntoService {
  private readonly apiUrl = `${environment.apiBaseUrl}/adjuntos`;
  
  constructor(private http: HttpClient) { }

  getAllCandidatosConAdjuntos(): Observable<ResponseAdjunto[]> {
    return this.http.get<ResponseAdjunto[]>(this.apiUrl);
  }
}
```

### Endpoints Consumidos

```
GET http://localhost:8090/api/v1/adjuntos
```

**Response esperado:**
```json
[
  {
    "candidato": {
      "id": 1,
      "nombre": "Juan",
      "apellidos": "Pérez",
      "email": "juan.perez@example.com",
      "telefono": "+56912345678",
      "tipoDocumento": "RUT",
      "numeroDocumento": "12.345.678-9",
      "genero": "M",
      "lugarNacimiento": "Santiago, Chile",
      "fechaNacimiento": "1990-05-20",
      "direccion": "Calle Falsa 123",
      "codigoPostal": "8320000",
      "pais": "Chile",
      "localizacion": "Santiago, Chile",
      "disponibilidadDesde": "2025-01-01",
      "disponibilidadHasta": "2025-12-31"
    },
    "adjuntos": [
      {
        "id": 1,
        "extension": "pdf",
        "nombreArchivo": "cv_juan_perez.pdf"
      },
      {
        "id": 2,
        "extension": "jpg",
        "nombreArchivo": "photo_juan_perez.jpg"
      }
    ]
  }
]
```

## Configuración de CORS

**Importante:** El backend debe permitir solicitudes desde el origen del frontend.

En el **docker-compose.yml** (`gateway-server`), configurar:
mediante variable de entorno:
```bash
CORS_ALLOWED_ORIGINS=http://localhost:4200
```

## Guía de Estilos

### Tailwind CSS + DaisyUI

**Componentes utilizados:**
```html
<!-- Botones -->
<button class="btn btn-primary">Click</button>

<!-- Alerts -->
<div class="alert alert-error">Error message</div>

<!-- Loading -->
<span class="loading loading-spinner"></span>

<!-- Cards -->
<div class="card bg-base-100 shadow-xl">...</div>

<!-- Tablas -->
<table class="table table-zebra">...</table>

<!-- Badges -->
<span class="badge badge-primary">New</span>
```

## Despliegue

### Build Estático

```bash
# 1. Build de producción
npm run build

# 2. Los archivos estarán en dist/ek-project-ui/browser/
# 3. Servir con cualquier servidor web:
#    - Nginx
#    - Apache
#    - AWS S3 + CloudFront
#    - Vercel
#    - Netlify
```

## Estructura de Datos

### Modelos TypeScript

**Candidato** (`src/app/shared/models/candidato.model.ts`):
```typescript
export interface Candidato {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  tipoDocumento: string;
  numeroDocumento: string;
  genero: string;
  lugarNacimiento: string;
  fechaNacimiento: string;
  direccion: string;
  codigoPostal: string;
  pais: string;
  localizacion: string;
  disponibilidadDesde: string;
  disponibilidadHasta: string;
}
```

**Adjunto** (`src/app/shared/models/adjunto.model.ts`):
```typescript
export interface Adjunto {
  id: number;
  extension: string;
  nombreArchivo: string;
}

export interface ResponseAdjunto {
  candidato: Candidato;
  adjuntos: Adjunto[];
}
```

**CandidatoView** (`src/app/shared/models/candidato-view.model.ts`):
```typescript
export interface CandidatoView extends Candidato {
  avatarUrl: string;      // URL del avatar (generado en frontend)
  adjuntos: Adjunto[];    // Lista de documentos adjuntos
}
```

## Troubleshooting

### Error: CORS policy

**Problema:**
```
Access to XMLHttpRequest at 'http://localhost:8090/api/v1/adjuntos' 
from origin 'http://localhost:4200' has been blocked by CORS policy
```

**Solución:**
Configurar CORS en el API Gateway (ver sección "Configuración de CORS")

### Error: Module not found

**Problema:**
```
Error: Module not found: Error: Can't resolve 'src/environments/environment'
```

**Solución:**
Verificar que existan los archivos:
- `src/environments/environment.ts`
- `src/environments/environment.development.ts`

## Recursos Adicionales

- **Angular Docs**: https://angular.dev
- **Tailwind CSS**: https://tailwindcss.com
- **DaisyUI**: https://daisyui.com
- **Angular Signals**: https://angular.dev/guide/signals
- **RxJS**: https://rxjs.dev

## Licencia

Este proyecto es parte del programa Eureka 2025 y está desarrollado con fines educativos.

## Autor

**Desarrollador**: Martin Lecaros  
**Programa**: Eureka 2025 - Desarrollador Full Stack  

---

**Nota:** Este frontend está diseñado para trabajar en conjunto con el [backend de microservicios](https://github.com/MlecarosC/ek-project). Asegúrate de tener el backend ejecutándose antes de iniciar el frontend.
