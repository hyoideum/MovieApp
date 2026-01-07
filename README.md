#MovieApp – Full Stack Web Application

MovieApp is a full-stack web application for browsing and rating movies.
The application allows users to register, authenticate, browse movies, rate them, and upload images for movies.

The application is live and available online:
- Frontend: https://movie-app-dun-iota.vercel.app  
- Backend API: https://movieapp-api.onrender.com *(primjer – prilagodi ako treba)*

---

## Tech Stack

# Backend
- .NET 8
- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- JWT Authentication
- FluentValidation
- AutoMapper

# Frontend
- Angular
- TypeScript
- HTML / CSS
- Standalone Components
- RxJS

---

## Features

- User registration and login (JWT authentication)
- Role-based authorization and protected routes
- CRUD operations for movies
- Image upload for movies
- Display of movies with average rating
- Movie rating system (1–10)
- Infinite scroll (lazy loading)
- Search and sorting of movies
- Internationalization (i18n)

---

## Architecture & Concepts

# Backend Architecture
- Controller → Service → Repository pattern
- DTOs for API communication
- Global exception handling middleware
- Dependency Injection
- Async / Await
- JWT-based authentication and authorization

# Frontend Concepts
- Separation of concerns (services, components)
- Route guards for protected pages
- HTTP interceptors for JWT token handling
- Reactive programming with RxJS
- Lazy loading using IntersectionObserver

---

## Image Handling

Movie images are stored on the backend server (wwwroot/images),
while only the image URL is stored in the database.

This approach improves performance and keeps the database lightweight.

---

## Environment Variables

The backend uses the following environment variables:

DEFAULT_CONNECTION=postgres_connection_string
JWT_KEY=your_secret_key
JWT_ISSUER=your_issuer
JWT_AUDIENCE=your_audience

---

## Project Status

- This project is actively developed and serves as a learning project focused on:
- Full-stack web development
- Clean architecture
- Modern Angular and .NET practices

## How would I Scale the Application

- Database Optimization – Use indexing, query optimization, and connection pooling to handle higher traffic and reduce latency.
- Caching – Implement server-side caching (e.g., Redis) for frequently accessed data like movie lists and ratings.
- Load Balancing – Deploy multiple backend instances behind a load balancer to distribute requests evenly.
- Cloud Storage for Images – Move movie images to cloud storage (e.g., AWS S3, Azure Blob Storage) instead of storing them on the backend server.
- Asynchronous Processing – Use background jobs or message queues for heavy tasks like sending emails or processing images.
- Frontend Optimization – Enable lazy loading of components and assets, compress images, and use CDNs for static content.
