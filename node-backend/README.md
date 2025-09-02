# Node.js Backend for FWFPS

A RESTful API backend for the FDA Food and Warehousing Food Production Scheduling (FWFPS) system built with Node.js, Express, and SQLite.

## Features

- **RESTful APIs**: Clean API endpoints following REST principles
- **SQLite Database**: Lightweight, file-based database perfect for development
- **Authentication**: Session-based authentication with bcrypt password hashing
- **CORS Support**: Configured for Angular frontend on port 4200
- **Comprehensive Models**: Users, Workplans, Tasks, PAC Operations, and Samples
- **Sample Data**: Pre-loaded with realistic demo data

## Installation

1. Navigate to the node-backend directory:
```bash
cd node-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```
Or for production:
```bash
npm start
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
- `GET /api/workplans/` - Get all workplans (with filtering)
- `GET /api/workplans/:id` - Get specific workplan
- `POST /api/workplans/` - Create new workplan
- `PUT /api/workplans/:id` - Update workplan
- `DELETE /api/workplans/:id` - Delete workplan
- `GET /api/workplans/:id/tasks` - Get workplan tasks
- `POST /api/workplans/:id/tasks` - Create workplan task
- `GET /api/workplans/dashboard` - Get dashboard statistics

### PAC Operations
- `GET /api/pac/operations` - Get all operations (with filtering)
- `GET /api/pac/operations/:id` - Get specific operation
- `POST /api/pac/operations` - Create new operation
- `PUT /api/pac/operations/:id` - Update operation
- `DELETE /api/pac/operations/:id` - Delete operation
- `GET /api/pac/operations/:id/samples` - Get operation samples
- `POST /api/pac/operations/:id/samples` - Create sample
- `GET /api/pac/dashboard` - Get PAC dashboard statistics
- `GET /api/pac/types` - Get operation types
- `GET /api/pac/statuses` - Get status options
- `GET /api/pac/priorities` - Get priority levels

### Health Check
- `GET /api/health` - API health status

## Database Schema

The SQLite database automatically creates tables for:

- **users** - User authentication and profiles
- **workplans** - Project management with status tracking
- **workplan_tasks** - Tasks associated with workplans
- **pac_operations** - PAC operations (inspections, samplings, audits)
- **pac_samples** - Sample collection and testing data

## Sample Data

On first run, the database is automatically populated with:
- Demo users: `admin/admin123` and `analyst/analyst123`
- Sample workplans with various statuses
- PAC operations across different types and facilities
- Realistic facility names and inspection data

## Configuration

Environment variables (`.env` file):
- `NODE_ENV` - development/production
- `PORT` - Server port (default: 5000)
- `SESSION_SECRET` - Session encryption key
- `CORS_ORIGIN` - Allowed CORS origin

## Development vs Production

**Development Features:**
- Detailed error messages
- SQLite database file
- Session-based authentication
- Sample data auto-initialization

**Production Considerations:**
- Implement JWT authentication
- Use PostgreSQL or MySQL
- Add rate limiting
- Enable HTTPS
- Add input validation middleware
- Implement proper logging

## Integration with Angular

This backend is designed to replace mock data in your Angular frontend. The API endpoints match the expected data structures and provide real database persistence.

## Demo Safety

Your current working Angular application is safely backed up in the `FWFPS-BACKUP-DEMO` directory. The backend integration will be gradual to ensure your 1 PM demo remains functional.
