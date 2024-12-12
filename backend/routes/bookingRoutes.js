const express = require('express');
const { db } = require('../config/db');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Create a booking
router.post('/', auth, (req, res) => {
    const { court_id, booking_date, start_time, end_time } = req.body;
    const user_id = req.user.id;

    // Validate input
    if (!court_id || !booking_date || !start_time || !end_time) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for existing bookings in the same time slot
    const checkQuery = `
        SELECT id FROM bookings 
        WHERE court_id = ? 
        AND booking_date = ? 
        AND status = 'active'
        AND ((start_time <= ? AND end_time > ?) 
        OR (start_time < ? AND end_time >= ?)
        OR (start_time >= ? AND end_time <= ?))
    `;

    db.get(checkQuery, 
        [court_id, booking_date, start_time, start_time, end_time, end_time, start_time, end_time],
        (err, existing) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (existing) {
                return res.status(400).json({ error: 'Time slot already booked' });
            }

            // Create the booking
            const insertQuery = `
                INSERT INTO bookings (court_id, user_id, booking_date, start_time, end_time)
                VALUES (?, ?, ?, ?, ?)
            `;

            db.run(insertQuery, [court_id, user_id, booking_date, start_time, end_time],
                function(err) {
                    if (err) {
                        return res.status(500).json({ error: 'Error creating booking' });
                    }
                    res.status(201).json({
                        id: this.lastID,
                        court_id,
                        user_id,
                        booking_date,
                        start_time,
                        end_time
                    });
                }
            );
        }
    );
});

// Get user's bookings
router.get('/user', auth, (req, res) => {
    const query = `
        SELECT b.*, c.name as court_name
        FROM bookings b
        JOIN courts c ON b.court_id = c.id
        WHERE b.user_id = ?
        AND b.booking_date >= date('now')
        ORDER BY b.booking_date, b.start_time
    `;

    db.all(query, [req.user.id], (err, bookings) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(bookings);
    });
});

// Cancel booking
router.put('/:id/cancel', auth, (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    db.run(
        'UPDATE bookings SET status = ? WHERE id = ? AND user_id = ?',
        ['cancelled', id, user_id],
        function(err) {
            if (err) {
                return res.status(500).json({ error: 'Error cancelling booking' });
            }
            if (this.changes === 0) {
                return res.status(404).json({ error: 'Booking not found or unauthorized' });
            }
            res.json({ message: 'Booking cancelled successfully' });
        }
    );
});

module.exports = router;
