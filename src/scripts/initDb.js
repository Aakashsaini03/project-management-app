const pool = require('../config/database');

const initDatabase = async () => {
  try {
    console.log('🗄️  Initializing database...');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Users table created');

    // Create projects table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Projects table created');

    // Create project_members table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS project_members (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role VARCHAR(50) CHECK (role IN ('admin', 'member')) DEFAULT 'member',
        joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, user_id)
      )
    `);
    console.log('✅ Project Members table created');

    // Create tasks table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(50) CHECK (status IN ('todo', 'in_progress', 'completed')) DEFAULT 'todo',
        priority VARCHAR(50) CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
        assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
        created_by INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        due_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tasks table created');

    // Create indexes for performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_project_members_user ON project_members(user_id);
      CREATE INDEX IF NOT EXISTS idx_project_members_project ON project_members(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    `);
    console.log('✅ Indexes created');

    console.log('\n🎉 Database initialization completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Database initialization failed:', err.message);
    process.exit(1);
  }
};

initDatabase();
