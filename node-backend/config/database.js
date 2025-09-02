const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

class Database {
  constructor() {
    const dbPath = path.join(__dirname, '..', 'fwfps.db');
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database at:', dbPath);
      }
    });
  }

  async initialize() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Create users table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            department TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_login DATETIME
          )
        `);

        // Create workplans table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS workplans (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'planned',
            priority TEXT NOT NULL DEFAULT 'medium',
            start_date DATE,
            end_date DATE,
            assigned_to TEXT,
            progress INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            created_by INTEGER,
            FOREIGN KEY (created_by) REFERENCES users(id)
          )
        `);

        // Create workplan_tasks table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS workplan_tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            workplan_id INTEGER NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL DEFAULT 'pending',
            priority TEXT NOT NULL DEFAULT 'medium',
            due_date DATE,
            assigned_to TEXT,
            progress INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            FOREIGN KEY (workplan_id) REFERENCES workplans(id) ON DELETE CASCADE
          )
        `);

        // Create pac_operations table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS pac_operations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            operation_type TEXT NOT NULL,
            facility_name TEXT NOT NULL,
            facility_id TEXT,
            facility_address TEXT,
            operation_date DATETIME NOT NULL,
            status TEXT NOT NULL DEFAULT 'scheduled',
            priority TEXT NOT NULL DEFAULT 'medium',
            inspector TEXT,
            inspector_id INTEGER,
            notes TEXT,
            findings TEXT,
            risk_level TEXT DEFAULT 'low',
            compliance_status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            FOREIGN KEY (inspector_id) REFERENCES users(id)
          )
        `);

        // Create pac_samples table
        this.db.run(`
          CREATE TABLE IF NOT EXISTS pac_samples (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            operation_id INTEGER NOT NULL,
            sample_type TEXT NOT NULL,
            sample_description TEXT,
            collection_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            sample_location TEXT,
            test_type TEXT,
            status TEXT DEFAULT 'collected',
            results TEXT,
            lab_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (operation_id) REFERENCES pac_operations(id) ON DELETE CASCADE
          )
        `);

        // Initialize with sample data
        this.initializeSampleData();
        
        resolve();
      });
    });
  }

  initializeSampleData() {
    // Check if data already exists
    this.db.get('SELECT COUNT(*) as count FROM users', async (err, row) => {
      if (err) {
        console.error('Error checking users:', err);
        return;
      }

      if (row.count === 0) {
        console.log('Initializing database with sample data...');
        
        // Create sample users
        const adminPassword = await bcrypt.hash('admin123', 10);
        const analystPassword = await bcrypt.hash('analyst123', 10);
        
        this.db.run(`
          INSERT INTO users (username, email, password_hash, full_name, role, department)
          VALUES 
            ('admin', 'admin@fda.gov', ?, 'Administrator', 'admin', 'FWFPS'),
            ('analyst', 'analyst@fda.gov', ?, 'Data Analyst', 'analyst', 'Food Safety')
        `, [adminPassword, analystPassword]);

        // Create sample workplans
        this.db.run(`
          INSERT INTO workplans (title, description, status, priority, start_date, end_date, assigned_to, progress)
          VALUES 
            ('Q1 Food Safety Inspection Program', 'Comprehensive inspection program for food manufacturing facilities', 'active', 'high', '2025-01-01', '2025-03-31', 'FDA Team Alpha', 75),
            ('Dietary Supplement Compliance Review', 'Review compliance status of dietary supplement manufacturers', 'planned', 'medium', '2025-02-01', '2025-04-30', 'FDA Team Beta', 25),
            ('Import Food Safety Assessment', 'Assessment of imported food products safety measures', 'active', 'high', '2025-01-15', '2025-06-15', 'FDA Team Gamma', 60)
        `);

        // Create sample PAC operations
        this.db.run(`
          INSERT INTO pac_operations (operation_type, facility_name, facility_id, operation_date, status, priority, inspector, notes)
          VALUES 
            ('inspection', 'Global Foods Manufacturing Inc.', 'FDA-12345', '2025-02-15 09:00:00', 'scheduled', 'high', 'John Smith', 'Routine inspection - follow up on previous findings'),
            ('sampling', 'Fresh Produce Distributors LLC', 'FDA-67890', '2025-02-20 14:30:00', 'completed', 'medium', 'Sarah Johnson', 'Samples collected for pesticide residue testing'),
            ('audit', 'Organic Grains Processing Co.', 'FDA-11111', '2025-03-01 10:00:00', 'in_progress', 'high', 'Mike Davis', 'Comprehensive audit of HACCP implementation')
        `);

        console.log('Sample data initialized successfully');
      }
    });
  }

  // Helper methods for common database operations
  async query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err);
        } else {
          console.log('Database connection closed');
        }
        resolve();
      });
    });
  }
}

module.exports = Database;
