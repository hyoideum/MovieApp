#MovieApp – Full Stack Web Application

MovieApp je full-stack web aplikacija za pregled i ocjenjivanje filmova.  
Aplikacija omogućava registraciju korisnika, autentikaciju, pregled filmova, dodavanje ocjena te upload slika za filmove.

👉 **Aplikacija je dostupna online:**  
🔗 Frontend: https://movie-app-dun-iota.vercel.app  
🔗 Backend API: https://movieapp-api.onrender.com *(primjer – prilagodi ako treba)*

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

- User registration & login (JWT)
- Zaštićene rute (authorization guards)
- CRUD operacije nad filmovima
- Upload slika za filmove
- Prikaz filmova s prosječnom ocjenom
- Ocjenjivanje filmova (1–10)
- Infinite scroll (lazy loading)
- Pretraga i sortiranje filmova
- Internationalization (i18n)

---

## Architecture & Concepts

# Backend Architecture
- Controller → Service → Repository pattern
- DTOs za komunikaciju s API-jem
- Global Exception Handling Middleware
- Dependency Injection
- Async / Await
- JWT-based authentication & authorization

# Frontend Concepts
- Separation of concerns (services, components)
- Route guards za zaštićene stranice
- HTTP interceptors za JWT token
- Reactive programming (RxJS)
- Lazy loading podataka (IntersectionObserver)

---

## Image Handling

Slike filmova se spremaju na backend server (`wwwroot/images`),  
dok se u bazi podataka sprema samo URL slike.

---

## Environment Variables

Backend koristi sljedeće environment varijable:

```env
DEFAULT_CONNECTION=postgres_connection_string
JWT_KEY=your_secret_key
JWT_ISSUER=your_issuer
JWT_AUDIENCE=your_audience
