from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, date
from marshmallow import Schema, fields

# Import db from app context
db = None
ma = None

def init_models(database, marshmallow):
    global db, ma
    db = database
    ma = marshmallow

class Workplan(db.Model):
    __tablename__ = 'workplans'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), nullable=False, default='planned')  # planned, active, completed, cancelled
    priority = db.Column(db.String(20), nullable=False, default='medium')  # low, medium, high, critical
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    assigned_to = db.Column(db.String(100))
    progress = db.Column(db.Integer, default=0)  # 0-100 percentage
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_by = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    tasks = db.relationship('WorkplanTask', backref='workplan', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
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
            'updated_at': self.updated_at.isoformat() if self.updated_at else None,
            'task_count': len(self.tasks),
            'tasks': [task.to_dict() for task in self.tasks] if self.tasks else []
        }

class WorkplanTask(db.Model):
    __tablename__ = 'workplan_tasks'
    
    id = db.Column(db.Integer, primary_key=True)
    workplan_id = db.Column(db.Integer, db.ForeignKey('workplans.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(50), nullable=False, default='pending')  # pending, in_progress, completed, cancelled
    priority = db.Column(db.String(20), nullable=False, default='medium')
    due_date = db.Column(db.Date)
    assigned_to = db.Column(db.String(100))
    progress = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        """Convert to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'workplan_id': self.workplan_id,
            'title': self.title,
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'due_date': self.due_date.isoformat() if self.due_date else None,
            'assigned_to': self.assigned_to,
            'progress': self.progress,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

class WorkplanSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Workplan
        load_instance = True
        include_relationships = True
        
    id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)
    start_date = fields.Date()
    end_date = fields.Date()
    progress = fields.Int(validate=lambda x: 0 <= x <= 100)
    tasks = fields.Nested('WorkplanTaskSchema', many=True, exclude=('workplan',))

class WorkplanTaskSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = WorkplanTask
        load_instance = True
        
    id = fields.Int(dump_only=True)
    created_at = fields.DateTime(dump_only=True)
    completed_at = fields.DateTime(dump_only=True)
    due_date = fields.Date()
    progress = fields.Int(validate=lambda x: 0 <= x <= 100)
