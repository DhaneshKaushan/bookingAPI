# Service Booking API

A RESTful Service Booking API built using **NestJS**, **TypeScript**, **PostgreSQL**, and **TypeORM**.

This project was developed as a technical assignment and demonstrates secure authentication, role-based authorization, service management, and booking management using NestJS best practices.

---

# Project Overview

The application allows administrators to manage services while allowing customers to browse available services and create bookings without authentication.

## Features

### Authentication

* User Registration
* User Login
* JWT Access Token Authentication
* Refresh Token Authentication
* Logout
* Password Hashing using bcrypt
* Refresh Token Hashing using bcrypt

### Authorization

* Role-Based Authorization (ADMIN / CUSTOMER)
* JWT Authentication Guard
* Roles Guard

### Service Management

Administrators can:

* Create Service
* Update Service
* Delete Service

Public users can:

* View All Services
* View Service by ID

### Booking Management

Public users can:

* Create Booking
* Cancel Booking

Administrators can:

* View All Bookings
* View Booking by ID
* Update Booking Status

### Additional Features

* Pagination
* Booking Search
* Filter Bookings by Status
* Refresh Token
* Prevent duplicate bookings for the same service, date, and time
* Swagger API Documentation

---

# Technology Stack

* NestJS
* TypeScript
* PostgreSQL
* TypeORM
* Passport JWT
* bcrypt
* Swagger

---

# Installation Steps

## Clone the repository

```bash
git clone https://github.com/<your-username>/service-booking-api.git
```

## Move into the project

```bash
cd service-booking-api
```

## Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=service_booking_db

JWT_SECRET=your_access_secret
JWT_EXPIRES_IN=15m

JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=7d
```

---

# Database Setup

Create a PostgreSQL database.

Example:

```
service_booking_db
```

Update the database credentials in your `.env` file.

If TypeORM synchronization is enabled:

```typescript
synchronize: true
```

the tables will be created automatically on application startup.

---

# Running the Application

## Development

```bash
npm run start:dev
```

## Production

```bash
npm run build
npm run start:prod
```

---

# Running Migrations

This project currently uses **TypeORM synchronize** during development.

If migrations are enabled later:

Generate migration

```bash
npm run migration:generate
```

Run migrations

```bash
npm run migration:run
```

---

# API Documentation

Swagger documentation is available after starting the application.

```
http://localhost:3000/api
```

---

# API Endpoints

## Authentication

| Method | Endpoint         | Access           | Description                               |
| ------ | ---------------- | ---------------- | ----------------------------------------- |
| POST   | `/auth/register` | 🌍 Public        | Register a new customer                   |
| POST   | `/auth/login`    | 🌍 Public        | Login and receive Access & Refresh Tokens |
| POST   | `/auth/refresh`  | 🌍 Public        | Generate a new Access Token               |
| POST   | `/auth/logout`   | 🔒 Authenticated | Logout and invalidate Refresh Token       |

---

## Service Management

| Method | Endpoint        | Authentication | Role   |
| ------ | --------------- | -------------- | ------ |
| POST   | `/services`     | ✅ Required     | ADMIN  |
| GET    | `/services`     | ❌ Public       | Public |
| GET    | `/services/:id` | ❌ Public       | Public |
| PATCH  | `/services/:id` | ✅ Required     | ADMIN  |
| DELETE | `/services/:id` | ✅ Required     | ADMIN  |

### Service Model

* title
* description
* duration
* price
* isActive

---

## Booking Management

| Method | Endpoint               | Access    |
| ------ | ---------------------- | --------- |
| POST   | `/bookings`            | 🌍 Public |
| GET    | `/bookings`            | 🔒 ADMIN  |
| GET    | `/bookings/:id`        | 🔒 ADMIN  |
| PATCH  | `/bookings/:id/status` | 🔒 ADMIN  |
| PATCH  | `/bookings/:id/cancel` | 🌍 Public |

### Booking Model

* customerName
* customerEmail
* customerPhone
* serviceId
* bookingDate
* bookingTime
* status
* notes

### Booking Status

* PENDING
* CONFIRMED
* CANCELLED
* COMPLETED

---

# User Model

The application uses a `User` entity to manage authentication and authorization.

### User Model Fields

| Field        | Type   | Description                                 |
| ------------ | ------ | ------------------------------------------- |
| id           | number | Unique user identifier                      |
| name         | string | Full name of the user                       |
| email        | string | Unique email address used for login         |
| password     | string | Hashed password stored using bcrypt         |
| role         | enum   | User role such as `ADMIN` or `CUSTOMER`     |
| refreshToken | string | Hashed refresh token stored in the database |
| createdAt    | Date   | Timestamp when the user was created         |
| updatedAt    | Date   | Timestamp when the user was last updated    |

### User Roles

* ADMIN
* CUSTOMER

### User Responsibilities

* Register and login securely
* Store hashed passwords only
* Store only one active refresh token per user
* Support role-based authorization for protected routes

---

# Authentication Flow

## Login

Returns:

* Access Token (15 minutes)
* Refresh Token (7 days)

The Refresh Token is hashed before being stored in the database.

Only one active Refresh Token is allowed per user.

## Refresh Token

A valid Refresh Token can be exchanged for a new Access Token.

The Refresh Token remains valid until:

* It expires
* The user logs in again
* The user logs out

## Logout

Logging out removes the stored Refresh Token hash, making the previous Refresh Token unusable.

---

# Authorization Rules

* Public users can browse available services.
* Public users can create bookings.
* Public users can cancel their bookings.
* Only authenticated administrators can create, update, and delete services.
* Only authenticated administrators can manage bookings.
* JWT Access Tokens are required for protected endpoints.

---

# Business Rules

* A booking must reference an existing service.
* Booking dates cannot be in the past.
* Cancelled bookings cannot be marked as **COMPLETED**.
* Duplicate bookings for the same service, date, and time are prevented.
* Passwords are securely hashed using bcrypt.
* Refresh Tokens are stored as hashed values.
* Logging in invalidates any previously issued Refresh Token.
* Logout invalidates the current Refresh Token.

---

# Project Structure

```
src
├── auth
├── bookings
├── common
│   ├── decorators
│   ├── enums
│   ├── guards
├── services
├── users
├── app.module.ts
└── main.ts
```

---

# Assumptions Made

* Only ADMIN users can manage services.
* Customers do not need authentication to create bookings.
* Customers do not need authentication to cancel bookings.
* TypeORM synchronization is enabled for development.

---

# Future Improvements

* Docker Support
* Unit Testing
* Integration Testing
* Database Migrations for Production
* Email Notifications
* Booking Confirmation Emails
* Rate Limiting
* Audit Logging
* CI/CD Pipeline

---

# Author

**Dhanesh Kaushan**

NestJS | TypeScript | PostgreSQL | REST API Development
