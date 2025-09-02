const express = require('express');
const router = express.Router();

// Get all workplans with optional filtering
router.get('/', async (req, res) => {
  try {
    const { status, priority, assigned_to } = req.query;
    
    let sql = 'SELECT * FROM workplans WHERE 1=1';
    const params = [];
    
    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }
    if (priority) {
      sql += ' AND priority = ?';
      params.push(priority);
    }
    if (assigned_to) {
      sql += ' AND assigned_to LIKE ?';
      params.push(`%${assigned_to}%`);
    }
    
    sql += ' ORDER BY created_at DESC';
    
    const workplans = await req.db.query(sql, params);
    
    // Get task counts for each workplan
    for (let workplan of workplans) {
      const taskCount = await req.db.get(
        'SELECT COUNT(*) as count FROM workplan_tasks WHERE workplan_id = ?',
        [workplan.id]
      );
      workplan.task_count = taskCount.count;
      
      // Get tasks for each workplan
      const tasks = await req.db.query(
        'SELECT * FROM workplan_tasks WHERE workplan_id = ? ORDER BY created_at',
        [workplan.id]
      );
      workplan.tasks = tasks;
    }
    
    res.json({
      success: true,
      workplans: workplans,
      total: workplans.length
    });
    
  } catch (error) {
    console.error('Get workplans error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get specific workplan by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const workplan = await req.db.get(
      'SELECT * FROM workplans WHERE id = ?',
      [id]
    );
    
    if (!workplan) {
      return res.status(404).json({ error: 'Workplan not found' });
    }
    
    // Get tasks for this workplan
    const tasks = await req.db.query(
      'SELECT * FROM workplan_tasks WHERE workplan_id = ? ORDER BY created_at',
      [id]
    );
    
    workplan.tasks = tasks;
    workplan.task_count = tasks.length;
    
    res.json({
      success: true,
      workplan: workplan
    });
    
  } catch (error) {
    console.error('Get workplan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create new workplan
router.post('/', async (req, res) => {
  try {
    const {
      title,
      description,
      status = 'planned',
      priority = 'medium',
      start_date,
      end_date,
      assigned_to,
      progress = 0
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const result = await req.db.run(
      'INSERT INTO workplans (title, description, status, priority, start_date, end_date, assigned_to, progress, created_by) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [title, description, status, priority, start_date, end_date, assigned_to, progress, req.session.userId]
    );
    
    // Get the created workplan
    const workplan = await req.db.get(
      'SELECT * FROM workplans WHERE id = ?',
      [result.id]
    );
    
    workplan.tasks = [];
    workplan.task_count = 0;
    
    res.status(201).json({
      success: true,
      message: 'Workplan created successfully',
      workplan: workplan
    });
    
  } catch (error) {
    console.error('Create workplan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update workplan
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status,
      priority,
      start_date,
      end_date,
      assigned_to,
      progress
    } = req.body;
    
    // Check if workplan exists
    const existingWorkplan = await req.db.get(
      'SELECT id FROM workplans WHERE id = ?',
      [id]
    );
    
    if (!existingWorkplan) {
      return res.status(404).json({ error: 'Workplan not found' });
    }
    
    // Update workplan
    await req.db.run(
      'UPDATE workplans SET title = ?, description = ?, status = ?, priority = ?, start_date = ?, end_date = ?, assigned_to = ?, progress = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, status, priority, start_date, end_date, assigned_to, progress, id]
    );
    
    // Get updated workplan
    const workplan = await req.db.get(
      'SELECT * FROM workplans WHERE id = ?',
      [id]
    );
    
    // Get tasks
    const tasks = await req.db.query(
      'SELECT * FROM workplan_tasks WHERE workplan_id = ? ORDER BY created_at',
      [id]
    );
    
    workplan.tasks = tasks;
    workplan.task_count = tasks.length;
    
    res.json({
      success: true,
      message: 'Workplan updated successfully',
      workplan: workplan
    });
    
  } catch (error) {
    console.error('Update workplan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete workplan
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if workplan exists
    const workplan = await req.db.get(
      'SELECT id FROM workplans WHERE id = ?',
      [id]
    );
    
    if (!workplan) {
      return res.status(404).json({ error: 'Workplan not found' });
    }
    
    // Delete workplan (tasks will be deleted due to CASCADE)
    await req.db.run('DELETE FROM workplans WHERE id = ?', [id]);
    
    res.json({
      success: true,
      message: 'Workplan deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete workplan error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get tasks for specific workplan
router.get('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if workplan exists
    const workplan = await req.db.get(
      'SELECT id FROM workplans WHERE id = ?',
      [id]
    );
    
    if (!workplan) {
      return res.status(404).json({ error: 'Workplan not found' });
    }
    
    const tasks = await req.db.query(
      'SELECT * FROM workplan_tasks WHERE workplan_id = ? ORDER BY created_at',
      [id]
    );
    
    res.json({
      success: true,
      tasks: tasks,
      total: tasks.length
    });
    
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create task for workplan
router.post('/:id/tasks', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status = 'pending',
      priority = 'medium',
      due_date,
      assigned_to,
      progress = 0
    } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    // Check if workplan exists
    const workplan = await req.db.get(
      'SELECT id FROM workplans WHERE id = ?',
      [id]
    );
    
    if (!workplan) {
      return res.status(404).json({ error: 'Workplan not found' });
    }
    
    const result = await req.db.run(
      'INSERT INTO workplan_tasks (workplan_id, title, description, status, priority, due_date, assigned_to, progress) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, title, description, status, priority, due_date, assigned_to, progress]
    );
    
    // Get the created task
    const task = await req.db.get(
      'SELECT * FROM workplan_tasks WHERE id = ?',
      [result.id]
    );
    
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: task
    });
    
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Get counts by status
    const totalWorkplans = await req.db.get('SELECT COUNT(*) as count FROM workplans');
    const activeWorkplans = await req.db.get('SELECT COUNT(*) as count FROM workplans WHERE status = "active"');
    const completedWorkplans = await req.db.get('SELECT COUNT(*) as count FROM workplans WHERE status = "completed"');
    const plannedWorkplans = await req.db.get('SELECT COUNT(*) as count FROM workplans WHERE status = "planned"');
    const highPriority = await req.db.get('SELECT COUNT(*) as count FROM workplans WHERE priority = "high"');
    
    // Get recent workplans
    const recentWorkplans = await req.db.query(
      'SELECT * FROM workplans ORDER BY created_at DESC LIMIT 5'
    );
    
    // Add task counts to recent workplans
    for (let workplan of recentWorkplans) {
      const taskCount = await req.db.get(
        'SELECT COUNT(*) as count FROM workplan_tasks WHERE workplan_id = ?',
        [workplan.id]
      );
      workplan.task_count = taskCount.count;
    }
    
    res.json({
      success: true,
      dashboard: {
        total_workplans: totalWorkplans.count,
        active_workplans: activeWorkplans.count,
        completed_workplans: completedWorkplans.count,
        planned_workplans: plannedWorkplans.count,
        high_priority: highPriority.count,
        recent_workplans: recentWorkplans
      }
    });
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
