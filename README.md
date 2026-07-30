# Online Code Runner API

A secure and modular Online Code Runner API built using **Node.js**, **Express.js**, **MongoDB**, and **JWT Authentication**. This project was refactored by applying software engineering and DevOps best practices, including modular architecture, secure authentication, centralized configuration, logging, linting, formatting, and Git hooks.

---

## Project Overview

This API allows users to:

- Register and log in securely
- Execute JavaScript code
- Save code snippets
- Retrieve their own saved snippets
- Authenticate using JWT

The project has been improved with:

- Modular folder structure
- Environment variables
- Exception handling
- Password hashing using bcrypt
- JWT authentication & authorization
- Logging using Winston & Morgan
- Security middleware (Helmet, CORS)
- ESLint
- Prettier
- Husky Git Hooks

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Winston
- Morgan
- Helmet
- CORS
- ESLint
- Prettier
- Husky

---

## Project Structure

```
src
├── config
├── controllers
├── logger
├── middleware
├── models
├── routes
├── utils
├── app.js
└── server.js
```

---

## Installation

### Clone the repository

```bash
git clone <your-repository-url>
cd devops_assignment1
```

### Install dependencies

```bash
npm install
```

---

## Environment Variables

Create a `.env` file in the project root.

Example:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/compiler
JWT_SECRET=your_secret_key
```

---

## Running the Application

Development mode

```bash
npm run dev
```

Production mode

```bash
npm start
```

---

## API Documentation

### Register

**POST**

```
/register
```

Request

```json
{
  "username": "john",
  "password": "123456"
}
```

---

### Login

**POST**

```
/login
```

Request

```json
{
  "username": "john",
  "password": "123456"
}
```

Returns

```json
{
  "token": "<jwt_token>"
}
```

---

### Run Code

**POST**

```
/run
```

Request

```json
{
  "code": "console.log('Hello World')",
  "input": ""
}
```

---

### Save Code

**POST**

```
/save
```

Headers

```
Authorization: Bearer <JWT_TOKEN>
```

Request

```json
{
  "title": "My Program",
  "code": "console.log('Hello');"
}
```

---

### Get Saved Codes

**GET**

```
/codes
```

Headers

```
Authorization: Bearer <JWT_TOKEN>
```

Returns all code snippets belonging to the authenticated user.

---

## Security Improvements

- Password hashing using bcrypt
- JWT Authentication
- JWT Authorization
- Environment variables
- Helmet security middleware
- CORS configuration
- Centralized exception handling

---

## Logging

- Server startup logs
- API request logging
- Authentication logs
- Application error logs

---

## Developer Tools

- ESLint
- Prettier
- Husky Git Hooks

---

## Author

Mayur Atlani
