from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from marshmallow import Schema, fields

# Import db from app context
db = None
ma = None

def init_models(database, marshmallow):
    global db, ma
    db = database
    ma = marshmallow

class PacOperation(db.Model):
    __tablename__ = 'pac_operations'
    
    id = db.Column(db.Integer, primary_key=True)
    operation_type = db.Column(db.String(50), nullable=False)  # inspection, sampling, audit, investigation
    facility_name = db.Column(db.String(200), nullable=False)
    facility_id = db.Column(db.String(50))
    facility_address = db.Column(db.Text)
    operation_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(db.String(50), nullable=False, default='scheduled')  # scheduled, in_progress, completed, cancelled
    priority = db.Column(db.String(20), nullable=False, default='medium')  # low, medium, high, critical
    inspector = db.Column(db.String(100))
    inspector_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    notes = db.Column(db.Text)
    findings = db.Column(db.Text)
    risk_level = db.Column(db.String(20), default='low')  # low, medium, high, critical
    compliance_status = db.Column(db.String(50), default='pending')  # compliant, non_compliant, pending, requires_followup
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    # Relationships
    samples = db.relationship('PacSample', backref='operation', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
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
            'completed_at': self.completed_at.isoformat() if self.completed_at else None,
            'sample_count': len(self.samples),
            'samples': [sample.to_dict() for sample in self.samples] if self.samples else []
        }

class PacSample(db.Model):
    __tablename__ = 'pac_samples'
    
    id = db.Column(db.Integer, primary_key=True)
    operation_id = db.Column(db.Integer, db.ForeignKey('pac_operations.id'), nullable=False)
    sample_type = db.Column(db.String(100), nullable=False)  # product, environmental, water, etc.
    sample_description = db.Column(db.String(200))
    collection_date = db.Column(db.DateTime, default=datetime.utcnow)
    sample_location = db.Column(db.String(200))
    test_type = db.Column(db.String(100))  # microbiological, chemical, physical
    status = db.Column(db.String(50), default='collected')  # collected, in_transit, testing, completed
    results = db.Column(db.Text)
    lab_id = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'operation_id': self.operation_id,
            'sample_type': self.sample_type,
            'sample_description': self.sample_description,
            'collection_date': self.collection_date.isoformat() if self.collection_date else None,
            'sample_location': self.sample_location,
            'test_type': self.test_type,
            'status': self.status,
            'results': self.results,
            'lab_id': self.lab_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class PacOperationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PacOperation
        load_instance = True
        include_relationships = True
        
    id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    completed_at = fields.DateTime(dump_only=True)
    operation_date = fields.DateTime()
    samples = fields.Nested('PacSampleSchema', many=True, exclude=('operation',))

class PacSampleSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = PacSample
        load_instance = True
        
    id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    collection_date = fields.DateTime()
