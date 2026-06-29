# SIGEA - Sistema de Gestión de Edificaciones Afectadas

Plataforma web progresiva (PWA) para el registro, monitoreo y seguimiento de edificaciones afectadas por eventos naturales en **Guarenas, municipio Plaza, estado Miranda**.

## Demo

Abra `index.html` en cualquier navegador. Sin servidor requerido.

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 + CSS3 | Estructura y estilo responsive |
| TailwindCSS (CDN) | Framework CSS utilitario |
| JavaScript Vanilla | Lógica completa (2210 líneas) |
| Chart.js | Gráficos del dashboard |
| Leaflet.js | Mapas interactivos |
| IndexedDB | Almacenamiento local offline |
| Supabase (CDN) | Base de datos en la nube opcional (capa gratuita) |
| html2pdf.js | Exportación PDF |
| Lucide Icons | Iconografía SVG |
| PWA (SW + Manifest) | Instalable, offline |

## Base de datos

### Local (por defecto)
- **IndexedDB** en el navegador
- Funciona offline, sin servidor, cero costo
- Los datos persisten aunque cierre el navegador

### Nube (opcional, multi-dispositivo)
- **Supabase** (PostgreSQL en la nube, capa gratuita: 500MB)
- Acceda a los datos desde cualquier dispositivo
- Configurable desde Administración → Base de datos en la nube

#### Configurar Supabase
1. Cree una cuenta gratis en [supabase.com](https://supabase.com)
2. Cree un proyecto nuevo
3. En SQL Editor, ejecute:
```sql
CREATE TABLE estructuras (
  id TEXT PRIMARY KEY, nombre TEXT, tipo TEXT, urbanizacion TEXT,
  sector TEXT, direccion TEXT, estado TEXT, municipio TEXT,
  latitud FLOAT8, longitud FLOAT8, anio_construccion INT,
  cantidad_pisos INT, cantidad_apartamentos INT, cantidad_locales INT,
  cantidad_familias INT, habitantes_estimados INT,
  foto_principal TEXT, estado_estructural TEXT, riesgo_colapso BOOL,
  fecha_registro TEXT, ultima_inspeccion TEXT, atencion_prioritaria BOOL
);
CREATE TABLE inspecciones (
  id TEXT PRIMARY KEY, estructura_id TEXT, inspector TEXT,
  profesion TEXT, credencial TEXT, institucion TEXT,
  fecha TEXT, resultado TEXT, recomendaciones TEXT, documentos JSONB
);
CREATE TABLE fotografias (
  id TEXT PRIMARY KEY, estructura_id TEXT, categoria TEXT,
  autor TEXT, fecha TEXT, hora TEXT, descripcion TEXT,
  dataUrl TEXT, created_at TEXT
);
CREATE TABLE seguimientos (
  id TEXT PRIMARY KEY, estructura_id TEXT, fecha TEXT,
  inspector TEXT, organismo TEXT, observaciones TEXT,
  nivel_daño TEXT, acciones TEXT
);
CREATE TABLE servicios (
  id TEXT PRIMARY KEY, estructura_id TEXT, electricidad TEXT,
  agua TEXT, gas TEXT, internet TEXT, telefonia TEXT,
  ascensores TEXT, aguas_servidas TEXT, fecha_actualizacion TEXT
);
CREATE TABLE usuarios (
  id TEXT PRIMARY KEY, nombre TEXT, email TEXT, rol TEXT,
  organismo TEXT, telefono TEXT, activo BOOL
);
CREATE TABLE referencias (
  id TEXT PRIMARY KEY, data JSONB
);
```
4. Vaya a Project Settings → API → copie URL y anon key
5. En SIGEA: Administración → pegue los datos → Guardar → Migrar

## Diseño responsive

La aplicación se adapta automáticamente a:
- **Desktop** (≥1024px): layout completo con sidebar fija
- **Tablet** (768-1024px): sidebar ocultable, grillas adaptables
- **Móvil** (480-768px): navegación táctil, cards compactas
- **Móvil pequeño** (<480px): tipografía reducida, 2 columnas
- **Landscape**: optimizado para pantallas horizontales
- **Touch**: gestos nativos, sin hover dependency

## Archivos

```
/
├── index.html          # Shell SPA (3.6 KB)
├── app.js              # Lógica completa (121 KB / 2210 líneas)
├── style.css           # Estilo responsive minimalista
├── database.json       # Datos semilla (12 estructuras)
├── manifest.json       # PWA manifest
├── sw.js               # Service Worker
├── icons/              # Iconos PWA
└── README.md           # Documentación
```

## Rutas

| Hash | Vista |
|---|---|
| `#dashboard` | Dashboard con stats y 4 gráficos |
| `#estructuras` | Listado CRUD con filtros |
| `#estructura/:id` | Ficha con fotos, inspecciones, galería |
| `#mapa` | Mapa Leaflet con marcadores |
| `#buscador` | Búsqueda multi-criterio |
| `#inspecciones` | Inspecciones técnicas |
| `#administracion` | Usuarios + configuración de nube |
| `#reportes` | 8 tipos de reportes |
| `#import-export` | Importar/Exportar datos |

## Uso

1. Abrir `index.html` en Chrome, Edge, Firefox o Safari
2. Datos semilla se cargan automáticamente
3. Navegar por el menú lateral
4. Para usar en múltiples dispositivos: configurar Supabase en Administración

---

**Versión:** 1.0.0
**Alcaldía del municipio Plaza**
**Guarenas, estado Miranda - Julio 2026**
