const express = require('express');
const { body, validationResult, param } = require('express-validator');
const pool = require('../config/database');
const { verifyToken, isProjectAdmin, isProjectMember } = require('../middleware/auth');

const router = express.Router();

// Create project (only authenticated users)
router.post('/', verifyToken, [
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;
    const userId = req.user.id;

    // Create project
    const projectResult = await pool.query(
      'INSERT INTO projects (name, description, created_by) VALUES ($1, $2, $3) RETURNING *',
      [name, description || null, userId]
    );

    const project = projectResult.rows[0];

    // Add creator as admin member
    await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3)',
      [project.id, userId, 'admin']
    );

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all projects for user
router.get('/', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT DISTINCT p.id, p.name, p.description, p.created_by, p.created_at
       FROM projects p
       INNER JOIN project_members pm ON p.id = pm.project_id
       WHERE pm.user_id = $1
       ORDER BY p.created_at DESC`,
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single project
router.get('/:projectId', verifyToken, isProjectMember, async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [projectId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update project (admin only)
router.put('/:projectId', verifyToken, isProjectAdmin, [
  body('name').optional().notEmpty(),
  body('description').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { name, description } = req.body;

    const result = await pool.query(
      'UPDATE projects SET name = COALESCE($1, name), description = COALESCE($2, description) WHERE id = $3 RETURNING *',
      [name || null, description || null, projectId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      message: 'Project updated successfully',
      project: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get project members
router.get('/:projectId/members', verifyToken, isProjectMember, async (req, res) => {
  try {
    const { projectId } = req.params;

    const result = await pool.query(
      `SELECT u.id, u.name, u.email, pm.role, pm.joined_at
       FROM project_members pm
       INNER JOIN users u ON pm.user_id = u.id
       WHERE pm.project_id = $1
       ORDER BY pm.joined_at DESC`,
      [projectId]
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add member to project (admin only)
router.post('/:projectId/members', verifyToken, isProjectAdmin, [
  body('email').isEmail().normalizeEmail(),
  body('role').isIn(['admin', 'member']).withMessage('Role must be admin or member')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { projectId } = req.params;
    const { email, role } = req.body;

    // Find user by email
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userId = userResult.rows[0].id;

    // Check if already member
    const existingMember = await pool.query(
      'SELECT id FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );

    if (existingMember.rows.length > 0) {
      return res.status(409).json({ error: 'User is already a member of this project' });
    }

    // Add member
    const result = await pool.query(
      'INSERT INTO project_members (project_id, user_id, role) VALUES ($1, $2, $3) RETURNING *',
      [projectId, userId, role]
    );

    res.status(201).json({
      message: 'Member added successfully',
      member: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
