const express = require('express');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');
const { verifyToken, isProjectMember } = require('../middleware/auth');

const router = express.Router();

// Create task
router.post('/', verifyToken, [
  body('project_id').notEmpty().withMessage('Project ID is required'),
  body('title').notEmpty().withMessage('Task title is required'),
  body('description').optional().isString(),
  body('assigned_to').optional().isInt(),
  body('priority').isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('status').isIn(['todo', 'in_progress', 'completed']).withMessage('Invalid status'),
  body('due_date').optional().isISO8601().withMessage('Invalid date format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { project_id, title, description, assigned_to, priority, status, due_date } = req.body;
    const created_by = req.user.id;

    // Verify user is member of project
    const memberCheck = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [project_id, created_by]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    // Create task
    const result = await pool.query(
      `INSERT INTO tasks (project_id, title, description, assigned_to, priority, status, due_date, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [project_id, title, description || null, assigned_to || null, priority, status, due_date || null, created_by]
    );

    res.status(201).json({
      message: 'Task created successfully',
      task: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get tasks for a project
router.get('/project/:projectId', verifyToken, async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    // Verify user is member of project
    const memberCheck = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    const result = await pool.query(
      `SELECT t.*, u.name as assigned_to_name, u.email as assigned_to_email
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       WHERE t.project_id = $1
       ORDER BY t.created_at DESC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single task
router.get('/:taskId', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT t.*, u.name as assigned_to_name, u.email as assigned_to_email,
              p.id as project_id, p.name as project_name
       FROM tasks t
       LEFT JOIN users u ON t.assigned_to = u.id
       LEFT JOIN projects p ON t.project_id = p.id
       WHERE t.id = $1`,
      [taskId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const task = result.rows[0];

    // Verify user is member of project
    const memberCheck = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [task.project_id, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update task
router.put('/:taskId', verifyToken, [
  body('title').optional().notEmpty(),
  body('description').optional().isString(),
  body('assigned_to').optional().isInt(),
  body('priority').optional().isIn(['low', 'medium', 'high']),
  body('status').optional().isIn(['todo', 'in_progress', 'completed']),
  body('due_date').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { taskId } = req.params;
    const { title, description, assigned_to, priority, status, due_date } = req.body;
    const userId = req.user.id;

    // Get task and verify access
    const taskResult = await pool.query('SELECT project_id FROM tasks WHERE id = $1', [taskId]);
    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const projectId = taskResult.rows[0].project_id;

    const memberCheck = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (memberCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }

    // Update task
    const result = await pool.query(
      `UPDATE tasks
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           assigned_to = COALESCE($3, assigned_to),
           priority = COALESCE($4, priority),
           status = COALESCE($5, status),
           due_date = COALESCE($6, due_date),
           updated_at = NOW()
       WHERE id = $7
       RETURNING *`,
      [title || null, description || null, assigned_to || null, priority || null, status || null, due_date || null, taskId]
    );

    res.json({
      message: 'Task updated successfully',
      task: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete task
router.delete('/:taskId', verifyToken, async (req, res) => {
  try {
    const { taskId } = req.params;
    const userId = req.user.id;

    // Get task and verify access
    const taskResult = await pool.query(
      'SELECT project_id, created_by FROM tasks WHERE id = $1',
      [taskId]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const { project_id, created_by } = taskResult.rows[0];

    // Check if user is admin or creator
    const memberCheck = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [project_id, userId]
    );

    if (memberCheck.rows.length === 0 || (memberCheck.rows[0].role !== 'admin' && created_by !== userId)) {
      return res.status(403).json({ error: 'Not authorized to delete this task' });
    }

    await pool.query('DELETE FROM tasks WHERE id = $1', [taskId]);

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
