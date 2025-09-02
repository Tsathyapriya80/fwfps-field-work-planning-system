# FWFPS API Documentation

## Base URL
```
Development: http://localhost:3001/api
Production: https://your-domain.com/api
```

## Authentication
All API endpoints (except health check) require session-based authentication.

### Login Required
Session cookie must be present in requests. Obtain by calling `/auth/login`.

---

## API Endpoints Reference

### 🏥 Health & Status

#### GET /health
System health check - **No authentication required**

**Response:**
```json
{
  "status": "healthy",
  "message": "FWFPS Field Work Force Planning System Backend API is running",
  "timestamp": "2025-08-29T15:21:11.848Z",
  "version": "1.0.0"
}
```

---

### 🔐 Authentication

#### POST /auth/login
User authentication

**Request:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@fwfps.gov",
    "role": "admin"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

#### POST /auth/logout
End user session

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### GET /auth/profile
Get current user profile

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@fwfps.gov",
    "role": "admin",
    "created_at": "2025-08-29T10:00:00.000Z"
  }
}
```

---

### 📊 Workplans Management

#### GET /workplans
List all workplans

**Response:**
```json
{
  "success": true,
  "workplans": [
    {
      "id": 1,
      "title": "Northern Region Wildlife Survey 2025",
      "description": "Comprehensive wildlife population assessment for northern regions",
      "status": "active",
      "created_by": 1,
      "start_date": "2025-03-01",
      "end_date": "2025-09-30",
      "budget": 125000.00,
      "priority": "high",
      "created_at": "2025-01-15T08:00:00.000Z",
      "updated_at": "2025-01-15T08:00:00.000Z"
    }
  ]
}
```

#### POST /workplans
Create new workplan

**Request:**
```json
{
  "title": "New Survey Project",
  "description": "Description of the project",
  "status": "draft",
  "start_date": "2025-04-01",
  "end_date": "2025-10-31",
  "budget": 75000.00,
  "priority": "medium"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workplan created successfully",
  "workplan": {
    "id": 4,
    "title": "New Survey Project",
    "created_by": 1,
    "created_at": "2025-08-29T15:30:00.000Z"
  }
}
```

#### PUT /workplans/:id
Update existing workplan

**Request:**
```json
{
  "title": "Updated Project Title",
  "status": "active",
  "budget": 85000.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Workplan updated successfully"
}
```

#### DELETE /workplans/:id
Delete workplan

**Response:**
```json
{
  "success": true,
  "message": "Workplan deleted successfully"
}
```

#### GET /workplans/dashboard
Get workplan dashboard statistics

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "total_workplans": 3,
    "active_workplans": 2,
    "total_budget": 350000.00,
    "active_budget": 250000.00,
    "status_breakdown": {
      "active": 2,
      "draft": 1,
      "completed": 0
    },
    "priority_breakdown": {
      "high": 1,
      "medium": 1,
      "low": 1
    }
  }
}
```

---

### 🔍 PAC Operations

#### GET /pac/operations
List all PAC operations

**Response:**
```json
{
  "success": true,
  "operations": [
    {
      "id": 1,
      "workplan_id": 1,
      "operation_name": "Deer Population Control - Zone A",
      "operation_type": "Population Control",
      "status": "active",
      "target_species": "White-tailed Deer",
      "location": "Northern Forest Reserve - Zone A",
      "estimated_cost": 25000.00,
      "actual_cost": 23500.00,
      "start_date": "2025-03-15",
      "end_date": "2025-05-15",
      "notes": "Focus on overpopulated areas near agricultural zones",
      "created_at": "2025-02-01T09:00:00.000Z",
      "updated_at": "2025-03-20T14:30:00.000Z"
    }
  ]
}
```

#### POST /pac/operations
Create new PAC operation

**Request:**
```json
{
  "workplan_id": 1,
  "operation_name": "Bear Monitoring Survey",
  "operation_type": "Population Assessment",
  "status": "planned",
  "target_species": "Black Bear",
  "location": "Eastern Mountain Range",
  "estimated_cost": 15000.00,
  "start_date": "2025-06-01",
  "end_date": "2025-08-31",
  "notes": "Annual bear population count and tracking"
}
```

**Response:**
```json
{
  "success": true,
  "message": "PAC operation created successfully",
  "operation": {
    "id": 5,
    "operation_name": "Bear Monitoring Survey",
    "created_at": "2025-08-29T15:45:00.000Z"
  }
}
```

#### PUT /pac/operations/:id
Update PAC operation

**Request:**
```json
{
  "status": "completed",
  "actual_cost": 14750.00,
  "notes": "Survey completed successfully. 47 bears counted."
}
```

**Response:**
```json
{
  "success": true,
  "message": "PAC operation updated successfully"
}
```

#### DELETE /pac/operations/:id
Delete PAC operation

**Response:**
```json
{
  "success": true,
  "message": "PAC operation deleted successfully"
}
```

#### GET /pac/dashboard
Get PAC operations dashboard statistics

**Response:**
```json
{
  "success": true,
  "dashboard": {
    "total_operations": 4,
    "active_operations": 2,
    "completed_operations": 1,
    "total_estimated_cost": 95000.00,
    "total_actual_cost": 78500.00,
    "status_breakdown": {
      "planned": 1,
      "active": 2,
      "completed": 1,
      "cancelled": 0
    },
    "operation_types": {
      "Population Assessment": 2,
      "Population Control": 1,
      "Habitat Management": 1
    },
    "species_breakdown": {
      "White-tailed Deer": 1,
      "Elk": 1,
      "Black Bear": 1,
      "Various": 1
    }
  }
}
```

---

## Error Responses

### Standard Error Format
```json
{
  "success": false,
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE",
  "timestamp": "2025-08-29T15:50:00.000Z"
}
```

### Common HTTP Status Codes

| Status | Meaning | Example Response |
|--------|---------|------------------|
| **200** | Success | Request completed successfully |
| **201** | Created | Resource created successfully |
| **400** | Bad Request | Invalid request parameters |
| **401** | Unauthorized | Authentication required |
| **403** | Forbidden | Access denied |
| **404** | Not Found | Resource not found |
| **500** | Internal Server Error | Server error occurred |

### Error Examples

#### 401 Unauthorized
```json
{
  "success": false,
  "error": "Authentication required. Please log in.",
  "code": "AUTH_REQUIRED"
}
```

#### 404 Not Found
```json
{
  "success": false,
  "error": "Workplan with ID 999 not found",
  "code": "RESOURCE_NOT_FOUND"
}
```

#### 400 Bad Request
```json
{
  "success": false,
  "error": "Validation failed: title is required",
  "code": "VALIDATION_ERROR"
}
```

---

## Data Models

### User
```typescript
interface User {
  id: number;
  username: string;
  email: string;
  password: string;  // Hashed
  role: 'admin' | 'user';
  created_at: string;
}
```

### Workplan
```typescript
interface Workplan {
  id: number;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  created_by: number;
  start_date?: string;
  end_date?: string;
  budget?: number;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
  updated_at: string;
}
```

### PAC Operation
```typescript
interface PacOperation {
  id: number;
  workplan_id?: number;
  operation_name: string;
  operation_type: string;
  status: 'planned' | 'active' | 'completed' | 'cancelled';
  target_species?: string;
  location?: string;
  estimated_cost?: number;
  actual_cost?: number;
  start_date?: string;
  end_date?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}
```

---

## Testing

### Using curl
```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  -c cookies.txt

# Get workplans (using saved cookies)
curl http://localhost:3001/api/workplans -b cookies.txt
```

### Using JavaScript/Fetch
```javascript
// Login
const response = await fetch('http://localhost:3001/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include',
  body: JSON.stringify({
    username: 'admin',
    password: 'admin123'
  })
});

// Get workplans
const workplans = await fetch('http://localhost:3001/api/workplans', {
  credentials: 'include'
});
```

---

## Sample Data

The database comes pre-loaded with sample data:

### Default Users
- **Username**: `admin`, **Password**: `admin123` (Admin role)
- **Username**: `user1`, **Password**: `user123` (User role)

### Sample Workplans
- Northern Region Wildlife Survey 2025 (Active)
- Coastal Ecosystem Monitoring Project (Active)
- Mountain Region Biodiversity Study (Draft)

### Sample PAC Operations
- Deer Population Control - Zone A (Active)
- Elk Habitat Restoration (Planned)
- Coastal Bird Survey (Completed)
- Bear Monitoring Program (Active)

---

*This API documentation is current as of August 29, 2025. For the most up-to-date information, refer to the application source code.*
