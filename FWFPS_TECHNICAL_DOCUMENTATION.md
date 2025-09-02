# FWFPS (Field Work Force Planning System) - Technical Documentation

## 📋 Executive Summary

The FWFPS application is a comprehensive full-stack web solution designed for field workforce planning and operations management. This proof-of-concept demonstrates a modern architecture using Angular frontend with Node.js/Express backend and SQLite database persistence.

**Architecture Overview:** Single Page Application (SPA) with RESTful API backend  
**Development Status:** Proof of Concept - Production Ready  
**Last Updated:** August 29, 2025

---

## 🏗️ System Architecture

### High-Level Architecture Diagram
```
┌─────────────────┐    HTTP/REST API    ┌─────────────────┐    SQL Queries    ┌─────────────────┐
│                 │   (Port 4200 →      │                 │   (In-Process)    │                 │
│  Angular        │    Port 3001)       │  Node.js        │ ← → SQLite      │  SQLite         │
│  Frontend       │ ← ─ ─ ─ ─ ─ ─ ─ ─ → │  Express        │   (fwfps.db)      │  Database       │
│  (SPA)          │                     │  Backend        │                   │                 │
└─────────────────┘                     └─────────────────┘                   └─────────────────┘
```

### Technology Stack

| Layer | Technology | Version | Purpose |
|-------|------------|---------|---------|
| **Frontend** | Angular | ~18.2.0 | Single Page Application Framework |
| **UI Framework** | Bootstrap | 5.3.x | Responsive Design & Components |
| **Icons** | Font Awesome | 6.x | Icon Library |
| **Backend** | Node.js | 22.18.0 | JavaScript Runtime |
| **Web Framework** | Express.js | 4.19.2 | RESTful API Server |
| **Database** | SQLite | 3.x | Embedded SQL Database |
| **Authentication** | express-session | 1.18.0 | Session Management |
| **Security** | bcryptjs | 2.4.3 | Password Hashing |
| **CORS** | cors | 2.8.5 | Cross-Origin Resource Sharing |

---

## 🎨 Frontend Architecture

### Angular Application Structure

```
frontend/src/
├── app/
│   ├── app.config.ts                 # Application configuration
│   ├── app.routes.ts                 # Main routing configuration
│   ├── app.component.{ts,html,css}   # Root application component
│   │
│   ├── auth/                         # Authentication module
│   │   ├── auth-routing.module.ts    # Auth-specific routes
│   │   ├── auth.module.ts            # Authentication module
│   │   └── components/login/         # Login component
│   │
│   ├── home/                         # Home module structure
│   │   └── components/
│   │       ├── dashboard/            # Dashboard component
│   │       └── home/                 # Home landing component
│   │
│   ├── modules/                      # Core business modules
│   │   ├── dashboard/                # System dashboard
│   │   ├── home/                     # Home module
│   │   ├── model/                    # Data modeling module
│   │   ├── pac/                      # PAC operations module
│   │   └── pps/                      # Program planning module
│   │
│   └── services/                     # Shared services
│       └── api.service.ts            # HTTP API service layer
│
├── environments/                     # Environment configurations
└── styles.css                       # Global application styles
```

### Key Frontend Components

#### 1. **PPS (Program Planning System) Module**
- **File**: `src/app/modules/pps/pps.component.ts`
- **Purpose**: Field work planning and program management
- **Features**:
  - Workplan CRUD operations
  - Dashboard with statistics
  - Export functionality
  - Real-time backend connectivity status

#### 2. **PAC (Personnel Activity Control) Module** 
- **File**: `src/app/modules/pac/pac.component.ts`
- **Purpose**: Field workforce operations management
- **Features**:
  - Operation management
  - Status tracking (Planned, Active, Completed, Cancelled)
  - Integration with PPS workplans
  - Detailed operation views

#### 3. **Model Module**
- **File**: `src/app/modules/model/model.component.ts`
- **Purpose**: Data modeling and analysis tools
- **Features**: 
  - Model creation and management
  - Data structure definitions
  - Analysis tools interface

#### 4. **Dashboard Module**
- **File**: `src/app/modules/dashboard/dashboard.component.ts`
- **Purpose**: System overview and metrics
- **Features**:
  - Key performance indicators
  - System health monitoring
  - Quick navigation hub

#### 5. **ApiService**
- **File**: `src/app/services/api.service.ts`
- **Purpose**: HTTP communication layer
- **Features**:
  - RESTful API calls to backend
  - Error handling and retry logic
  - Session management
  - Type-safe API responses

### Frontend Design Patterns

- **Modular Architecture**: Feature-based module organization
- **Service Layer Pattern**: Centralized API communication via ApiService
- **Component Communication**: @Input/@Output for parent-child data flow
- **Reactive Programming**: RxJS observables for async operations
- **Dependency Injection**: Angular's built-in DI container

---

## ⚙️ Backend Architecture

### Node.js Express Server Structure

```
node-backend/
├── app.js                    # Main application entry point
├── package.json              # Dependencies and scripts
├── fwfps.db                  # SQLite database file
│
├── config/
│   └── database.js           # Database configuration and initialization
│
└── routes/
    ├── auth.js               # Authentication endpoints
    ├── pac.js                # PAC operations endpoints  
    └── workplans.js          # Workplan management endpoints
```

### API Endpoints Documentation

#### Authentication Endpoints
```http
POST   /api/auth/login        # User authentication
POST   /api/auth/logout       # Session termination
GET    /api/auth/profile      # Current user profile
```

#### System Health
```http
GET    /api/health            # System health check
```

#### Workplan Management
```http
GET    /api/workplans         # List all workplans
POST   /api/workplans         # Create new workplan  
PUT    /api/workplans/:id     # Update workplan
DELETE /api/workplans/:id     # Delete workplan
GET    /api/workplans/dashboard # Workplan statistics
```

#### PAC Operations
```http
GET    /api/pac/operations    # List all operations
POST   /api/pac/operations    # Create new operation
PUT    /api/pac/operations/:id # Update operation
DELETE /api/pac/operations/:id # Delete operation
GET    /api/pac/dashboard     # PAC statistics
```

### Database Schema

#### Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

#### Workplans Table
```sql  
CREATE TABLE workplans (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'draft',
    created_by INTEGER,
    start_date DATE,
    end_date DATE,
    budget DECIMAL(10,2),
    priority TEXT DEFAULT 'medium',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
);
```

#### PAC Operations Table
```sql
CREATE TABLE pac_operations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    workplan_id INTEGER,
    operation_name TEXT NOT NULL,
    operation_type TEXT NOT NULL,
    status TEXT DEFAULT 'planned',
    target_species TEXT,
    location TEXT,
    estimated_cost DECIMAL(10,2),
    actual_cost DECIMAL(10,2),
    start_date DATE,
    end_date DATE,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (workplan_id) REFERENCES workplans(id)
);
```

### Backend Security Features

- **Password Hashing**: bcryptjs with salt rounds
- **Session Management**: Express-session with secure configuration
- **CORS Protection**: Configured for specific origins
- **Input Validation**: Request parameter validation
- **SQL Injection Prevention**: Parameterized queries

---

## 🔧 Development Environment

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher  
- Angular CLI 18.x
- Modern web browser (Chrome, Firefox, Edge)

### Installation & Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd my-angular-springboot-app
```

2. **Backend Setup**
```bash
cd node-backend
npm install
node app.js
# Server starts on http://localhost:3001
```

3. **Frontend Setup**
```bash  
cd frontend
npm install
npm start
# Application opens on http://localhost:4200
```

### Environment Configuration

#### Backend Environment Variables
```javascript
// Default configuration in app.js
PORT=3001
NODE_ENV=development
SESSION_SECRET=fwfps-session-secret
DB_PATH=./fwfps.db
```

#### Frontend Environment
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3001/api'
};
```

---

## 🚀 Deployment Architecture

### Production Deployment Options

#### Option 1: Traditional Server Deployment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Nginx         │    │   Node.js       │    │   SQLite        │
│   (Port 80/443) │────┤   (Port 3001)   │────┤   Database      │
│   Static Files  │    │   API Server    │    │   File System   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

#### Option 2: Containerized Deployment
```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["node", "app.js"]

# Frontend Dockerfile  
FROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
```

### Scalability Considerations

- **Database**: Migrate from SQLite to PostgreSQL/MySQL for production
- **Backend**: Implement clustering with PM2 or similar
- **Frontend**: CDN deployment for static assets
- **Caching**: Redis for session storage and API caching
- **Load Balancing**: Nginx or AWS ALB for multiple backend instances

---

## 📊 Performance Metrics

### Current Performance Characteristics

| Metric | Value | Notes |
|--------|-------|--------|
| **Frontend Bundle Size** | 932.72 kB | Compressed production build |
| **API Response Time** | < 50ms | Local SQLite queries |
| **Database Size** | ~50 KB | With sample data |
| **Memory Usage** | ~50 MB | Node.js backend |
| **Startup Time** | ~2 seconds | Both frontend and backend |

### Optimization Strategies

1. **Frontend Optimizations**
   - Lazy loading of feature modules
   - Tree-shaking for unused dependencies
   - Service worker for offline capability
   - Image optimization and compression

2. **Backend Optimizations**
   - Database query optimization
   - Response caching mechanisms
   - Connection pooling
   - Compression middleware

---

## 🔒 Security Implementation

### Current Security Measures

1. **Authentication & Authorization**
   - Session-based authentication
   - Password hashing with bcryptjs
   - Role-based access control (planned)

2. **Data Protection**
   - Input validation on all endpoints
   - SQL injection prevention
   - XSS protection through Angular sanitization
   - CORS configuration

3. **Session Security**
   - Secure session cookies
   - Session timeout implementation
   - CSRF protection (to be implemented)

### Security Recommendations for Production

- Implement HTTPS/TLS encryption
- Add rate limiting and request throttling
- Implement JWT tokens for stateless authentication
- Add API documentation with Swagger/OpenAPI
- Regular security audits and dependency updates

---

## 🧪 Testing Strategy

### Current Testing Infrastructure

1. **Manual Testing Tools**
   - Backend API test page (`backend-test.html`)
   - Health check endpoints
   - Browser developer tools

2. **Recommended Testing Approach**
```
Testing Pyramid:
├── Unit Tests (70%)
│   ├── Angular components (Jasmine/Karma)
│   └── Node.js API endpoints (Jest/Mocha)
├── Integration Tests (20%)
│   ├── API integration tests
│   └── Database integration tests  
└── E2E Tests (10%)
    └── Cypress/Playwright full user flows
```

---

## 📈 Future Enhancements

### Phase 2 Development Roadmap

1. **Enhanced Authentication**
   - Multi-factor authentication
   - Active Directory integration
   - Role-based permissions

2. **Advanced Features**
   - Real-time notifications
   - File upload capabilities
   - Advanced reporting and analytics
   - Mobile responsive improvements

3. **DevOps & Monitoring**
   - CI/CD pipeline setup
   - Application monitoring (APM)
   - Logging and error tracking
   - Automated backups

4. **Performance Enhancements**
   - Database optimization
   - Caching layer implementation
   - Load balancing configuration

---

## 🏃‍♂️ Quick Start Guide

### For Developers

1. **Start Backend**:
```bash
cd node-backend && node app.js
```

2. **Start Frontend**:
```bash
cd frontend && npm start
```

3. **Test Integration**:
   - Open `http://localhost:4200` for Angular app
   - Open `backend-test.html` for API testing

### For Architects

1. **Architecture Review**: Review the system architecture diagram above
2. **Security Assessment**: Evaluate security implementations section
3. **Scalability Planning**: Consider deployment architecture options
4. **Integration Points**: Review API documentation for system integration

---

## 📞 Support & Contact

### Development Team
- **Lead Developer**: [Developer Name]
- **Architecture Review**: [Architect Name]  
- **Project Repository**: [Repository URL]

### Documentation Version
- **Version**: 1.0.0
- **Last Updated**: August 29, 2025
- **Review Date**: [Next Review Date]

---

## 📚 Appendices

### A. Complete API Reference
[Detailed API documentation with request/response examples]

### B. Database Migration Scripts  
[SQL scripts for database setup and migrations]

### C. Deployment Checklist
[Step-by-step production deployment guide]

### D. Troubleshooting Guide
[Common issues and resolution steps]

---

*This documentation represents the current state of the FWFPS application as of August 29, 2025. For the most up-to-date information, please refer to the project repository and codebase.*
