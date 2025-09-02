# Backend Documentation

This is the backend part of the Angular-Spring Boot application. It is built using Spring Boot and is designed to handle authentication and user management.

## Project Structure

- `src/main/java/com/example/backend/BackendApplication.java`: Entry point of the Spring Boot application.
- `src/main/java/com/example/backend/controller/AuthController.java`: Handles authentication requests.
- `src/main/java/com/example/backend/model/User.java`: Represents the user entity.
- `src/main/java/com/example/backend/service/AuthService.java`: Contains methods for user authentication.
- `src/main/resources/application.properties`: Configuration settings for the Spring Boot application.
- `pom.xml`: Maven configuration file listing dependencies.

## Features

- User authentication with mock data.
- Plans to connect to an Oracle database in the future.

## Getting Started

1. Clone the repository.
2. Navigate to the `backend` directory.
3. Build the project using Maven: `mvn clean install`.
4. Run the application: `mvn spring-boot:run`.

## Future Enhancements

- Integration with an Oracle database for persistent user data.
- Implementation of additional security features.