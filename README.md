# FWFPS - Field Work Force Planning System

## 🚀 Project Overview

FWFPS (Field Work Force Planning System) is a comprehensive full-stack web application designed for managing field work operations, workplan scheduling, and PAC (Post-Approval Change) operations. The system provides a modern, responsive interface for efficient workforce planning and management.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Angular 18+ with TypeScript
- **Backend Options**: 
  - **Java Spring Boot** with JPA/Hibernate (Primary - Port 8090)
  - **Python Flask** with SQLAlchemy ORM (Alternative - Port 5001)
- **Database**: H2 Database (Java), SQLite (Python)
- **Authentication**: Session-based with password hashing
- **API**: RESTful APIs with CORS support

### Project Structure
```
fwfps-java-version/
├── frontend/                 # Angular application (Port 4300)
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── home/        # Home module
│   │   │   ├── modules/     # Feature modules
│   │   │   │   ├── dashboard/
│   │   │   │   ├── home/
│   │   │   │   ├── pac/
│   │   │   │   ├── model/
│   │   │   │   └── pps/
│   │   │   └── services/    # API services
│   │   └── environments/
├── backend/                 # Java Spring Boot API server (Port 8090)
│   ├── src/main/java/com/example/backend/
│   │   ├── BackendApplication.java  # Main Spring Boot application
│   │   ├── config/         # Configuration classes
│   │   ├── controller/     # REST controllers
│   │   ├── entity/        # JPA entities
│   │   └── repository/    # JPA repositories
│   ├── src/main/resources/
│   │   └── application.properties  # Application configuration
│   └── pom.xml            # Maven configuration
├── python-backend/          # Flask API server (Alternative - Port 5001)
│   ├── app_simple.py       # Main Flask application
│   ├── fwfps.db           # SQLite database
│   ├── models/            # Database models
│   └── routes/            # API route handlers
├── node-backend/           # Node.js API server (Alternative)
└── test_api.py            # API testing script
```

## 🛠️ Setup Instructions

### Prerequisites
- Java 11+ (for Spring Boot backend)
- Maven 3.6+ (for Java build)
- Python 3.8+ (for alternative Python backend)
- Node.js 18+
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd fwfps-java-version
```

### 2. Backend Setup (Java Spring Boot - Primary)
```bash
# Navigate to Java backend directory
cd backend

# Build and run with Maven
mvn clean install
mvn spring-boot:run

# Alternative: Run the JAR directly
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The Spring Boot server will start on `http://localhost:8090`

**H2 Database Console:** `http://localhost:8090/h2-console`
- JDBC URL: `jdbc:h2:file:./backend-db`
- User: `sa`
- Password: (leave empty)

### 3. Backend Setup (Python Flask - Alternative)
```bash
# Create virtual environment
python -m venv .venv

# Activate virtual environment (Windows)
.venv\Scripts\activate

# Install dependencies
pip install flask flask-sqlalchemy flask-cors flask-marshmallow bcrypt requests

# Navigate to backend directory
cd python-backend

# Run the Flask server
python app_simple.py
```

The Flask server will start on `http://127.0.0.1:5001`

### 4. Frontend Setup (Angular)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server (configured for Java backend)
ng serve --port 4300
```

The Angular app will be available at `http://localhost:4300`

**Note:** Frontend is configured to use Java backend by default. To switch to Python backend, update `baseUrl` in `src/app/services/api.service.ts`

## 📊 Database Schema

The application supports dual database backends:

### Java Spring Boot (H2 Database)
Auto-generated JPA entities with the following structure:

**Users Table (AUTO-GENERATED)**
- `id`: Primary key (auto-generated)
- `username`: Unique username
- `password_hash`: Encrypted password  
- `email`: User email
- `full_name`: User's full name
- `role`: User role (admin, analyst, inspector)
- `department`: User department
- `is_active`: Account status
- `created_at`, `last_login`: Timestamps

**Workplans Table (AUTO-GENERATED)**
- `id`: Primary key (auto-generated)
- `title`: Workplan title
- `description`: Detailed description
- `status`: Current status (active, completed, planned)
- `priority`: Priority level (high, medium, low)
- `start_date`, `end_date`: Date range
- `assigned_to`: Assigned user
- `progress`: Completion percentage
- `task_count`: Number of tasks

**PAC Operations Table (AUTO-GENERATED)**
- `id`: Primary key (auto-generated)
- `operation_type`: Type of operation
- `facility_name`: Target facility
- `facility_id`: Facility identifier
- `facility_address`: Facility location
- `operation_date`: Scheduled date
- `status`: Operation status
- `priority`: Priority level
- `inspector`: Assigned inspector
- `notes`: Additional notes

**PPS Operations Table (AUTO-GENERATED)**
- `id`: Primary key (auto-generated)
- `pps_name`: PPS facility name
- `location`: Facility location
- `status`: Operational status
- `capacity`: Facility capacity
- `last_inspection`: Last inspection date

### Python Flask (SQLite Database)
Manual schema creation with similar structure (see python-backend documentation).

## 🔧 API Endpoints

### Java Spring Boot Backend (Port 8090)
All endpoints follow REST conventions with auto-generated CRUD operations:

**Authentication**
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

**Workplans**
- `GET /api/workplans` - List all workplans
- `GET /api/workplans/{id}` - Get workplan by ID
- `POST /api/workplans` - Create new workplan
- `PUT /api/workplans/{id}` - Update workplan
- `DELETE /api/workplans/{id}` - Delete workplan

**PAC Operations**
- `GET /api/pac-operations` - List PAC operations
- `GET /api/pac-operations/{id}` - Get PAC operation by ID
- `POST /api/pac-operations` - Create PAC operation
- `PUT /api/pac-operations/{id}` - Update operation
- `DELETE /api/pac-operations/{id}` - Delete operation

**PPS Operations**
- `GET /api/pps-operations` - List PPS operations
- `GET /api/pps-operations/{id}` - Get PPS operation by ID
- `POST /api/pps-operations` - Create PPS operation
- `PUT /api/pps-operations/{id}` - Update operation
- `DELETE /api/pps-operations/{id}` - Delete operation

**Operations**
- `GET /api/operations` - List all operations
- `GET /api/operations/{id}` - Get operation by ID
- `POST /api/operations` - Create operation
- `PUT /api/operations/{id}` - Update operation
- `DELETE /api/operations/{id}` - Delete operation

### System
- `GET /api/health` - Health check endpoint

## 🚀 Running the Application

### Development Mode
1. Start the Flask backend:
```bash
cd python-backend
python app_simple.py
```

2. Start the Angular frontend:
```bash
cd frontend
ng serve
```

3. Access the application at `http://localhost:4200`

### Test Credentials
- **Username**: `admin`
- **Password**: `admin123`

## 🧪 Testing

### Backend API Testing
A test script is provided to verify all API endpoints:
```bash
python test_api.py
```

### Manual Testing
- Health Check: `http://127.0.0.1:5001/api/health`
- Login with test credentials
- Navigate through dashboard, workplans, and PAC operations

## 📁 Database Management

### SQLite Database
The SQLite database (`fwfps.db`) contains sample data for development:
- 3 test users with different roles
- 3 sample workplans with various statuses
- 4 PAC operations with different priorities

### Viewing Database
Use VS Code with SQLite extension to browse database contents:
1. Install "SQLite" extension in VS Code
2. Open `python-backend/fwfps.db`
3. Explore tables and data

## 🔒 Security Features

- Password hashing using bcrypt
- Session-based authentication
- CORS protection
- Input validation and sanitization
- SQL injection prevention through ORM

## 🚀 Deployment Considerations

### Production Setup
- Use PostgreSQL or MySQL instead of SQLite
- Configure environment variables for secrets
- Use production WSGI server (Gunicorn, uWSGI)
- Implement proper logging and monitoring
- Add SSL/TLS encryption
- Set up reverse proxy (Nginx)

### Environment Variables
Create `.env` file for production:
```
FLASK_ENV=production
DATABASE_URL=postgresql://user:pass@host:port/dbname
SECRET_KEY=your-secret-key
```

## 📈 Future Enhancements

- [ ] Real-time notifications
- [ ] File upload/attachment support
- [ ] Advanced reporting and analytics
- [ ] Mobile responsive improvements
- [ ] Integration with external calendar systems
- [ ] Role-based permission system
- [ ] Email notification system
- [ ] Audit logging
- [ ] Data export functionality
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions, please contact the development team or create an issue in the repository.