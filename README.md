Menu Tree Management System

A full-stack web application for managing hierarchical menu structures with drag-and-drop support, built using React.js (TypeScript) for the frontend and NestJS (TypeScript) for the backend.


Tree-System/<br>
│<br>
├── menu-tree-frontend/   # React + TypeScript <br>
├── menu-tree-backend/    # NestJS + TypeScript<br>
├── API DOC/              # Dokumentasi pendukung (Postman & Result Response)<br>
└── README.md

---

## Technology Stack

### Frontend
- React.js
- TypeScript
- Axios
- Drag and Drop (menu reordering)
- tailwinds css

### Backend
- NestJS
- TypeScript
- Sequelize ORM
- MySQL

### Tools
- Node.js
- Postman (API testing & documentation)
- Docker 
- MAMP (MySQL local environment)

## System Architecture

Frontend (React, Port 3000)
|
| REST API
v
Backend (NestJS, Port 30000)
|
v
MySQL Database (MAMP)

Frontend dan backend dipisahkan dan berkomunikasi menggunakan REST API. Struktur menu dikelola menggunakan relasi `parent_id` untuk membentuk hierarki data.

## Running in Development Mode
### Backend

cd menu-tree-backend
npm install
npm run start:dev


### Frontend

cd menu-tree-frontend
npm install
npm start

# API Documentation (Postman)

Dokumentasi dan pengujian API dilakukan menggunakan Postman.

### Available Endpoints

| Method | Endpoint | Description |
|------|---------|-------------|
| GET | `/api/menus` | Get all menu items (tree structure) |
| GET | `/api/menus/{id}` | Get single menu item |
| POST | `/api/menus` | Create new menu item |
| PUT | `/api/menus/{id}` | Update menu item |
| DELETE | `/api/menus/{id}` | Delete menu item and its children |
| PATCH | `/api/menus/{id}/move` | Move menu to another parent |
| PATCH | `/api/menus/{id}/reorder` | Reorder menu items |


---

## Application Features

### Frontend
- Display menu tree in a hierarchical structure
- Add new menu items at any level
- Edit menu items
- Delete menu items with confirmation
- Drag and drop menu reordering
- Expand and collapse nested menus
- Search and filter menu items
- Responsive layout
- Loading and error handling

### Backend
- RESTful API
- Hierarchical menu management using `parent_id`
- Sequelize migrations
- Modular NestJS architecture

---

## Notes

- Swagger/OpenAPI is not used in this project.
- API documentation is provided using Postman.
- Docker is included in this project for documentation purposes only, to illustrate the application architecture and environment configuration
