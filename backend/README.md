# Java Spring Boot Backend - FWFPS

## Overview

This is the primary backend implementation for the FWFPS (Field Work Force Planning System) using Java Spring Boot with H2 database. It provides RESTful APIs for managing workplans, PAC operations, PPS operations, and general operations.

## Technology Stack

- **Java**: 11+
- **Spring Boot**: 2.7.18
- **Spring Data JPA**: For database operations
- **H2 Database**: File-based embedded database
- **Maven**: Build and dependency management
- **CORS**: Cross-origin resource sharing enabled

## Project Structure

```
backend/
├── src/main/java/com/example/backend/
│   ├── BackendApplication.java           # Main Spring Boot application
│   ├── config/
│   │   └── CorsConfig.java              # CORS configuration
│   ├── controller/                       # REST API controllers
│   │   ├── OperationController.java
│   │   ├── PACOperationController.java
│   │   ├── PPSOperationController.java
│   │   └── WorkplanController.java
│   ├── entity/                          # JPA entities
│   │   ├── Operation.java
│   │   ├── PACOperation.java
│   │   ├── PPSOperation.java
│   │   └── Workplan.java
│   └── repository/                      # JPA repositories
│       ├── OperationRepository.java
│       ├── PACOperationRepository.java
│       ├── PPSOperationRepository.java
│       └── WorkplanRepository.java
├── src/main/resources/
│   └── application.properties           # Configuration
├── pom.xml                             # Maven configuration
└── target/                             # Build output
```

## Quick Start

### Prerequisites

- Java 11 or higher
- Maven 3.6+

### Installation and Setup

1. **Clone and navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Build the project**:
   ```bash
   mvn clean install
   ```

3. **Run the application**:
   ```bash
   mvn spring-boot:run
   ```
   
   Or run the JAR directly:
   ```bash
   java -jar target/backend-0.0.1-SNAPSHOT.jar
   ```

4. **Server starts on**: `http://localhost:8090`

5. **H2 Database Console**: `http://localhost:8090/h2-console`
   - JDBC URL: `jdbc:h2:file:./backend-db`
   - Username: `sa`
   - Password: (leave empty)

## API Endpoints

### Base URL: `http://localhost:8090/api`

### Workplans
- `GET /workplans` - List all workplans
- `GET /workplans/{id}` - Get workplan by ID
- `POST /workplans` - Create new workplan
- `PUT /workplans/{id}` - Update workplan
- `DELETE /workplans/{id}` - Delete workplan

### PAC Operations
- `GET /pac-operations` - List all PAC operations
- `GET /pac-operations/{id}` - Get PAC operation by ID
- `POST /pac-operations` - Create PAC operation
- `PUT /pac-operations/{id}` - Update PAC operation
- `DELETE /pac-operations/{id}` - Delete PAC operation

### PPS Operations
- `GET /pps-operations` - List all PPS operations
- `GET /pps-operations/{id}` - Get PPS operation by ID
- `POST /pps-operations` - Create PPS operation
- `PUT /pps-operations/{id}` - Update PPS operation
- `DELETE /pps-operations/{id}` - Delete PPS operation

### General Operations
- `GET /operations` - List all operations
- `GET /operations/{id}` - Get operation by ID
- `POST /operations` - Create operation
- `PUT /operations/{id}` - Update operation
- `DELETE /operations/{id}` - Delete operation

## Database Schema

The application automatically creates the following tables:

### WORKPLANS
```sql
CREATE TABLE WORKPLANS (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TITLE VARCHAR(255),
    DESCRIPTION TEXT,
    STATUS VARCHAR(50),
    PRIORITY VARCHAR(20),
    START_DATE TIMESTAMP,
    END_DATE TIMESTAMP,
    ASSIGNED_TO VARCHAR(255),
    PROGRESS INTEGER,
    TASK_COUNT INTEGER
);
```

### PAC_OPERATIONS
```sql
CREATE TABLE PAC_OPERATIONS (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    OPERATION_TYPE VARCHAR(255),
    FACILITY_NAME VARCHAR(255),
    FACILITY_ID VARCHAR(255),
    FACILITY_ADDRESS TEXT,
    OPERATION_DATE TIMESTAMP,
    STATUS VARCHAR(50),
    PRIORITY VARCHAR(20),
    INSPECTOR VARCHAR(255),
    NOTES TEXT
);
```

### PPS_OPERATIONS
```sql
CREATE TABLE PPS_OPERATIONS (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    PPS_NAME VARCHAR(255),
    LOCATION VARCHAR(255),
    STATUS VARCHAR(50),
    CAPACITY INTEGER,
    LAST_INSPECTION TIMESTAMP
);
```

### OPERATIONS
```sql
CREATE TABLE OPERATIONS (
    ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    OPERATION_NAME VARCHAR(255),
    OPERATION_TYPE VARCHAR(255),
    STATUS VARCHAR(50),
    DESCRIPTION TEXT,
    START_DATE TIMESTAMP,
    END_DATE TIMESTAMP
);
```

## Configuration

### application.properties
```properties
# Server Configuration
server.port=8090

# H2 Database Configuration
spring.datasource.url=jdbc:h2:file:./backend-db
spring.datasource.driverClassName=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# H2 Console (for development)
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## CORS Configuration

The application is configured to allow cross-origin requests from the Angular frontend:

```java
@Configuration
@EnableWebMvc
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:4300")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
```

## Testing the API

### Using PowerShell (Windows)

1. **Create a workplan**:
```powershell
$workplan = @{
    title = "Test Workplan"
    description = "Testing Java backend"
    status = "ACTIVE"
    priority = "HIGH"
    startDate = "2025-09-01T08:00:00"
    endDate = "2025-09-30T18:00:00"
    assignedTo = "Test User"
    progress = 0
    taskCount = 5
}

$response = Invoke-RestMethod -Uri "http://localhost:8090/api/workplans" -Method Post -Body ($workplan | ConvertTo-Json) -ContentType "application/json"
Write-Output $response
```

2. **Get all workplans**:
```powershell
$workplans = Invoke-RestMethod -Uri "http://localhost:8090/api/workplans" -Method Get
Write-Output $workplans
```

3. **Create PAC operation**:
```powershell
$pacOp = @{
    operationType = "INSPECTION"
    facilityName = "Test Facility"
    facilityId = "TF-001"
    facilityAddress = "123 Test Street"
    operationDate = "2025-09-15T09:00:00"
    status = "SCHEDULED"
    priority = "HIGH"
    inspector = "John Doe"
    notes = "Regular inspection"
}

$response = Invoke-RestMethod -Uri "http://localhost:8090/api/pac-operations" -Method Post -Body ($pacOp | ConvertTo-Json) -ContentType "application/json"
Write-Output $response
```

## Development Features

### JPA Auto-Generation
- All entities use `@GeneratedValue(strategy = GenerationType.IDENTITY)` for auto-incrementing primary keys
- Database schema is automatically created/updated using `spring.jpa.hibernate.ddl-auto=update`

### Repository Pattern
- All repositories extend `JpaRepository<Entity, Long>` providing automatic CRUD operations
- Custom query methods can be added as needed

### REST Controller Pattern
- All controllers use `@RestController` and `@RequestMapping` for clean URL mapping
- Automatic JSON serialization/deserialization
- `@CrossOrigin` annotation for CORS support

## Production Considerations

### Database Migration
For production use, consider switching to a more robust database:

1. **PostgreSQL**:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/fwfps
spring.datasource.driverClassName=org.postgresql.Driver
spring.datasource.username=fwfps_user
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
```

2. **MySQL**:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/fwfps
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=fwfps_user
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQLDialect
```

### Security
- Implement Spring Security for authentication and authorization
- Use HTTPS in production
- Implement proper input validation
- Add request rate limiting

### Monitoring
- Enable Spring Boot Actuator endpoints for monitoring
- Implement proper logging
- Add application metrics collection

## Troubleshooting

### Common Issues

1. **Port 8090 already in use**:
   - Change port in `application.properties`: `server.port=8091`
   - Or kill process using port 8090

2. **Database connection issues**:
   - Check if H2 database file exists and is not locked
   - Verify JDBC URL in H2 console matches configuration

3. **CORS issues**:
   - Verify Angular frontend URL in `CorsConfig.java`
   - Check browser developer console for CORS errors

4. **Build failures**:
   - Ensure Java 11+ is installed and in PATH
   - Run `mvn clean install` to rebuild dependencies

### H2 Console Access
If H2 console is not accessible:
1. Verify `spring.h2.console.enabled=true` in application.properties
2. Check URL: `http://localhost:8090/h2-console`
3. Ensure JDBC URL is correct: `jdbc:h2:file:./backend-db`

## Integration with Frontend

The Angular frontend is configured to use this Java backend by default. The API service points to `http://localhost:8090/api`.

To switch between Java and Python backends, update the `baseUrl` in `frontend/src/app/services/api.service.ts`:

```typescript
// For Java backend
private baseUrl = 'http://localhost:8090/api';

// For Python backend  
private baseUrl = 'http://localhost:5001/api';
```

## Support

For issues or questions regarding the Java Spring Boot backend implementation, please refer to:
- Spring Boot documentation: https://spring.io/projects/spring-boot
- Spring Data JPA documentation: https://spring.io/projects/spring-data-jpa
- H2 Database documentation: https://h2database.com/
