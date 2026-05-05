const jwt = require('jsonwebtoken');
const pool = require('../config/database');

// Verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Check if user is admin of a project
const isProjectAdmin = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }
    
    if (result.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can perform this action' });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Check if user is member of a project
const isProjectMember = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;
    
    const result = await pool.query(
      'SELECT role FROM project_members WHERE project_id = $1 AND user_id = $2',
      [projectId, userId]
    );
    
    if (result.rows.length === 0) {
      return res.status(403).json({ error: 'Not a member of this project' });
    }
    
    req.userRole = result.rows[0].role;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  verifyToken,
  isProjectAdmin,
  isProjectMember
};
