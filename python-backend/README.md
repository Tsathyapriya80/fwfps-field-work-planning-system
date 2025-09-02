# FWFPS Python Backend with SQLite

A RESTful API backend for the FDA Food and Warehousing Food Production Scheduling (FWFPS) system built with Flask and SQLite.

## Features

- **Authentication System**: User login/logout with session management
- **Workplan Management**: CRUD operations for workplans and tasks
- **PAC Operations**: Program and Consumer Safety operations management
- **SQLite Database**: Lightweight database with sample data
- **RESTful APIs**: Clean API endpoints with proper HTTP methods
- **CORS Support**: Cross-origin requests for Angular frontend

## Installation

1. Create virtual environment:
```bash
python -m venv venv
venv\Scripts\activate  # Windows
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

The server will start at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout  
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/users` - Get all users
- `POST /api/auth/register` - Register new user

### Workplans
- `GET /api/workplans/` - Get all workplans
- `GET /api/workplans/{id}` - Get specific workplan
- `POST /api/workplans/` - Create new workplan
- `PUT /api/workplans/{id}` - Update workplan
- `DELETE /api/workplans/{id}` - Delete workplan
- `GET /api/workplans/{id}/tasks` - Get workplan tasks
- `POST /api/workplans/{id}/tasks` - Create workplan task
- `GET /api/workplans/dashboard` - Get dashboard statistics

### PAC Operations
- `GET /api/pac/operations` - Get all operations
- `GET /api/pac/operations/{id}` - Get specific operation
- `POST /api/pac/operations` - Create new operation
- `PUT /api/pac/operations/{id}` - Update operation
- `DELETE /api/pac/operations/{id}` - Delete operation
- `GET /api/pac/operations/{id}/samples` - Get operation samples
- `POST /api/pac/operations/{id}/samples` - Create sample
- `GET /api/pac/dashboard` - Get PAC dashboard statistics
- `GET /api/pac/types` - Get operation types
- `GET /api/pac/statuses` - Get status options
- `GET /api/pac/priorities` - Get priority levels

### Health Check
- `GET /api/health` - API health status

## Database Schema

### Users
- Basic user authentication and profile information
- Roles: admin, analyst, inspector, user

### Workplans
- Project management with status tracking
- Associated tasks with progress monitoring
- Date ranges and assignments

### PAC Operations
- Inspection, sampling, audit, investigation operations
- Facility information and compliance tracking
- Sample collection and testing results

## Sample Data

The application automatically creates sample data on first run:
- Demo users (admin/admin123, analyst/analyst123)
- Sample workplans with various statuses
- PAC operations across different types

## Configuration

- Database: SQLite file (`fwfps.db`)
- CORS: Configured for Angular frontend on port 4200
- Session: Simple session-based authentication

## Development

The backend is designed to work with the existing Angular frontend while providing real database persistence instead of mock data.

## Security Note

This is a demo implementation. In production, implement proper:
- JWT token authentication
- Password hashing validation
- API rate limiting
- Input sanitization
- HTTPS enforcement
