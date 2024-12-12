const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if user exists
        db.get('SELECT id FROM users WHERE email = ? OR username = ?', [email, username], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (user) {
                return res.status(400).json({ error: 'User already exists' });
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            db.run('INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error creating user' });
                    }

                    const token = jwt.sign(
                        { id: this.lastID, username, role: 'user' },
                        process.env.JWT_SECRET,
                        { expiresIn: '24h' }
                    );

                    res.status(201).json({ token });
                }
            );
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (!user) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid credentials' });
            }

            const token = jwt.sign(
                { id: user.id, username: user.username, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '24h' }
            );

            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get current user
router.get('/me', auth, (req, res) => {
    db.get('SELECT id, username, email, role FROM users WHERE id = ?', [req.user.id], (err, user) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(user);
    });
});

module.exports = router;
