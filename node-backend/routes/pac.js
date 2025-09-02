const express = require('express');
const router = express.Router();

// Get all PAC operations with optional filtering
router.get('/operations', async (req, res) => {
  try {
    const { type, status, priority, inspector } = req.query;
    
    let sql = 'SELECT * FROM pac_operations WHERE 1=1';
    const params = [];
    
    if (type) {
      sql += ' AND operation_type = ?';
      params.push(type);
    }
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }
    if (inspector) {
      sql += ' AND inspector LIKE ?';
      params.push(`%${inspector}%`);
    }
    
    sql += ' ORDER BY operation_date DESC';
    
    const operations = await req.db.query(sql, params);
    
    // Get sample counts for each operation
    for (let operation of operations) {
      const sampleCount = await req.db.get(
        'SELECT COUNT(*) as count FROM pac_samples WHERE operation_id = ?',
        [operation.id]
      );
      operation.sample_count = sampleCount.count;
      
      // Get samples for each operation
      const samples = await req.db.query(
        'SELECT * FROM pac_samples WHERE operation_id = ? ORDER BY collection_date',
        [operation.id]
      );
      operation.samples = samples;
    }
    
    res.json({
      success: true,
      operations: operations,
      total: operations.length
    });
    
  } catch (error) {
    console.error('Get operations error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific operation by ID
router.get('/operations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const operation = await req.db.get(
      'SELECT * FROM pac_operations WHERE id = ?',
      [id]
    );
    
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    // Get samples for this operation
    const samples = await req.db.query(
      'SELECT * FROM pac_samples WHERE operation_id = ? ORDER BY collection_date',
      [id]
    );
    
    operation.samples = samples;
    operation.sample_count = samples.length;
    
    res.json({
      success: true,
      operation: operation
    });
    
  } catch (error) {
    console.error('Get operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new PAC operation
router.post('/operations', async (req, res) => {
  try {
    const {
      operation_type,
      facility_name,
      facility_id,
      facility_address,
      operation_date,
      status = 'scheduled',
      priority = 'medium',
      inspector,
      notes,
      risk_level = 'low'
    } = req.body;
    
    if (!operation_type || !facility_name || !operation_date) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const result = await req.db.run(
      'INSERT INTO pac_operations (operation_type, facility_name, facility_id, facility_address, operation_date, status, priority, inspector, notes, risk_level, inspector_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [operation_type, facility_name, facility_id, facility_address, operation_date, status, priority, inspector, notes, risk_level, req.session.userId]
    );
    
    // Get the created operation
    const operation = await req.db.get(
      'SELECT * FROM pac_operations WHERE id = ?',
      [result.id]
    );
    
    operation.samples = [];
    operation.sample_count = 0;
    
    res.status(201).json({
      success: true,
      message: 'Operation created successfully',
      operation: operation
    });
    
  } catch (error) {
    console.error('Create operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update PAC operation
router.put('/operations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      operation_type,
      facility_name,
      facility_id,
      facility_address,
      operation_date,
      status,
      priority,
      inspector,
      notes,
      findings,
      risk_level,
      compliance_status
    } = req.body;
    
    // Check if operation exists
    const existingOperation = await req.db.get(
      'SELECT id FROM pac_operations WHERE id = ?',
      [id]
    );
    
    if (!existingOperation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    // Set completed_at if status is completed
    const completed_at = status === 'completed' ? new Date().toISOString() : null;
    
    // Update operation
    await req.db.run(
      'UPDATE pac_operations SET operation_type = ?, facility_name = ?, facility_id = ?, facility_address = ?, operation_date = ?, status = ?, priority = ?, inspector = ?, notes = ?, findings = ?, risk_level = ?, compliance_status = ?, completed_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [operation_type, facility_name, facility_id, facility_address, operation_date, status, priority, inspector, notes, findings, risk_level, compliance_status, completed_at, id]
    );
    
    // Get updated operation
    const operation = await req.db.get(
      'SELECT * FROM pac_operations WHERE id = ?',
      [id]
    );
    
    // Get samples
    const samples = await req.db.query(
      'SELECT * FROM pac_samples WHERE operation_id = ? ORDER BY collection_date',
      [id]
    );
    
    operation.samples = samples;
    operation.sample_count = samples.length;
    
    res.json({
      success: true,
      message: 'Operation updated successfully',
      operation: operation
    });
    
  } catch (error) {
    console.error('Update operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete PAC operation
router.delete('/operations/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if operation exists
    const operation = await req.db.get(
      'SELECT id FROM pac_operations WHERE id = ?',
      [id]
    );
    
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    // Delete operation (samples will be deleted due to CASCADE)
    await req.db.run('DELETE FROM pac_operations WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Operation deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete operation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get samples for specific operation
router.get('/operations/:id/samples', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if operation exists
    const operation = await req.db.get(
      'SELECT id FROM pac_operations WHERE id = ?',
      [id]
    );
    
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    const samples = await req.db.query(
      'SELECT * FROM pac_samples WHERE operation_id = ? ORDER BY collection_date',
      [id]
    );
    
    res.json({
      success: true,
      samples: samples,
      total: samples.length
    });
    
  } catch (error) {
    console.error('Get samples error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create sample for operation
router.post('/operations/:id/samples', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sample_type,
      sample_description,
      sample_location,
      test_type,
      lab_id
    } = req.body;
    
    if (!sample_type) {
      return res.status(400).json({ error: 'Sample type is required' });
    }
    
    // Check if operation exists
    const operation = await req.db.get(
      'SELECT id FROM pac_operations WHERE id = ?',
      [id]
    );
    
    if (!operation) {
      return res.status(404).json({ error: 'Operation not found' });
    }
    
    const result = await req.db.run(
      'INSERT INTO pac_samples (operation_id, sample_type, sample_description, sample_location, test_type, lab_id) VALUES (?, ?, ?, ?, ?, ?)',
      [id, sample_type, sample_description, sample_location, test_type, lab_id]
    );
    
    // Get the created sample
    const sample = await req.db.get(
      'SELECT * FROM pac_samples WHERE id = ?',
      [result.id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Sample created successfully',
      sample: sample
    });
    
  } catch (error) {
    console.error('Create sample error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get PAC dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts by status
    const totalOperations = await req.db.get('SELECT COUNT(*) as count FROM pac_operations');
    const scheduledOperations = await req.db.get('SELECT COUNT(*) as count FROM pac_operations WHERE status = "scheduled"');
    const inProgressOperations = await req.db.get('SELECT COUNT(*) as count FROM pac_operations WHERE status = "in_progress"');
    const completedOperations = await req.db.get('SELECT COUNT(*) as count FROM pac_operations WHERE status = "completed"');
    
    // Get counts by type
    const inspections = await req.db.get('SELECT COUNT(*) as count FROM pac_operations WHERE operation_type = "inspection"');
    const samplings = await req.db.get('SELECT COUNT(*) as count FROM pac_operations WHERE operation_type = "sampling"');
    const audits = await req.db.get('SELECT COUNT(*) as count FROM pac_operations WHERE operation_type = "audit"');
    
    const highPriority = await req.db.get('SELECT COUNT(*) as count FROM pac_operations WHERE priority = "high"');
    
    // Get recent operations
    const recentOperations = await req.db.query(
      'SELECT * FROM pac_operations ORDER BY created_at DESC LIMIT 5'
    );
    
    // Add sample counts to recent operations
    for (let operation of recentOperations) {
      const sampleCount = await req.db.get(
        'SELECT COUNT(*) as count FROM pac_samples WHERE operation_id = ?',
        [operation.id]
      );
      operation.sample_count = sampleCount.count;
    }
    
    res.json({
      success: true,
      dashboard: {
        total_operations: totalOperations.count,
        scheduled_operations: scheduledOperations.count,
        in_progress_operations: inProgressOperations.count,
        completed_operations: completedOperations.count,
        inspections: inspections.count,
        samplings: samplings.count,
        audits: audits.count,
        high_priority: highPriority.count,
        recent_operations: recentOperations
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get operation types
router.get('/types', (req, res) => {
  res.json({
    success: true,
    operation_types: [
      { value: 'inspection', label: 'Inspection' },
      { value: 'sampling', label: 'Sampling' },
      { value: 'audit', label: 'Audit' },
      { value: 'investigation', label: 'Investigation' }
    ]
  });
});

// Get operation statuses
router.get('/statuses', (req, res) => {
  res.json({
    success: true,
    statuses: [
      { value: 'scheduled', label: 'Scheduled' },
      { value: 'in_progress', label: 'In Progress' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ]
  });
});

// Get priority levels
router.get('/priorities', (req, res) => {
  res.json({
    success: true,
    priorities: [
      { value: 'low', label: 'Low' },
      { value: 'medium', label: 'Medium' },
      { value: 'high', label: 'High' },
      { value: 'critical', label: 'Critical' }
    ]
  });
});

module.exports = router;
