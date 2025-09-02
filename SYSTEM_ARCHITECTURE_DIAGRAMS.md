# FWFPS System Architecture Diagrams

## System Overview Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            FWFPS APPLICATION ECOSYSTEM                      │
│                         Field Work Force Planning System                    │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    HTTP Requests     ┌─────────────────┐    SQL Queries    ┌─────────────────┐
│                 │   (localhost:4200    │                 │   (SQLAlchemy)    │                 │
│   ANGULAR       │    → 127.0.0.1:5001) │   PYTHON        │ ←──────────────→  │   SQLITE        │
│   FRONTEND      │ ←──────────────────→  │   FLASK         │                   │   DATABASE      │
│                 │    JSON/REST API     │   BACKEND       │                   │                 │
│                 │                      │                 │                   │                 │
│ • UI Components │                      │ • REST Routes   │                   │ • users         │
│ • Services      │                      │ • Authentication│                   │ • workplans     │
│ • Routing       │                      │ • Business Logic│                   │ • pac_operations│
│ • State Mgmt    │                      │ • SQLAlchemy    │                   │                 │
└─────────────────┘                      └─────────────────┘                   └─────────────────┘
```

## Detailed Component Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND LAYER                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │     PPS     │  │     PAC     │  │    MODEL    │  │ DASHBOARD   │         │
│  │   Module    │  │   Module    │  │   Module    │  │   Module    │         │
│  │             │  │             │  │             │  │             │         │
│  │ • Workplans │  │ • Operations│  │ • Data      │  │ • Overview  │         │
│  │ • Planning  │  │ • Personnel │  │   Models    │  │ • Metrics   │         │
│  │ • Export    │  │ • Tracking  │  │ • Analysis  │  │ • Status    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘         │
│          │                │                │                │               │
│          └────────────────┼────────────────┼────────────────┘               │
│                           │                │                                │
│  ┌─────────────────────────┼────────────────┼──────────────────────────────┐ │
│  │                    API SERVICE LAYER                                    │ │
│  │                         │                │                              │ │
│  │  ┌──────────────────────▼────────────────▼────────────────────────────┐ │ │
│  │  │                     HTTP CLIENT                                    │ │ │
│  │  │  • Authentication  • Workplans API  • PAC API  • Dashboard API    │ │ │
│  │  │  • Error Handling  • Session Management  • Type Safety           │ │ │
│  │  └─────────────────────────────────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ HTTP/REST API
                                       │ JSON Payloads
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                            EXPRESS.JS SERVER                           │ │
│  │                                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │ │
│  │  │    AUTH     │  │  WORKPLANS  │  │     PAC     │  │   HEALTH    │     │ │
│  │  │   ROUTES    │  │   ROUTES    │  │   ROUTES    │  │   ROUTES    │     │ │
│  │  │             │  │             │  │             │  │             │     │ │
│  │  │ • /login    │  │ • GET /     │  │ • GET /ops  │  │ • GET /     │     │ │
│  │  │ • /logout   │  │ • POST /    │  │ • POST /ops │  │ • System    │     │ │
│  │  │ • /profile  │  │ • PUT /:id  │  │ • PUT /:id  │  │   Status    │     │ │
│  │  │ • Sessions  │  │ • DELETE    │  │ • DELETE    │  │ • DB Health │     │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│                                       │                                     │
│                                       │ Database Queries                    │
│                                       ▼                                     │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                         DATABASE ACCESS LAYER                          │ │
│  │                                                                         │ │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐         │ │
│  │  │ User Management │  │ Workplan CRUD   │  │ PAC Operations  │         │ │
│  │  │                 │  │                 │  │                 │         │ │
│  │  │ • Authentication│  │ • Create        │  │ • Track Status  │         │ │
│  │  │ • Session Mgmt  │  │ • Read          │  │ • Link to Plans │         │ │
│  │  │ • Password Hash │  │ • Update        │  │ • Cost Tracking │         │ │
│  │  │ • Role Based    │  │ • Delete        │  │ • Species Data  │         │ │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘         │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                       │
                                       │ SQL Operations
                                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────────┐ │
│  │                           SQLITE DATABASE                               │ │
│  │                            (fwfps.db)                                   │ │
│  │                                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                      │ │
│  │  │    USERS    │  │  WORKPLANS  │  │ PAC_OPERATIONS                     │ │
│  │  │             │  │             │  │             │                      │ │
│  │  │ • id (PK)   │  │ • id (PK)   │  │ • id (PK)   │                      │ │
│  │  │ • username  │  │ • title     │  │ • workplan_id (FK)                 │ │
│  │  │ • email     │  │ • description│  │ • operation_name                   │ │
│  │  │ • password  │  │ • status    │  │ • operation_type                   │ │
│  │  │ • role      │  │ • created_by│  │ • status      │                    │ │
│  │  │ • created_at│  │ • start_date│  │ • target_species                   │ │
│  │  │             │  │ • end_date  │  │ • location    │                    │ │
│  │  │             │  │ • budget    │  │ • estimated_cost                   │ │
│  │  │             │  │ • priority  │  │ • actual_cost │                    │ │
│  │  │             │  │ • created_at│  │ • start_date  │                    │ │
│  │  │             │  │ • updated_at│  │ • end_date    │                    │ │
│  │  │             │  │             │  │ • notes       │                    │ │
│  │  │             │  │             │  │ • created_at  │                    │ │
│  │  │             │  │             │  │ • updated_at  │                    │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                      │ │
│  │         │                  │                  │                         │ │
│  │         └──────────────────┼──────────────────┘                         │ │
│  │                            │ Foreign Key Relationships                  │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA FLOW PATTERNS                               │
└─────────────────────────────────────────────────────────────────────────────┘

USER INTERACTION FLOW:
┌─────────────┐    User Action    ┌─────────────┐    HTTP Request    ┌─────────────┐
│   BROWSER   │ ────────────────→ │  ANGULAR    │ ─────────────────→ │   FLASK     │
│             │                   │ COMPONENT   │                    │   ROUTER    │
│ • Click     │ ←──────────────── │             │ ←───────────────── │             │
│ • Form      │    DOM Update     │ • Validate  │    JSON Response   │ • Validate  │
│ • Navigate  │                   │ • Transform │                    │ • Process   │
└─────────────┘                   │ • Display   │                    │ • Respond   │
                                  └─────────────┘                    └─────────────┘
                                          │                                  │
                                          │                                  │
                                          ▼                                  ▼
                                  ┌─────────────┐    Service Call    ┌─────────────┐
                                  │ API SERVICE │ ─────────────────→ │  DATABASE   │
                                  │             │                    │   LAYER     │
                                  │ • HTTP      │ ←───────────────── │             │
                                  │ • Auth      │    Query Result    │ • SQLite    │
                                  │ • Error     │                    │ • SQLAlchemy│
                                  │ • Cache     │                    │ • CRUD Ops  │
                                  │             │                    │ • Relations │
                                  └─────────────┘                    └─────────────┘

AUTHENTICATION FLOW:
┌─────────────┐    Login Form     ┌─────────────┐    POST /login     ┌─────────────┐
│   LOGIN     │ ────────────────→ │ API SERVICE │ ─────────────────→ │   AUTH      │
│ COMPONENT   │                   │             │                    │  ROUTE      │
│             │ ←──────────────── │ • Store     │ ←───────────────── │             │
│ • Username  │   Success/Error   │   Token     │   Session Cookie   │ • Verify    │
│ • Password  │                   │ • Redirect  │                    │ • Hash      │
│ • Remember  │                   │             │                    │ • Session   │
└─────────────┘                   └─────────────┘                    └─────────────┘
                                                                             │
                                                                             ▼
                                                                     ┌─────────────┐
                                                                     │   USERS     │
                                                                     │   TABLE     │
                                                                     │             │
                                                                     │ • Lookup    │
                                                                     │ • Validate  │
                                                                     │ • Create    │
                                                                     │   Session   │
                                                                     └─────────────┘

CRUD OPERATION FLOW:
┌─────────────┐    CRUD Action    ┌─────────────┐    HTTP Method     ┌─────────────┐
│ COMPONENT   │ ────────────────→ │ API SERVICE │ ─────────────────→ │ ROUTE       │
│             │                   │             │                    │ HANDLER     │
│ • Create    │ ←──────────────── │ • GET       │ ←───────────────── │             │
│ • Read      │   Updated Data    │ • POST      │   Response Data    │ • Validate  │
│ • Update    │                   │ • PUT       │                    │ • Process   │
│ • Delete    │                   │ • DELETE    │                    │ • Return    │
└─────────────┘                   └─────────────┘                    └─────────────┘
                                                                             │
                                                                             ▼
                                                                     ┌─────────────┐
                                                                     │  DATABASE   │
                                                                     │  OPERATIONS │
                                                                     │             │
                                                                     │ • INSERT    │
                                                                     │ • SELECT    │
                                                                     │ • UPDATE    │
                                                                     │ • DELETE    │
                                                                     └─────────────┘
```

## Technology Stack Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY STACK                                  │
└─────────────────────────────────────────────────────────────────────────────┘

FRONTEND STACK (Port 4200):
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   ANGULAR   │    │ TYPESCRIPT  │    │    HTML5    │    │    CSS3     │
│   17.x+     │    │   Latest    │    │   Semantic  │    │  Responsive │
│             │    │             │    │             │    │             │
│ • Components│    │ • Type Safe │    │ • Templates │    │ • Flexbox   │
│ • Services  │    │ • Interfaces│    │ • Forms     │    │ • Grid      │
│ • Routing   │    │ • Decorators│    │ • Events    │    │ • Media Q   │
│ • HTTP      │    │ • Modules   │    │ • Binding   │    │ • Variables │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

BACKEND STACK (Port 5001):
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   PYTHON    │    │    FLASK    │    │ SQLALCHEMY  │    │   SQLITE    │
│   3.8+      │    │   Latest    │    │     ORM     │    │  Database   │
│             │    │             │    │             │    │             │
│ • Clean     │    │ • Routes    │    │ • Models    │    │ • File DB   │
│ • Simple    │    │ • REST API  │    │ • Relations │    │ • Fast      │
│ • Libraries │    │ • CORS      │    │ • Migration │    │ • Embedded  │
│ • Standards │    │ • Session   │    │ • Query     │    │ • ACID      │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘

SECURITY & UTILITIES:
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   BCRYPT    │    │    CORS     │    │  REQUESTS   │    │    GIT      │
│  Password   │    │  Cross-     │    │   HTTP      │    │  Version    │
│  Hashing    │    │  Origin     │    │  Client     │    │  Control    │
│             │    │             │    │             │    │             │
│ • Secure    │    │ • Frontend  │    │ • Testing   │    │ • Branches  │
│ • Salted    │    │ • Headers   │    │ • External  │    │ • Commits   │
│ • Verified  │    │ • Methods   │    │ • APIs      │    │ • Merges    │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
```

## Security Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SECURITY LAYER DESIGN                             │
└─────────────────────────────────────────────────────────────────────────────┘

AUTHENTICATION & AUTHORIZATION:
┌─────────────┐    Credentials    ┌─────────────┐    Hash & Store    ┌─────────────┐
│   CLIENT    │ ────────────────→ │   SERVER    │ ─────────────────→ │  DATABASE   │
│             │                   │             │                    │             │
│ • Username  │ ←──────────────── │ • bcrypt    │ ←───────────────── │ • Hashed    │
│ • Password  │   Session Cookie  │ • Session   │   User Record      │   Password  │
│             │                   │ • CORS      │                    │ • User Data │
└─────────────┘                   └─────────────┘                    └─────────────┘

REQUEST SECURITY:
┌─────────────┐    HTTPS Req     ┌─────────────┐    Validate       ┌─────────────┐
│  BROWSER    │ ────────────────→ │ MIDDLEWARE  │ ────────────────→ │  ROUTE      │
│             │                   │             │                   │  HANDLER    │
│ • Auth      │ ←──────────────── │ • Session   │ ←──────────────── │             │
│ • Headers   │   Secure Response │ • CORS      │   Authorized      │ • Business  │
│ • Cookies   │                   │ • Validation│   Request         │   Logic     │
└─────────────┘                   │ • Sanitize  │                   └─────────────┘
                                  └─────────────┘

DATA PROTECTION:
┌─────────────┐    Input         ┌─────────────┐    Parameterized  ┌─────────────┐
│ USER INPUT  │ ────────────────→ │ VALIDATION  │ ─────────────────→ │    SQL      │
│             │                   │             │                    │   QUERY     │
│ • Forms     │ ←──────────────── │ • Sanitize  │ ←───────────────── │             │
│ • API Calls │   Clean Data      │ • Validate  │   Safe Results     │ • Prepared  │
│ • Files     │                   │ • Transform │                    │   Statements│
└─────────────┘                   └─────────────┘                    │ • No Injection │
                                                                     └─────────────┘
```

This comprehensive set of diagrams provides architects with:

1. **System Overview**: High-level component relationships
2. **Detailed Architecture**: Layer-by-layer breakdown
3. **Data Flow**: How information moves through the system  
4. **Security Design**: Protection mechanisms and patterns

The diagrams are designed to be easily understood and can be used in presentations or technical reviews.
