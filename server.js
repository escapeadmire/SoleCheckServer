const express = require('express');
const mysql = require('mysql2');
const app = express();
app.use(express.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'solecheck_db',
    port: 3306 // Ensure MySQL connection uses port 3306
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to database.');
    }
});

// Endpoint to Verify NFC Data
app.post('/verify', (req, res) => {
    const { nfcData } = req.body;

    if (!nfcData) {
        return res.status(400).json({ error: 'No NFC data provided.' });
    }

    const query = 'SELECT * FROM shoes WHERE nfc_tag = ?';
    db.query(query, [nfcData], (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        if (results.length > 0) {
            res.json({ valid: true, shoeName: results[0].name });
        } else {
            res.json({ valid: false });
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, 'localhost', () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('Shutting down server...');
    db.end((err) => {
        if (err) {
            console.error('Error during database disconnection:', err);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});
