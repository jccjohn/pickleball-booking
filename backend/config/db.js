const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));

const initializeDatabase = () => {
    db.serialize(() => {
        // Users table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Courts table
        db.run(`CREATE TABLE IF NOT EXISTS courts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            status TEXT DEFAULT 'available',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Bookings table
        db.run(`CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            court_id INTEGER NOT NULL,
            user_id INTEGER NOT NULL,
            booking_date DATE NOT NULL,
            start_time TIME NOT NULL,
            end_time TIME NOT NULL,
            status TEXT DEFAULT 'active',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (court_id) REFERENCES courts (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Insert default courts if they don't exist
        db.get("SELECT COUNT(*) as count FROM courts", (err, row) => {
            if (err) {
                console.error(err);
                return;
            }
            if (row.count === 0) {
                const defaultCourts = [
                    ['Court 1'],
                    ['Court 2'],
                    ['Court 3'],
                    ['Court 4']
                ];
                const stmt = db.prepare("INSERT INTO courts (name) VALUES (?)");
                defaultCourts.forEach(court => stmt.run(court));
                stmt.finalize();
            }
        });
    });
};

module.exports = {
    db,
    initializeDatabase
};
