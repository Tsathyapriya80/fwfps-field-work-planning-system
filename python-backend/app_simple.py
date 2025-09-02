from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime, date
from werkzeug.security import generate_password_hash, check_password_hash
import os

# Initialize Flask app
app = Flask(__name__)

# Configure SQLite database
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'fwfps.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'fwfps-demo-secret-key'

# Initialize extensions
db = SQLAlchemy(app)
ma = Marshmallow(app)
CORS(app, origins=["http://localhost:4200"])

# Define models directly here for simplicity
class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    full_name = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False, default='user')
    department = db.Column(db.String(100))
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check if provided password matches hash"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'full_name': self.full_name,
            'role': self.role,
            'department': self.department,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Workplan(db.Model):
    __tablename__ = 'workplans'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), default='planned')
    priority = db.Column(db.String(20), default='medium')
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    assigned_to = db.Column(db.String(100))
    progress = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'start_date': self.start_date.isoformat() if self.start_date else None,
            'end_date': self.end_date.isoformat() if self.end_date else None,
            'assigned_to': self.assigned_to,
            'progress': self.progress,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class PacOperation(db.Model):
    __tablename__ = 'pac_operations'
    
    id = db.Column(db.Integer, primary_key=True)
    operation_type = db.Column(db.String(100), nullable=False)
    facility_name = db.Column(db.String(200), nullable=False)
    facility_id = db.Column(db.String(50))
    facility_address = db.Column(db.String(500))
    operation_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='scheduled')
    priority = db.Column(db.String(20), nullable=False, default='medium')
    inspector = db.Column(db.String(100))
    inspector_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    notes = db.Column(db.Text)
    findings = db.Column(db.Text)
    risk_level = db.Column(db.String(20), default='low')
    compliance_status = db.Column(db.String(50), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'operation_type': self.operation_type,
            'facility_name': self.facility_name,
            'facility_id': self.facility_id,
            'facility_address': self.facility_address,
            'operation_date': self.operation_date.isoformat() if self.operation_date else None,
            'status': self.status,
            'priority': self.priority,
            'inspector': self.inspector,
            'inspector_id': self.inspector_id,
            'notes': self.notes,
            'findings': self.findings,
            'risk_level': self.risk_level,
            'compliance_status': self.compliance_status,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

# API Routes
@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'message': 'FWFPS Python Backend API is running',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/auth/login', methods=['POST'])
def login():
    """User authentication"""
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'success': False, 'error': 'Username and password required'}), 400
    
    user = User.query.filter_by(username=username).first()
    
    if user and user.check_password(password):
        user.last_login = datetime.utcnow()
        db.session.commit()
        return jsonify({
            'success': True,
            'message': 'Login successful',
            'user': user.to_dict()
        })
    else:
        return jsonify({'success': False, 'error': 'Invalid credentials'}), 401

@app.route('/api/workplans', methods=['GET'])
def get_workplans():
    """Get all workplans"""
    workplans = Workplan.query.all()
    return jsonify({
        'success': True,
        'workplans': [wp.to_dict() for wp in workplans]
    })

@app.route('/api/workplans', methods=['POST'])
def create_workplan():
    """Create new workplan"""
    data = request.get_json()
    
    workplan = Workplan(
        title=data.get('title'),
        description=data.get('description'),
        status=data.get('status', 'planned'),
        priority=data.get('priority', 'medium'),
        start_date=datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data.get('start_date') else None,
        end_date=datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data.get('end_date') else None,
        assigned_to=data.get('assigned_to'),
        progress=data.get('progress', 0)
    )
    
    db.session.add(workplan)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'Workplan created successfully',
        'workplan': workplan.to_dict()
    }), 201

@app.route('/api/workplans/dashboard', methods=['GET'])
def workplan_dashboard():
    """Get workplan dashboard data"""
    workplans = Workplan.query.all()
    
    total = len(workplans)
    active = len([w for w in workplans if w.status == 'active'])
    completed = len([w for w in workplans if w.status == 'completed'])
    planned = len([w for w in workplans if w.status == 'planned'])
    
    return jsonify({
        'success': True,
        'dashboard': {
            'total_workplans': total,
            'active_workplans': active,
            'completed_workplans': completed,
            'planned_workplans': planned,
            'status_breakdown': {
                'active': active,
                'completed': completed,
                'planned': planned
            }
        }
    })

@app.route('/api/pac/operations', methods=['GET'])
def get_pac_operations():
    """Get all PAC operations"""
    operations = PacOperation.query.all()
    return jsonify({
        'success': True,
        'operations': [op.to_dict() for op in operations]
    })

@app.route('/api/pac/operations', methods=['POST'])
def create_pac_operation():
    """Create new PAC operation"""
    data = request.get_json()
    
    operation = PacOperation(
        operation_type=data.get('operation_type'),
        facility_name=data.get('facility_name'),
        facility_id=data.get('facility_id'),
        facility_address=data.get('facility_address'),
        operation_date=datetime.strptime(data['operation_date'], '%Y-%m-%dT%H:%M:%S') if data.get('operation_date') else datetime.utcnow(),
        status=data.get('status', 'scheduled'),
        priority=data.get('priority', 'medium'),
        inspector=data.get('inspector'),
        notes=data.get('notes')
    )
    
    db.session.add(operation)
    db.session.commit()
    
    return jsonify({
        'success': True,
        'message': 'PAC operation created successfully',
        'operation': operation.to_dict()
    }), 201

@app.route('/api/pac/dashboard', methods=['GET'])
def pac_dashboard():
    """Get PAC operations dashboard data"""
    operations = PacOperation.query.all()
    
    total = len(operations)
    scheduled = len([o for o in operations if o.status == 'scheduled'])
    in_progress = len([o for o in operations if o.status == 'in_progress'])
    completed = len([o for o in operations if o.status == 'completed'])
    
    return jsonify({
        'success': True,
        'dashboard': {
            'total_operations': total,
            'scheduled_operations': scheduled,
            'in_progress_operations': in_progress,
            'completed_operations': completed,
            'status_breakdown': {
                'scheduled': scheduled,
                'in_progress': in_progress,
                'completed': completed
            }
        }
    })

def init_db():
    """Initialize database with sample data"""
    print("🗄️ Initializing FWFPS SQLite database...")
    
    # Create all tables
    db.create_all()
    
    # Check if data already exists
    if User.query.first() is None:
        print("📊 Creating sample data...")
        
        # Create sample users
        admin_user = User(
            username='admin',
            email='admin@fda.gov',
            full_name='System Administrator',
            role='admin',
            department='FWFPS Administration'
        )
        admin_user.set_password('admin123')
        
        analyst_user = User(
            username='analyst',
            email='analyst@fda.gov',
            full_name='Field Work Analyst',
            role='analyst',
            department='Field Operations'
        )
        analyst_user.set_password('analyst123')
        
        inspector_user = User(
            username='inspector',
            email='inspector@fda.gov',
            full_name='Senior Inspector',
            role='inspector',
            department='Field Operations'
        )
        inspector_user.set_password('inspector123')
        
        db.session.add_all([admin_user, analyst_user, inspector_user])
        
        # Create sample workplans
        workplans = [
            Workplan(
                title='Q1 2025 Field Operations Plan',
                description='Comprehensive field work plan for first quarter 2025 including inspections, sampling, and compliance activities',
                status='active',
                priority='high',
                start_date=date(2025, 1, 1),
                end_date=date(2025, 3, 31),
                assigned_to='FDA Field Team Alpha',
                progress=75
            ),
            Workplan(
                title='Annual Facility Compliance Review',
                description='Year-long systematic review of facility compliance across all regions',
                status='planned',
                priority='medium',
                start_date=date(2025, 2, 1),
                end_date=date(2025, 12, 31),
                assigned_to='FDA Compliance Division',
                progress=10
            ),
            Workplan(
                title='Import Safety Assessment Program',
                description='Comprehensive assessment of imported products safety measures and documentation',
                status='active',
                priority='high',
                start_date=date(2025, 1, 15),
                end_date=date(2025, 6, 15),
                assigned_to='FDA Import Safety Team',
                progress=45
            )
        ]
        
        db.session.add_all(workplans)
        
        # Create sample PAC operations
        operations = [
            PacOperation(
                operation_type='facility_inspection',
                facility_name='Global Foods Manufacturing Inc.',
                facility_id='FDA-FAC-001',
                facility_address='123 Industrial Drive, Manufacturing City, ST 12345',
                operation_date=datetime(2025, 3, 15, 9, 0),
                status='scheduled',
                priority='high',
                inspector='John Smith',
                notes='Routine comprehensive inspection - follow up on previous HACCP findings'
            ),
            PacOperation(
                operation_type='sample_collection',
                facility_name='Fresh Produce Distributors LLC',
                facility_id='FDA-FAC-002',
                facility_address='456 Distribution Way, Fresh Valley, ST 67890',
                operation_date=datetime(2025, 3, 20, 14, 30),
                status='completed',
                priority='medium',
                inspector='Sarah Johnson',
                notes='Samples collected for pesticide residue testing - 12 samples taken',
                findings='All samples within acceptable limits',
                compliance_status='compliant'
            ),
            PacOperation(
                operation_type='compliance_audit',
                facility_name='Organic Grains Processing Co.',
                facility_id='FDA-FAC-003',
                facility_address='789 Organic Lane, Grain Fields, ST 11111',
                operation_date=datetime(2025, 3, 25, 10, 0),
                status='in_progress',
                priority='high',
                inspector='Mike Davis',
                notes='Comprehensive audit of organic certification and HACCP implementation'
            ),
            PacOperation(
                operation_type='follow_up_inspection',
                facility_name='Supplement Solutions Corp.',
                facility_id='FDA-FAC-004',
                facility_address='321 Vitamin Street, Health City, ST 22222',
                operation_date=datetime(2025, 4, 1, 11, 30),
                status='scheduled',
                priority='medium',
                inspector='Lisa Wilson',
                notes='Follow-up inspection for previous labeling violations'
            )
        ]
        
        db.session.add_all(operations)
        
        # Commit all data
        db.session.commit()
        print("✅ Sample data created successfully!")
    else:
        print("✅ Database already contains data")
    
    print(f"📍 Database location: {os.path.join(basedir, 'fwfps.db')}")
    print("🗄️ Database initialization complete!")

if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    print("\n🚀 FWFPS Python Backend starting...")
    print("📍 Server: http://127.0.0.1:5001")
    print("🏥 Health check: http://127.0.0.1:5001/api/health")
    print("🔧 Environment: development")
    app.run(debug=False, host='127.0.0.1', port=5001, use_reloader=False)
