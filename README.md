# FWFPS - Field Work Force Planning System

## 🚀 Project Overview

FWFPS (Field Work Force Planning System) is a comprehensive full-stack web application designed for managing field work operations, workplan scheduling, and PAC (Post-Approval Change) operations. The system provides a modern, responsive interface for efficient workforce planning and management.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Angular 17+ with TypeScript
- **Backend**: Python Flask with SQLAlchemy ORM
- **Database**: SQLite for development (easily scalable to PostgreSQL/MySQL)
- **Authentication**: Session-based with password hashing
- **API**: RESTful APIs with CORS support

### Project Structure
```
my-angular-springboot-app/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/        # Authentication components
│   │   │   ├── home/        # Home module
│   │   │   ├── modules/     # Feature modules
│   │   │   │   ├── dashboard/
│   │   │   │   ├── home/
│   │   │   │   ├── pac/
│   │   │   │   └── pps/
│   │   │   └── services/    # API services
│   │   └── environments/
├── python-backend/          # Flask API server
│   ├── app_simple.py       # Main Flask application
│   ├── fwfps.db           # SQLite database
│   ├── models/            # Database models
│   └── routes/            # API route handlers
└── test_api.py            # API testing script
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 18+
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd my-angular-springboot-app
```

### 2. Backend Setup (Python Flask)
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

### 3. Frontend Setup (Angular)
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
ng serve
```

The Angular app will be available at `http://localhost:4200`

## 📊 Database Schema

### Users Table
- `id`: Primary key
- `username`: Unique username
- `password_hash`: Encrypted password
- `email`: User email
- `full_name`: User's full name
- `role`: User role (admin, analyst, inspector)
- `department`: User department
- `is_active`: Account status
- `created_at`, `last_login`: Timestamps

### Workplans Table
- `id`: Primary key
- `title`: Workplan title
- `description`: Detailed description
- `status`: Current status (active, completed, planned)
- `priority`: Priority level (high, medium, low)
- `start_date`, `end_date`: Date range
- `assigned_to`: Assigned user
- `progress`: Completion percentage
- `task_count`: Number of tasks

### PAC Operations Table
- `id`: Primary key
- `operation_type`: Type of operation
- `facility_name`: Target facility
- `facility_id`: Facility identifier
- `facility_address`: Facility location
- `operation_date`: Scheduled date
- `status`: Operation status
- `priority`: Priority level
- `inspector`: Assigned inspector
- `notes`: Additional notes

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - User logout

### Workplans
- `GET /api/workplans` - List all workplans
- `GET /api/workplans/dashboard` - Dashboard statistics
- `POST /api/workplans` - Create new workplan
- `PUT /api/workplans/:id` - Update workplan
- `DELETE /api/workplans/:id` - Delete workplan

### PAC Operations
- `GET /api/pac/operations` - List PAC operations
- `POST /api/pac/operations` - Create PAC operation
- `PUT /api/pac/operations/:id` - Update operation
- `DELETE /api/pac/operations/:id` - Delete operation

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