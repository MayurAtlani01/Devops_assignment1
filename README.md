# DevOps & Backend Best Practices Assignment: Online Code Runner API

## Project Description

In this assignment, you will improve and productionize a basic Node.js + Express application that acts as an online code runner. The existing application allows users to execute JavaScript code, save code snippets, and retrieve saved programs from a MongoDB database.

While the application is functional, it lacks many of the qualities expected in a production-ready backend. Your task is to refactor, secure, and enhance the project by applying software engineering and DevOps best practices.

The focus of this assignment is **not** on adding new business features, but on improving the overall quality, maintainability, security, and reliability of the application.

By the end of this assignment, the project should follow a clean architecture, implement proper authentication, handle failures gracefully, maintain readable code standards, and follow industry best practices for version control and development workflows.

---

# Assignment Objectives

Implement the following improvements:

## 1. Project Structure

* Refactor the application into a modular folder structure.
* Separate routes, controllers, models, middleware, utilities, and configuration.
* Remove duplicated code wherever possible.

## 2. User Authentication

* Implement user registration and login.
* Hash user passwords before storing them.
* Use JWT-based authentication.
* Protect appropriate API endpoints using authentication middleware.

## 3. Authorization

* Ensure users can access only their own saved code snippets.
* Prevent unauthorized access to protected resources.

## 4. Exception Handling

* Handle all possible runtime and database errors gracefully.
* Return meaningful HTTP status codes.
* Avoid exposing internal server errors or stack traces to clients.

## 5. Logging

* Integrate an application logging library.
* Log important events such as:

  * Server startup
  * User authentication attempts
  * Successful and failed API requests
  * Unexpected application errors
* Store logs in an appropriate format.

## 6. Middleware

* Add appropriate Express middleware where necessary.
* Consider middleware for:

  * Authentication
  * Request logging
  * Error handling
  * Security
  * CORS
  * JSON parsing

## 7. Security Improvements

* Store secrets using environment variables.
* Never commit sensitive information to Git.
* Protect against common backend security mistakes.
* Validate incoming request data wherever appropriate.

## 8. Git Security

* Configure an appropriate `.gitignore`.
* Ensure secrets, generated files, and dependencies are not committed.
* Keep the repository clean and organized.

## 9. Code Formatting

* Configure an automatic code formatter.
* Ensure consistent formatting across the project.

## 10. Linting

* Configure a JavaScript linter.
* Resolve linting issues throughout the project.
* Follow consistent coding standards.

## 11. Git Hooks

* Configure Husky.
* Automatically run formatting and/or linting checks before commits.

## 12. Documentation

* Update the README with:

  * Project overview
  * Installation steps
  * Environment variable configuration
  * Running the project
  * Available API endpoints

---

# Expected Deliverables

Students should submit:

* Refactored project source code
* Updated README
* Environment variable template (`.env.example`)
* Proper Git history
* Working authentication system
* Configured formatter, linter, and Husky hooks
* Logging implementation
* Clean and modular project structure

---

# Evaluation Criteria

* Clean and maintainable project structure
* Correct implementation of authentication and authorization
* Robust exception handling
* Meaningful logging
* Appropriate use of middleware
* Security best practices
* Code quality and consistency
* Proper Git hygiene
* Documentation quality
* Overall project maintainability
