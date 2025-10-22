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
- **Angular 20.3.6** - Framework principal
- **TypeScript 5.9.2** - Lenguaje de programación
- **RxJS 7.8.0** - Programación reactiva
- **Tailwind CSS 4.1.14** - Framework de CSS utility-first
- **DaisyUI 5.3.1** - Componentes UI para Tailwind
- **PostCSS 8.5.6** - Procesador de CSS

### Herramientas de Desarrollo
- **Angular CLI 20.3.5**
- **Jest 29**
- **@angular-builders/jest**

### Infraestructura
- **Docker** - Contenedorización
- **nginx** - Servidor web para producción
- **Node.js 22+** - Entorno de ejecución

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
│   │   │   │
│   │   │   └── services/              # Servicios de negocio
│   │   │       ├── adjunto.service.ts
│   │   │       ├── adjunto.service.spec.ts
│   │   │       ├── avatar.service.ts
│   │   │       ├── avatar.service.spec.ts
│   │   │       └── storage.service.ts
│   │   │       └── storage.service.spec.ts
│   │   │
│   │   ├── pages/                     # Páginas/Vistas
│   │   │   ├── inicio/
│   │   │   │   ├── inicio.component.ts
│   │   │   │   ├── inicio.component.spec.ts
│   │   │   │   └── inicio.component.html
│   │   │   │
│   │   │   ├── candidatos/
│   │   │   │   ├── candidatos.component.ts
│   │   │   │   ├── candidatos.component.spec.ts
│   │   │   │   └── candidatos.component.html
│   │   │   │
│   │   │   └── nosotros/
│   │   │       ├── nosotros.component.ts
│   │   │       ├── nosotros.component.spec.ts
│   │   │       └── nosotros.component.html
│   │   │
│   │   ├── shared/                    # Recursos compartidos
│   │   │   ├── components/
│   │   │   │   └── navbar/
│   │   │   │       ├── navbar.component.ts
│   │   │   │       ├── navbar.component.spec.ts
│   │   │   │       └── navbar.component.html
│   │   │   │
│   │   │   ├── constants/             # Constantes de aplicación
│   │   │   │   ├── file-icons.ts
│   │   │   │   ├── file-icons.spec.ts
│   │   │   │   └── storage-keys.ts
│   │   │   │   └── storage-keys.spec.ts
│   │   │   │
│   │   │   ├── models/                # Interfaces TypeScript
│   │   │   │   ├── candidato.model.ts
│   │   │   │   ├── candidato-view.model.ts
│   │   │   │   └── adjunto.model.ts
│   │   │   │
│   │   │   └── utils/                 # Utilidades
│   │   │       └── debounce-signal.ts 
│   │   │       └── debounce-signal.spec.ts
│   │   │
│   │   ├── app.ts                     # Componente raíz
│   │   ├── app.html                   # Template raíz
│   │   ├── app.config.ts              # Configuración app
│   │   ├── app.config.spec.ts
│   │   └── app.routes.ts              # Configuración rutas
│   │   └── app.routes.spec.ts
│   │
│   ├── environments/                  # Variables de entorno
│   │   ├── environment.ts
│   │   └── environment.development.ts
│   │
│   ├── styles.css                     # Estilos globales
│   ├── main.ts                        # Punto de entrada
│   └── index.html                     # HTML principal
│   └── test.ts
│
├── public/                            # Assets estáticos
│   └── images/
│
├── angular.json
├── package.json
├── tsconfig.json
├── .postcssrc.json
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.spec.json
├── setup-jest.ts
├── jest.config.js
├── Dockerfile
├── docker-compose.yml
├── nginx.conf
├── .dockerignore
└── README.md
```

## Requisitos Previos

### Para Desarrollo Local
- **Node.js** 22.x o superior ([Descargar](https://nodejs.org/))
- **npm** 10.x o superior
- **Angular CLI** 20.x (se instalará automáticamente)

### Para Docker (Recomendado)
- **Docker** 20.10+ ([Descargar Docker Desktop](https://www.docker.com/products/docker-desktop))
- **Docker Compose** 2.0+ (incluido en Docker Desktop)

### Backend API
- **API Backend** ejecutándose en `http://localhost:8090` (ver [backend README](https://github.com/MlecarosC/ek-project))

## Instalación y Configuración

### Docker

#### Docker Compose
```bash
# 1. Clonar el repositorio
git clone https://github.com/MlecarosC/ek-project-ui.git
cd ek-project-ui

# 2. Construir e iniciar
docker-compose up -d

# 3. Ver logs (opcional)
docker-compose logs -f frontend

# 4. Acceder a la aplicación
# http://localhost:4200
```

**Comandos útiles:**
```bash
# Detener
docker-compose down

# Reconstruir
docker-compose up -d --build

# Ver estado
docker-compose ps
```

**Comandos de gestión:**
```bash
# Detener contenedor
docker stop ek-project-ui

# Iniciar contenedor
docker start ek-project-ui

# Eliminar contenedor
docker rm -f ek-project-ui

# Ver logs
docker logs ek-project-ui
```

#### Configuración de Puerto Personalizado

Si el puerto 4200 está ocupado:
```bash
# Docker Compose: editar docker-compose.yml
services:
  frontend:
    ports:
      - "8080:80"  # Cambiar 4200 por 8080

# Docker Run:
docker run -d --name ek-project-ui -p 8080:80 ek-project-ui:latest
```

### Desarrollo Local (Sin Docker)
```bash
# 1. Clonar el Repositorio
git clone https://github.com/MlecarosC/ek-project-ui.git
cd ek-project-ui

# 2. Instalar Dependencias
npm install

# 3. Iniciar en modo desarrollo
ng serve

# 4. Acceder a la aplicación
# http://localhost:4200
```

## Configurar Variables de Entorno

### Para Docker (Producción)

Antes de construir la imagen Docker, edita `src/environments/environment.ts`:
```typescript
export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8090/api/v1',  // Cambiar a tu dominio si es necesario.
  apiTimeout: 30000,
  enableDebugMode: false,
} as const;
```

Luego reconstruye:
```bash
docker-compose build --no-cache frontend
docker-compose up -d
```

### Para Desarrollo Local

La configuración de desarrollo ya está lista en `src/environments/environment.development.ts`:
```typescript
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8090/api/v1',
  apiTimeout: 30000,
  enableDebugMode: true,
} as const;
```

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

## Pruebas Unitarias con Jest
El proyecto está completamente integrado con Jest para realizar pruebas unitarias. Jest se utiliza en lugar de Karma y Jasmine, mejorando la velocidad y la fiabilidad de las pruebas. Se han implementado pruebas unitarias para los componentes y servicios principales.

**Ejecutar las Pruebas**
Para ejecutar las pruebas unitarias con Jest, utiliza los siguientes comandos:
```
npm run test

npm run test:coverage (para ejecutar tests con resumen coverage)
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
