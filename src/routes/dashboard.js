const express = require('express');
const pool = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Total projects
    const projectsResult = await pool.query(
      `SELECT COUNT(*) as total FROM projects p
       INNER JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = $1`,
      [userId]
    );

    // Total tasks assigned
    const tasksResult = await pool.query(
      `SELECT COUNT(*) as total FROM tasks WHERE assigned_to = $1`,
      [userId]
    );

    // Tasks by status
    const statusResult = await pool.query(
      `SELECT status, COUNT(*) as count FROM tasks
       WHERE assigned_to = $1
       GROUP BY status`,
      [userId]
    );

    // Overdue tasks
    const overdueResult = await pool.query(
      `SELECT COUNT(*) as total FROM tasks
       WHERE assigned_to = $1 AND status != 'completed' AND due_date < NOW()`,
      [userId]
    );

    const stats = {
      total_projects: parseInt(projectsResult.rows[0].total),
      total_assigned_tasks: parseInt(tasksResult.rows[0].total),
      overdue_tasks: parseInt(overdueResult.rows[0].total),
      tasks_by_status: statusResult.rows.reduce((acc, row) => {
        acc[row.status] = parseInt(row.count);
        return acc;
      }, {})
    };

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's assigned tasks
router.get('/my-tasks', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status } = req.query;

    let query = `
      SELECT t.*, p.name as project_name, u.name as created_by_name
      FROM tasks t
      INNER JOIN projects p ON t.project_id = p.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.assigned_to = $1
    `;
    const params = [userId];

    if (status) {
      query += ` AND t.status = $2`;
      params.push(status);
    }

    query += ` ORDER BY t.due_date ASC NULLS LAST`;

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get overdue tasks
router.get('/overdue', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT t.*, p.name as project_name, u.name as created_by_name
       FROM tasks t
       INNER JOIN projects p ON t.project_id = p.id
       LEFT JOIN users u ON t.created_by = u.id
       WHERE t.assigned_to = $1 AND t.status != 'completed' AND t.due_date < NOW()
       ORDER BY t.due_date ASC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
