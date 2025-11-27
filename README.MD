# 📚 Sistema de Gestión de Libros

> API RESTful desarrollada con FastAPI (Python) y frontend con React + Material-UI

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18+-61DAFB.svg)](https://reactjs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 🎯 Descripción

Sistema completo de gestión de biblioteca desarrollado como prueba técnica. Incluye backend con API REST, base de datos persistente, y frontend moderno con interfaz profesional.

## ✨ Características

### Backend (FastAPI + SQLite)
- ✅ 5 endpoints REST completos (CRUD)
- ✅ Validación automática con Pydantic
- ✅ Manejo completo de errores (404, 422, 500)
- ✅ Base de datos SQLite persistente
- ✅ Documentación automática con Swagger UI
- ✅ CORS configurado para desarrollo

### Frontend (React + Material-UI)
- ✅ Interfaz moderna y responsive
- ✅ Operaciones CRUD completas
- ✅ Formularios con validación
- ✅ Confirmación antes de eliminar
- ✅ Notificaciones visuales (Snackbar)
- ✅ Estados de carga (Loading)
- ✅ Manejo de errores en UI

## 🚀 Demo

![Demo del sistema](demo.gif)

**Video explicativo completo:** [Ver en YouTube](#)

## 📋 Requisitos Previos

- Python 3.11 o superior
- Node.js 18 o superior
- npm o yarn

## 🛠️ Instalación

### Backend

```bash
# Clonar el repositorio
git clone https://github.com/[tu-usuario]/[tu-repo].git
cd [tu-repo]

# Navegar al backend
cd backend

# Crear entorno virtual (opcional pero recomendado)
python -m venv venv
source venv/bin/activate  # En Windows: venv\Scripts\activate

# Instalar dependencias
pip install -r requirements.txt

# Ejecutar el servidor
python main.py
```

El backend estará disponible en: `http://localhost:8000`  
Documentación interactiva: `http://localhost:8000/docs`

### Frontend

```bash
# Navegar al frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar la aplicación
npm run dev
```

La aplicación estará disponible en: `http://localhost:3000`

## 📁 Estructura del Proyecto

```
proyecto-libros/
├── backend/
│   ├── main.py              # Aplicación principal
│   ├── requirements.txt     # Dependencias Python
│   └── books.db            # Base de datos SQLite (se crea automáticamente)
│
└── frontend/
    ├── src/
    │   ├── App.jsx         # Componente principal
    │   ├── main.jsx        # Punto de entrada
    │   └── index.css       # Estilos globales
    ├── public/
    ├── package.json
    └── vite.config.js
```

## 🔌 Endpoints de la API

### Books

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/books` | Crear un nuevo libro |
| `GET` | `/books` | Obtener todos los libros |
| `GET` | `/books/{id}` | Obtener un libro específico |
| `PUT` | `/books/{id}` | Actualizar un libro |
| `DELETE` | `/books/{id}` | Eliminar un libro |

### Modelo de Datos

```json
{
  "id": 1,
  "title": "Cien años de soledad",
  "author": "Gabriel García Márquez",
  "year": 1967,
  "genre": "Realismo mágico"
}
```

**Campos:**
- `id` (int): Autoincremental, generado automáticamente
- `title` (string): Obligatorio, 1-200 caracteres
- `author` (string): Obligatorio, 1-100 caracteres
- `year` (int): Opcional, rango 1000-9999
- `genre` (string): Opcional, máximo 50 caracteres

## 🧪 Ejemplos de Uso

### Crear un libro

```bash
curl -X POST "http://localhost:8000/books" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "year": 1949,
    "genre": "Distopía"
  }'
```

### Obtener todos los libros

```bash
curl http://localhost:8000/books
```

### Actualizar un libro

```bash
curl -X PUT "http://localhost:8000/books/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "1984",
    "author": "George Orwell",
    "year": 1949,
    "genre": "Ciencia ficción"
  }'
```

### Eliminar un libro

```bash
curl -X DELETE http://localhost:8000/books/1
```

## 🏗️ Arquitectura

### Backend

```
Capa de Presentación (API Endpoints)
         ↓
Capa de Validación (Pydantic Models)
         ↓
Capa de Acceso a Datos (SQLite)
         ↓
Capa de Manejo de Errores (Try-Catch)
```

### Frontend

```
App Component (Estado Global)
         ↓
Material-UI Components
         ↓
Axios (HTTP Client)
         ↓
Backend API
```

## 🧪 Testing

```bash
# Backend
cd backend
pytest

# Frontend
cd frontend
npm test
```

## 🚀 Deployment

### Backend (Railway/Render)

```bash
# Agregar Procfile
web: uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# La carpeta dist/ contiene los archivos estáticos
```

## 📝 Decisiones Técnicas

### ¿Por qué FastAPI?
- Rendimiento superior
- Validación automática de datos
- Documentación automática
- Type hints de Python
- Fácil de aprender y usar

### ¿Por qué React + Vite?
- Vite es extremadamente rápido (10-100x más rápido que CRA)
- Hot Module Replacement instantáneo
- React es el framework más popular
- Material-UI proporciona componentes profesionales

### ¿Por qué SQLite?
- No requiere instalación adicional
- Perfecto para desarrollo y demos
- Archivo único fácil de respaldar
- Para producción se puede migrar fácilmente a PostgreSQL

## 🔮 Mejoras Futuras

- [ ] Autenticación y autorización (JWT)
- [ ] Paginación de resultados
- [ ] Búsqueda y filtros avanzados
- [ ] Ordenamiento de columnas
- [ ] Tests unitarios y de integración
- [ ] CI/CD con GitHub Actions
- [ ] Dockerización
- [ ] Caché con Redis
- [ ] Upload de imágenes de portadas
- [ ] Sistema de categorías y etiquetas

## 👤 Autor

**[Emmanuel Galeano Martinez]**

- GitHub: [@Emmanuel33](https://github.com/Emmanuel333333333)
- Email: emmanuelgaleano43@gmail.com

## 🙏 Agradecimientos

- FastAPI por el excelente framework
- Material-UI por los componentes
- La comunidad de React
- [SofkaTechnologies] por la oportunidad de realizar esta prueba técnica

---

📺 [Ver video explicativo completo](#)
