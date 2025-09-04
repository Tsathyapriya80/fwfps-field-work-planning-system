# FWFPS API Documentation

## Base URLs

### Java Spring Boot Backend (Primary)
```
Development: http://localhost:8090/api
Production: https://your-domain.com/api
```

### Python Flask Backend (Alternative)
```
Development: http://localhost:5001/api  
Production: https://your-python-domain.com/api
```

## Backend Architecture Overview

The FWFPS system now supports dual backend architectures:

1. **Java Spring Boot Backend** - Primary implementation with H2 database
2. **Python Flask Backend** - Alternative implementation with SQLite database

Both backends provide identical REST API interfaces for seamless frontend integration.

## Authentication
Currently implementing session-based authentication. All API endpoints require valid session tokens.

**Note:** Authentication implementation is planned for future iterations.

---

## Java Spring Boot API Endpoints

### 🏥 Health & Status

#### GET /actuator/health  
Spring Boot actuator health check - **No authentication required**

**Response:**
```json
{
  "status": "UP"
}
```

---

### 📋 Workplans Management

#### GET /api/workplans
Get all workplans

**Response:**
```json
[
  {
    "id": 1,
    "title": "Field Survey Q1 2025",
    "description": "Quarterly field survey operations",
    "status": "ACTIVE",
    "priority": "HIGH",
    "startDate": "2025-01-01T00:00:00",
    "endDate": "2025-03-31T23:59:59",
    "assignedTo": "John Doe",
    "progress": 65,
    "taskCount": 12
  }
]
```

#### GET /api/workplans/{id}
Get workplan by ID

**Parameters:**
- `id` (path): Workplan ID (integer)

**Response:**
```json
{
  "id": 1,
  "title": "Field Survey Q1 2025",
  "description": "Quarterly field survey operations",
  "status": "ACTIVE",
  "priority": "HIGH",
  "startDate": "2025-01-01T00:00:00",
  "endDate": "2025-03-31T23:59:59",
  "assignedTo": "John Doe",
  "progress": 65,
  "taskCount": 12
}
```

#### POST /api/workplans
Create new workplan

**Request:**
```json
{
  "title": "Field Survey Q1 2025",
  "description": "Quarterly field survey operations",
  "status": "ACTIVE",
  "priority": "HIGH",
  "startDate": "2025-01-01T00:00:00",
  "endDate": "2025-03-31T23:59:59",
  "assignedTo": "John Doe",
  "progress": 0,
  "taskCount": 12
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Field Survey Q1 2025",
  "description": "Quarterly field survey operations",
  "status": "ACTIVE",
  "priority": "HIGH",
  "startDate": "2025-01-01T00:00:00",
  "endDate": "2025-03-31T23:59:59",
  "assignedTo": "John Doe",
  "progress": 0,
  "taskCount": 12
}
```

#### PUT /api/workplans/{id}
Update existing workplan

**Parameters:**
- `id` (path): Workplan ID (integer)

**Request:**
```json
{
  "title": "Updated Field Survey Q1 2025",
  "description": "Updated quarterly field survey operations",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "startDate": "2025-01-01T00:00:00",
  "endDate": "2025-03-31T23:59:59",
  "assignedTo": "Jane Smith",
  "progress": 75,
  "taskCount": 12
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Updated Field Survey Q1 2025",
  "description": "Updated quarterly field survey operations",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "startDate": "2025-01-01T00:00:00",
  "endDate": "2025-03-31T23:59:59",
  "assignedTo": "Jane Smith",
  "progress": 75,
  "taskCount": 12
}
```

#### DELETE /api/workplans/{id}
Delete workplan

**Parameters:**
- `id` (path): Workplan ID (integer)

**Response:**
```json
{
  "message": "Workplan deleted successfully"
}
```

---

### 🏭 PAC Operations Management

#### GET /api/pac-operations
Get all PAC operations

**Response:**
```json
[
  {
    "id": 1,
    "operationType": "INSPECTION",
    "facilityName": "Main Processing Plant",
    "facilityId": "MPP-001",
    "facilityAddress": "123 Industrial Ave, City, State",
    "operationDate": "2025-09-15T09:00:00",
    "status": "SCHEDULED",
    "priority": "HIGH",
    "inspector": "John Inspector",
    "notes": "Regular quarterly inspection"
  }
]
```

#### GET /api/pac-operations/{id}
Get PAC operation by ID

**Parameters:**
- `id` (path): PAC Operation ID (integer)

**Response:**
```json
{
  "id": 1,
  "operationType": "INSPECTION",
  "facilityName": "Main Processing Plant",
  "facilityId": "MPP-001",
  "facilityAddress": "123 Industrial Ave, City, State",
  "operationDate": "2025-09-15T09:00:00",
  "status": "SCHEDULED",
  "priority": "HIGH",
  "inspector": "John Inspector",
  "notes": "Regular quarterly inspection"
}
```

#### POST /api/pac-operations
Create new PAC operation

**Request:**
```json
{
  "operationType": "INSPECTION",
  "facilityName": "Main Processing Plant",
  "facilityId": "MPP-001",
  "facilityAddress": "123 Industrial Ave, City, State",
  "operationDate": "2025-09-15T09:00:00",
  "status": "SCHEDULED",
  "priority": "HIGH",
  "inspector": "John Inspector",
  "notes": "Regular quarterly inspection"
}
```

**Response:**
```json
{
  "id": 1,
  "operationType": "INSPECTION",
  "facilityName": "Main Processing Plant",
  "facilityId": "MPP-001",
  "facilityAddress": "123 Industrial Ave, City, State",
  "operationDate": "2025-09-15T09:00:00",
  "status": "SCHEDULED",
  "priority": "HIGH",
  "inspector": "John Inspector",
  "notes": "Regular quarterly inspection"
}
```

#### PUT /api/pac-operations/{id}
Update PAC operation

**Parameters:**
- `id` (path): PAC Operation ID (integer)

**Request:**
```json
{
  "operationType": "INSPECTION",
  "facilityName": "Main Processing Plant",
  "facilityId": "MPP-001",
  "facilityAddress": "123 Industrial Ave, City, State",
  "operationDate": "2025-09-15T14:00:00",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "inspector": "John Inspector",
  "notes": "Regular quarterly inspection - rescheduled to afternoon"
}
```

#### DELETE /api/pac-operations/{id}
Delete PAC operation

**Parameters:**
- `id` (path): PAC Operation ID (integer)

**Response:**
```json
{
  "message": "PAC operation deleted successfully"
}
```

---

### 🔧 PPS Operations Management

#### GET /api/pps-operations
Get all PPS operations

**Response:**
```json
[
  {
    "id": 1,
    "ppsName": "North District PPS",
    "location": "North Industrial District",
    "status": "OPERATIONAL",
    "capacity": 150,
    "lastInspection": "2025-08-15T10:00:00"
  }
]
```

#### GET /api/pps-operations/{id}
Get PPS operation by ID

**Parameters:**
- `id` (path): PPS Operation ID (integer)

**Response:**
```json
{
  "id": 1,
  "ppsName": "North District PPS",
  "location": "North Industrial District",
  "status": "OPERATIONAL",
  "capacity": 150,
  "lastInspection": "2025-08-15T10:00:00"
}
```

#### POST /api/pps-operations
Create new PPS operation

**Request:**
```json
{
  "ppsName": "South District PPS",
  "location": "South Industrial District",
  "status": "OPERATIONAL",
  "capacity": 200,
  "lastInspection": "2025-09-01T10:00:00"
}
```

**Response:**
```json
{
  "id": 2,
  "ppsName": "South District PPS",
  "location": "South Industrial District",
  "status": "OPERATIONAL",
  "capacity": 200,
  "lastInspection": "2025-09-01T10:00:00"
}
```

#### PUT /api/pps-operations/{id}
Update PPS operation

**Parameters:**
- `id` (path): PPS Operation ID (integer)

**Request:**
```json
{
  "ppsName": "North District PPS - Updated",
  "location": "North Industrial District",
  "status": "MAINTENANCE",
  "capacity": 175,
  "lastInspection": "2025-09-03T10:00:00"
}
```

#### DELETE /api/pps-operations/{id}
Delete PPS operation

**Parameters:**
- `id` (path): PPS Operation ID (integer)

**Response:**
```json
{
  "message": "PPS operation deleted successfully"
}
```

---

### ⚙️ General Operations Management

#### GET /api/operations
Get all operations

**Response:**
```json
[
  {
    "id": 1,
    "operationName": "Field Survey Operation",
    "operationType": "SURVEY",
    "status": "ACTIVE",
    "description": "Monthly field survey across all districts",
    "startDate": "2025-09-01T08:00:00",
    "endDate": "2025-09-30T18:00:00"
  }
]
```

#### GET /api/operations/{id}
Get operation by ID

**Parameters:**
- `id` (path): Operation ID (integer)

#### POST /api/operations
Create new operation

**Request:**
```json
{
  "operationName": "Emergency Response Operation",
  "operationType": "EMERGENCY",
  "status": "ACTIVE",
  "description": "Emergency response for facility incident",
  "startDate": "2025-09-03T12:00:00",
  "endDate": "2025-09-04T12:00:00"
}
```

#### PUT /api/operations/{id}
Update operation

#### DELETE /api/operations/{id}
Delete operation

---

## Error Handling

All endpoints return standard HTTP status codes:

- `200 OK` - Successful GET, PUT requests
- `201 Created` - Successful POST requests
- `204 No Content` - Successful DELETE requests
- `400 Bad Request` - Invalid request data
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

**Error Response Format:**
```json
{
  "timestamp": "2025-09-03T10:30:00.000+00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Validation failed for field 'title'",
  "path": "/api/workplans"
}
```

---

## Data Types and Validation

### Common Field Types
- **ID Fields**: Integer (auto-generated primary keys)
- **Text Fields**: String (required fields cannot be empty)
- **Date Fields**: ISO 8601 format (`2025-09-03T10:30:00`)
- **Status Fields**: Enum values (e.g., ACTIVE, COMPLETED, SCHEDULED)
- **Priority Fields**: Enum values (HIGH, MEDIUM, LOW)

### Status Enums
- **Workplan Status**: `ACTIVE`, `COMPLETED`, `PLANNED`, `IN_PROGRESS`, `CANCELLED`
- **PAC Operation Status**: `SCHEDULED`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`
- **PPS Status**: `OPERATIONAL`, `MAINTENANCE`, `OFFLINE`, `DECOMMISSIONED`
- **General Operation Status**: `ACTIVE`, `COMPLETED`, `PENDING`, `CANCELLED`

### Priority Levels
- `HIGH`: Critical priority operations
- `MEDIUM`: Standard priority operations  
- `LOW`: Non-critical operations

---

## Database Configuration

### H2 Database Console
- **URL**: `http://localhost:8090/h2-console`
- **JDBC URL**: `jdbc:h2:file:./backend-db`
- **Username**: `sa`
- **Password**: (leave empty)

### Connection Settings
```properties
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
```

---

## Testing Examples

### PowerShell Testing Scripts
```powershell
# Test Workplan Creation
$workplan = @{
    title = "Test Workplan"
    description = "Testing API"
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

# Test PAC Operation Creation
$pacOperation = @{
    operationType = "INSPECTION"
    facilityName = "Test Facility"
    facilityId = "TF-001"
    facilityAddress = "123 Test St"
    operationDate = "2025-09-15T09:00:00"
    status = "SCHEDULED"
    priority = "HIGH"
    inspector = "Test Inspector"
    notes = "Test inspection"
}

$response = Invoke-RestMethod -Uri "http://localhost:8090/api/pac-operations" -Method Post -Body ($pacOperation | ConvertTo-Json) -ContentType "application/json"
Write-Output $response
```

---

## Migration from Python Backend

To switch from Python Flask backend to Java Spring Boot:

1. **Update Frontend Configuration**:
   ```typescript
   // In src/app/services/api.service.ts
   private baseUrl = 'http://localhost:8090/api'; // Changed from 5001 to 8090
   ```

2. **Data Migration**: 
   - Export data from SQLite (Python backend)
   - Import into H2 database (Java backend)
   - Both use similar schema structures

3. **API Compatibility**:
   - Endpoint URLs remain consistent
   - JSON response formats are identical
   - HTTP methods and status codes unchanged

---

## Development Notes

### Spring Boot Features Used
- **Spring Data JPA**: For database operations
- **Spring Web**: For REST API endpoints  
- **H2 Database**: For development database
- **Spring Boot Actuator**: For health checks
- **CORS Configuration**: For cross-origin requests

### Auto-Generated Features
- **Primary Keys**: All entities use `@GeneratedValue` for auto-incrementing IDs
- **Database Schema**: Tables are auto-created from JPA entities
- **CRUD Operations**: Repository pattern provides automatic CRUD methods
- **JSON Serialization**: Automatic conversion between Java objects and JSON

### Port Configuration
- **Java Backend**: 8090 (configured in `application.properties`)
- **Angular Frontend**: 4300 (configured in `angular.json`)
- **H2 Console**: 8090 (same as backend)

This ensures no conflicts with existing Python backend running on port 5001.
