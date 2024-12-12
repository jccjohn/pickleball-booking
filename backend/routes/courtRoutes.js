const express = require('express');
const { db } = require('../config/db');
const { auth, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all courts
router.get('/', auth, (req, res) => {
    db.all('SELECT * FROM courts', (err, courts) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(courts);
    });
});

// Get court availability for a specific date
router.get('/availability', auth, (req, res) => {
    const { date } = req.query;
    
    if (!date) {
        return res.status(400).json({ error: 'Date is required' });
    }

    const query = `
        SELECT 
            c.id, 
            c.name,
            b.booking_date,
            b.start_time,
            b.end_time,
            b.status as booking_status
        FROM courts c
        LEFT JOIN bookings b ON c.id = b.court_id 
        AND b.booking_date = ? 
        AND b.status = 'active'
        ORDER BY c.id, b.start_time
    `;

    db.all(query, [date], (err, availability) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Process the results to show available time slots
        const courtAvailability = {};
        availability.forEach(slot => {
            if (!courtAvailability[slot.id]) {
                courtAvailability[slot.id] = {
                    id: slot.id,
                    name: slot.name,
                    bookings: []
                };
            }
            if (slot.booking_date) {
                courtAvailability[slot.id].bookings.push({
                    date: slot.booking_date,
                    start_time: slot.start_time,
                    end_time: slot.end_time,
                    status: slot.booking_status
                });
            }
        });

        res.json(Object.values(courtAvailability));
    });
});

// Admin: Add new court
router.post('/', [auth, isAdmin], (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Court name is required' });
    }

    db.run('INSERT INTO courts (name) VALUES (?)', [name], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error creating court' });
        }
        res.status(201).json({ id: this.lastID, name });
    });
});

// Admin: Update court status
router.put('/:id', [auth, isAdmin], (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ error: 'Status is required' });
    }

    db.run('UPDATE courts SET status = ? WHERE id = ?', [status, id], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error updating court' });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Court not found' });
        }
        res.json({ message: 'Court updated successfully' });
    });
});

module.exports = router;
