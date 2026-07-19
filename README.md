# DevOps & Backend Best Practices Assignment: Online Code Runner API

## Project Description

This project is a deliberately **under-engineered** Online Code Runner API built using **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**. While the application is functional, it intentionally contains poor coding practices, security vulnerabilities, and architectural issues that are commonly found in beginner projects.

Your objective is to transform this codebase into a production-ready backend by applying software engineering and DevOps best practices.

**Do not rewrite the application from scratch.** Instead, refactor and improve the existing code while preserving its functionality.

---

# Assignment Objectives

The current project intentionally contains the following issues. Your task is to identify and fix them.

## 1. Project Structure

* Refactor the application into a modular folder structure.
* Separate routes, controllers, models, middleware, configuration, and utility functions.
* Improve readability and maintainability.

## 2. Hardcoded Secrets

* Remove all hardcoded secrets from the source code.
* Store configuration values (database URI, JWT secret, etc.) using environment variables.
* Provide a `.env.example` file.

## 3. Exception Handling

* The application currently lacks proper exception handling.
* Add appropriate `try...catch` blocks where required.
* Return meaningful HTTP status codes and error messages.
* Prevent the server from crashing due to unhandled errors.

## 4. Password Security

* Passwords are currently stored in plain text.
* Hash passwords before storing them in the database.
* Use a suitable password hashing library.

## 5. Login Logic

* The current login implementation does **not** verify the user's password correctly.
* Fix the authentication logic so that users can only log in with valid credentials.
* Return appropriate responses for invalid login attempts.

## 6. Authorization

* Ensure authenticated users can only access their own saved code snippets.
* Protect appropriate routes using JWT middleware.

## 7. Logging

* Integrate an application logging solution.
* Log important events such as:

  * Server startup
  * Authentication attempts
  * API requests
  * Application errors

## 8. Middleware

* Add appropriate middleware where necessary.
* Examples include:

  * Authentication
  * Request logging
  * Error handling
  * Security
  * CORS
  * JSON parsing

## 9. Git Security

* Configure a proper `.gitignore`.
* Ensure sensitive files and generated artifacts are excluded from version control.
* Follow good Git hygiene practices.

## 10. Code Formatting

* Configure a formatter such as Prettier.
* Ensure the entire project follows consistent formatting.

## 11. Linting

* Configure ESLint.
* Resolve linting issues throughout the project.
* Follow consistent coding standards.

## 12. Git Hooks

* Configure Husky.
* Automatically run formatting and/or linting checks before commits.

## 13. Documentation

Update the README to include:

* Project overview
* Installation steps
* Environment variable setup
* Running the application
* API documentation

---

# Expected Deliverables

Students should submit:

* Refactored project source code
* Updated README
* `.env.example`
* Working authentication system
* Secure password storage
* Proper project structure
* Logging implementation
* Configured ESLint, Prettier, and Husky
* Clean Git history

---

# Evaluation Criteria

* Code organization and maintainability
* Correct authentication and authorization
* Secure handling of sensitive information
* Robust exception handling
* Quality of logging
* Appropriate middleware usage
* Git best practices
* Code formatting and linting
* Documentation quality
* Overall production readiness
