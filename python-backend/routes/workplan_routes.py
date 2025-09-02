from flask import Blueprint, request, jsonify
from datetime import datetime, date
from models.workplan import Workplan, WorkplanTask, WorkplanSchema, WorkplanTaskSchema

workplan_bp = Blueprint('workplan', __name__)
workplan_schema = WorkplanSchema()
workplans_schema = WorkplanSchema(many=True)
task_schema = WorkplanTaskSchema()
tasks_schema = WorkplanTaskSchema(many=True)

@workplan_bp.route('/', methods=['GET'])
def get_workplans():
    """Get all workplans with optional filtering"""
    try:
        # Get query parameters
        status = request.args.get('status')
        priority = request.args.get('priority')
        assigned_to = request.args.get('assigned_to')
        
        # Build query
        query = Workplan.query
        
        if status:
            query = query.filter(Workplan.status == status)
        if priority:
            query = query.filter(Workplan.priority == priority)
        if assigned_to:
            query = query.filter(Workplan.assigned_to.ilike(f'%{assigned_to}%'))
        
        workplans = query.order_by(Workplan.created_at.desc()).all()
        
        return jsonify({
            'success': True,
            'workplans': [workplan.to_dict() for workplan in workplans],
            'total': len(workplans)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workplan_bp.route('/<int:workplan_id>', methods=['GET'])
def get_workplan(workplan_id):
    """Get specific workplan by ID"""
    try:
        workplan = Workplan.query.get(workplan_id)
        if not workplan:
            return jsonify({'error': 'Workplan not found'}), 404
        
        return jsonify({
            'success': True,
            'workplan': workplan.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workplan_bp.route('/', methods=['POST'])
def create_workplan():
    """Create new workplan"""
    try:
        data = request.get_json()
        
        # Parse dates
        start_date = None
        end_date = None
        if data.get('start_date'):
            start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date()
        if data.get('end_date'):
            end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date()
        
        workplan = Workplan(
            title=data.get('title'),
            description=data.get('description'),
            status=data.get('status', 'planned'),
            priority=data.get('priority', 'medium'),
            start_date=start_date,
            end_date=end_date,
            assigned_to=data.get('assigned_to'),
            progress=data.get('progress', 0)
        )
        
        from app import db
        db.session.add(workplan)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Workplan created successfully',
            'workplan': workplan.to_dict()
        }), 201
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@workplan_bp.route('/<int:workplan_id>', methods=['PUT'])
def update_workplan(workplan_id):
    """Update existing workplan"""
    try:
        workplan = Workplan.query.get(workplan_id)
        if not workplan:
            return jsonify({'error': 'Workplan not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'title' in data:
            workplan.title = data['title']
        if 'description' in data:
            workplan.description = data['description']
        if 'status' in data:
            workplan.status = data['status']
        if 'priority' in data:
            workplan.priority = data['priority']
        if 'start_date' in data:
            workplan.start_date = datetime.strptime(data['start_date'], '%Y-%m-%d').date() if data['start_date'] else None
        if 'end_date' in data:
            workplan.end_date = datetime.strptime(data['end_date'], '%Y-%m-%d').date() if data['end_date'] else None
        if 'assigned_to' in data:
            workplan.assigned_to = data['assigned_to']
        if 'progress' in data:
            workplan.progress = data['progress']
        
        workplan.updated_at = datetime.utcnow()
        
        from app import db
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Workplan updated successfully',
            'workplan': workplan.to_dict()
        }), 200
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@workplan_bp.route('/<int:workplan_id>', methods=['DELETE'])
def delete_workplan(workplan_id):
    """Delete workplan"""
    try:
        workplan = Workplan.query.get(workplan_id)
        if not workplan:
            return jsonify({'error': 'Workplan not found'}), 404
        
        from app import db
        db.session.delete(workplan)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Workplan deleted successfully'
        }), 200
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@workplan_bp.route('/<int:workplan_id>/tasks', methods=['GET'])
def get_workplan_tasks(workplan_id):
    """Get tasks for specific workplan"""
    try:
        workplan = Workplan.query.get(workplan_id)
        if not workplan:
            return jsonify({'error': 'Workplan not found'}), 404
        
        tasks = WorkplanTask.query.filter_by(workplan_id=workplan_id).all()
        
        return jsonify({
            'success': True,
            'tasks': [task.to_dict() for task in tasks],
            'total': len(tasks)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@workplan_bp.route('/<int:workplan_id>/tasks', methods=['POST'])
def create_workplan_task(workplan_id):
    """Create new task for workplan"""
    try:
        workplan = Workplan.query.get(workplan_id)
        if not workplan:
            return jsonify({'error': 'Workplan not found'}), 404
        
        data = request.get_json()
        
        # Parse due date
        due_date = None
        if data.get('due_date'):
            due_date = datetime.strptime(data['due_date'], '%Y-%m-%d').date()
        
        task = WorkplanTask(
            workplan_id=workplan_id,
            title=data.get('title'),
            description=data.get('description'),
            status=data.get('status', 'pending'),
            priority=data.get('priority', 'medium'),
            due_date=due_date,
            assigned_to=data.get('assigned_to'),
            progress=data.get('progress', 0)
        )
        
        from app import db
        db.session.add(task)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Task created successfully',
            'task': task.to_dict()
        }), 201
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@workplan_bp.route('/dashboard', methods=['GET'])
def get_dashboard_data():
    """Get workplan dashboard statistics"""
    try:
        # Get counts by status
        total_workplans = Workplan.query.count()
        active_workplans = Workplan.query.filter_by(status='active').count()
        completed_workplans = Workplan.query.filter_by(status='completed').count()
        planned_workplans = Workplan.query.filter_by(status='planned').count()
        
        # Get high priority workplans
        high_priority = Workplan.query.filter_by(priority='high').count()
        
        # Get recent workplans
        recent_workplans = Workplan.query.order_by(Workplan.created_at.desc()).limit(5).all()
        
        return jsonify({
            'success': True,
            'dashboard': {
                'total_workplans': total_workplans,
                'active_workplans': active_workplans,
                'completed_workplans': completed_workplans,
                'planned_workplans': planned_workplans,
                'high_priority': high_priority,
                'recent_workplans': [workplan.to_dict() for workplan in recent_workplans]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500
