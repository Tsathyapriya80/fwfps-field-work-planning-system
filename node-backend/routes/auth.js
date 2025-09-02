const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username
    const user = await req.db.get(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    // Update last login
    await req.db.run(
      'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [user.id]
    );

    // Store user in session
    req.session.userId = user.id;
    req.session.username = user.username;

    // Remove password hash from response
    delete user.password_hash;

    res.json({
      success: true,
      message: 'Login successful',
      user: user,
      token: `demo-token-${user.id}`
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Could not log out' });
    }
    res.json({
      success: true,
      message: 'Logout successful'
    });
  });
});

// Get current user profile
router.get('/profile', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    const user = await req.db.get(
      'SELECT id, username, email, full_name, role, department, is_active, created_at, last_login FROM users WHERE id = ?',
      [req.session.userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all users (admin only - simplified for demo)
router.get('/users', async (req, res) => {
  try {
    const users = await req.db.query(
      'SELECT id, username, email, full_name, role, department, is_active, created_at, last_login FROM users ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users: users
    });

  } catch (error) {
    console.error('Users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Register new user (demo purposes)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, full_name, role = 'user', department = '' } = req.body;

    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check if user already exists
    const existingUser = await req.db.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create new user
    const result = await req.db.run(
      'INSERT INTO users (username, email, password_hash, full_name, role, department) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, passwordHash, full_name, role, department]
    );

    // Get the created user
    const newUser = await req.db.get(
      'SELECT id, username, email, full_name, role, department, is_active, created_at FROM users WHERE id = ?',
      [result.id]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
