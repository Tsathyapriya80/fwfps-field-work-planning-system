from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
from datetime import datetime, date
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

# Initialize models with db and ma instances
from models import init_models
init_models(db, ma)

# Now import the classes after initialization
from models.user import User, UserSchema
from models.workplan import Workplan, WorkplanTask, WorkplanSchema
from models.pac_operation import PacOperation, PacSample, PacOperationSchema

# Import routes
from routes.auth_routes import auth_bp
from routes.workplan_routes import workplan_bp
from routes.pac_routes import pac_bp

# Register blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(workplan_bp, url_prefix='/api/workplans')
app.register_blueprint(pac_bp, url_prefix='/api/pac')

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'message': 'FWFPS Python Backend API is running',
        'timestamp': datetime.now().isoformat()
    })

def init_db():
    """Initialize database with sample data"""
    db.create_all()
    
    # Check if data already exists
    if User.query.first() is None:
        # Create sample users
        admin_user = User(
            username='admin',
            email='admin@fda.gov',
            full_name='Administrator',
            role='admin',
            department='FWFPS'
        )
        admin_user.set_password('admin123')
        
        analyst_user = User(
            username='analyst',
            email='analyst@fda.gov',
            full_name='Data Analyst',
            role='analyst',
            department='Food Safety'
        )
        analyst_user.set_password('analyst123')
        
        db.session.add(admin_user)
        db.session.add(analyst_user)
        
        # Create sample workplans
        workplans = [
            Workplan(
                title='Q1 Food Safety Inspection Program',
                description='Comprehensive inspection program for food manufacturing facilities',
                status='active',
                priority='high',
                start_date=date(2025, 1, 1),
                end_date=date(2025, 3, 31),
                assigned_to='FDA Team Alpha',
                progress=75
            ),
            Workplan(
                title='Dietary Supplement Compliance Review',
                description='Review compliance status of dietary supplement manufacturers',
                status='planned',
                priority='medium',
                start_date=date(2025, 2, 1),
                end_date=date(2025, 4, 30),
                assigned_to='FDA Team Beta',
                progress=25
            ),
            Workplan(
                title='Import Food Safety Assessment',
                description='Assessment of imported food products safety measures',
                status='active',
                priority='high',
                start_date=date(2025, 1, 15),
                end_date=date(2025, 6, 15),
                assigned_to='FDA Team Gamma',
                progress=60
            )
        ]
        
        for workplan in workplans:
            db.session.add(workplan)
        
        # Create sample PAC operations
        pac_operations = [
            PacOperation(
                operation_type='inspection',
                facility_name='Global Foods Manufacturing Inc.',
                facility_id='FDA-12345',
                operation_date=datetime(2025, 2, 15, 9, 0),
                status='scheduled',
                priority='high',
                inspector='John Smith',
                notes='Routine inspection - follow up on previous findings'
            ),
            PacOperation(
                operation_type='sampling',
                facility_name='Fresh Produce Distributors LLC',
                facility_id='FDA-67890',
                operation_date=datetime(2025, 2, 20, 14, 30),
                status='completed',
                priority='medium',
                inspector='Sarah Johnson',
                notes='Samples collected for pesticide residue testing'
            ),
            PacOperation(
                operation_type='audit',
                facility_name='Organic Grains Processing Co.',
                facility_id='FDA-11111',
                operation_date=datetime(2025, 3, 1, 10, 0),
                status='in_progress',
                priority='high',
                inspector='Mike Davis',
                notes='Comprehensive audit of HACCP implementation'
            )
        ]
        
        for operation in pac_operations:
            db.session.add(operation)
        
        db.session.commit()
        print("Database initialized with sample data")

if __name__ == '__main__':
    with app.app_context():
        init_db()
    
    print("FWFPS Python Backend starting on http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)
