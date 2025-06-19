require('dotenv').config();
const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database\n');

    db.query('SHOW DATABASES', (err, results) => {
        if (err) {
            console.error('Error fetching databases:', err);
            return;
        }
        console.log('Databases:', results);
    });

    db.query('USE epytodo', (err) => {
        if (err) {
            console.error('Error selecting database:', err);
            return;
        }
        console.log('Database selected\n');
    });

    db.query('SHOW TABLES', (err, results) => {
        if (err) {
            console.error('Error fetching tables:', err);
            return;
        }
        console.log('Tables:', results);
    });

    db.query('SELECT * FROM user', (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return;
        }
        console.log('Users:', results);
    });

    db.query('SELECT * FROM todo', (err, results) => {
        if (err) {
            console.error('Error fetching tasks:', err);
            return;
        }
        console.log('Tasks:', results);
    });
});

module.exports = db;