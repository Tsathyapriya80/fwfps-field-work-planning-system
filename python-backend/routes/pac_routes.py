from flask import Blueprint, request, jsonify
from datetime import datetime
from models.pac_operation import PacOperation, PacSample, PacOperationSchema, PacSampleSchema

pac_bp = Blueprint('pac', __name__)
operation_schema = PacOperationSchema()
operations_schema = PacOperationSchema(many=True)
sample_schema = PacSampleSchema()
samples_schema = PacSampleSchema(many=True)

@pac_bp.route('/operations', methods=['GET'])
def get_operations():
    """Get all PAC operations with optional filtering"""
    try:
        # Get query parameters
        operation_type = request.args.get('type')
        status = request.args.get('status')
        priority = request.args.get('priority')
        inspector = request.args.get('inspector')
        
        # Build query
        query = PacOperation.query
        
        if operation_type:
            query = query.filter(PacOperation.operation_type == operation_type)
        if status:
            query = query.filter(PacOperation.status == status)
        if priority:
            query = query.filter(PacOperation.priority == priority)
        if inspector:
            query = query.filter(PacOperation.inspector.ilike(f'%{inspector}%'))
        
        operations = query.order_by(PacOperation.operation_date.desc()).all()
        
        return jsonify({
            'success': True,
            'operations': [operation.to_dict() for operation in operations],
            'total': len(operations)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/operations/<int:operation_id>', methods=['GET'])
def get_operation(operation_id):
    """Get specific PAC operation by ID"""
    try:
        operation = PacOperation.query.get(operation_id)
        if not operation:
            return jsonify({'error': 'Operation not found'}), 404
        
        return jsonify({
            'success': True,
            'operation': operation.to_dict()
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/operations', methods=['POST'])
def create_operation():
    """Create new PAC operation"""
    try:
        data = request.get_json()
        
        # Parse operation date
        operation_date = datetime.fromisoformat(data['operation_date'].replace('Z', '+00:00'))
        
        operation = PacOperation(
            operation_type=data.get('operation_type'),
            facility_name=data.get('facility_name'),
            facility_id=data.get('facility_id'),
            facility_address=data.get('facility_address'),
            operation_date=operation_date,
            status=data.get('status', 'scheduled'),
            priority=data.get('priority', 'medium'),
            inspector=data.get('inspector'),
            notes=data.get('notes'),
            risk_level=data.get('risk_level', 'low')
        )
        
        from app import db
        db.session.add(operation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Operation created successfully',
            'operation': operation.to_dict()
        }), 201
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/operations/<int:operation_id>', methods=['PUT'])
def update_operation(operation_id):
    """Update existing PAC operation"""
    try:
        operation = PacOperation.query.get(operation_id)
        if not operation:
            return jsonify({'error': 'Operation not found'}), 404
        
        data = request.get_json()
        
        # Update fields
        if 'operation_type' in data:
            operation.operation_type = data['operation_type']
        if 'facility_name' in data:
            operation.facility_name = data['facility_name']
        if 'facility_id' in data:
            operation.facility_id = data['facility_id']
        if 'facility_address' in data:
            operation.facility_address = data['facility_address']
        if 'operation_date' in data:
            operation.operation_date = datetime.fromisoformat(data['operation_date'].replace('Z', '+00:00'))
        if 'status' in data:
            operation.status = data['status']
            if data['status'] == 'completed':
                operation.completed_at = datetime.utcnow()
        if 'priority' in data:
            operation.priority = data['priority']
        if 'inspector' in data:
            operation.inspector = data['inspector']
        if 'notes' in data:
            operation.notes = data['notes']
        if 'findings' in data:
            operation.findings = data['findings']
        if 'risk_level' in data:
            operation.risk_level = data['risk_level']
        if 'compliance_status' in data:
            operation.compliance_status = data['compliance_status']
        
        operation.updated_at = datetime.utcnow()
        
        from app import db
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Operation updated successfully',
            'operation': operation.to_dict()
        }), 200
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/operations/<int:operation_id>', methods=['DELETE'])
def delete_operation(operation_id):
    """Delete PAC operation"""
    try:
        operation = PacOperation.query.get(operation_id)
        if not operation:
            return jsonify({'error': 'Operation not found'}), 404
        
        from app import db
        db.session.delete(operation)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Operation deleted successfully'
        }), 200
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/operations/<int:operation_id>/samples', methods=['GET'])
def get_operation_samples(operation_id):
    """Get samples for specific operation"""
    try:
        operation = PacOperation.query.get(operation_id)
        if not operation:
            return jsonify({'error': 'Operation not found'}), 404
        
        samples = PacSample.query.filter_by(operation_id=operation_id).all()
        
        return jsonify({
            'success': True,
            'samples': [sample.to_dict() for sample in samples],
            'total': len(samples)
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/operations/<int:operation_id>/samples', methods=['POST'])
def create_sample(operation_id):
    """Create new sample for operation"""
    try:
        operation = PacOperation.query.get(operation_id)
        if not operation:
            return jsonify({'error': 'Operation not found'}), 404
        
        data = request.get_json()
        
        sample = PacSample(
            operation_id=operation_id,
            sample_type=data.get('sample_type'),
            sample_description=data.get('sample_description'),
            sample_location=data.get('sample_location'),
            test_type=data.get('test_type'),
            lab_id=data.get('lab_id')
        )
        
        from app import db
        db.session.add(sample)
        db.session.commit()
        
        return jsonify({
            'success': True,
            'message': 'Sample created successfully',
            'sample': sample.to_dict()
        }), 201
        
    except Exception as e:
        from app import db
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/dashboard', methods=['GET'])
def get_pac_dashboard():
    """Get PAC operations dashboard statistics"""
    try:
        # Get counts by status
        total_operations = PacOperation.query.count()
        scheduled_operations = PacOperation.query.filter_by(status='scheduled').count()
        in_progress_operations = PacOperation.query.filter_by(status='in_progress').count()
        completed_operations = PacOperation.query.filter_by(status='completed').count()
        
        # Get counts by type
        inspections = PacOperation.query.filter_by(operation_type='inspection').count()
        samplings = PacOperation.query.filter_by(operation_type='sampling').count()
        audits = PacOperation.query.filter_by(operation_type='audit').count()
        
        # Get high priority operations
        high_priority = PacOperation.query.filter_by(priority='high').count()
        
        # Get recent operations
        recent_operations = PacOperation.query.order_by(PacOperation.created_at.desc()).limit(5).all()
        
        return jsonify({
            'success': True,
            'dashboard': {
                'total_operations': total_operations,
                'scheduled_operations': scheduled_operations,
                'in_progress_operations': in_progress_operations,
                'completed_operations': completed_operations,
                'inspections': inspections,
                'samplings': samplings,
                'audits': audits,
                'high_priority': high_priority,
                'recent_operations': [operation.to_dict() for operation in recent_operations]
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@pac_bp.route('/types', methods=['GET'])
def get_operation_types():
    """Get available operation types"""
    return jsonify({
        'success': True,
        'operation_types': [
            {'value': 'inspection', 'label': 'Inspection'},
            {'value': 'sampling', 'label': 'Sampling'},
            {'value': 'audit', 'label': 'Audit'},
            {'value': 'investigation', 'label': 'Investigation'}
        ]
    }), 200

@pac_bp.route('/statuses', methods=['GET'])
def get_statuses():
    """Get available operation statuses"""
    return jsonify({
        'success': True,
        'statuses': [
            {'value': 'scheduled', 'label': 'Scheduled'},
            {'value': 'in_progress', 'label': 'In Progress'},
            {'value': 'completed', 'label': 'Completed'},
            {'value': 'cancelled', 'label': 'Cancelled'}
        ]
    }), 200

@pac_bp.route('/priorities', methods=['GET'])
def get_priorities():
    """Get available priority levels"""
    return jsonify({
        'success': True,
        'priorities': [
            {'value': 'low', 'label': 'Low'},
            {'value': 'medium', 'label': 'Medium'},
            {'value': 'high', 'label': 'High'},
            {'value': 'critical', 'label': 'Critical'}
        ]
    }), 200
