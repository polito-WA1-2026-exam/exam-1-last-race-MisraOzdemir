import sqlite from 'sqlite3';
import { createTables } from './create_db.js';
import { seedDatabase } from './seed.js';

// Opens the database. On a fresh clone the file does not exist yet, so SQLite
// creates it here (empty). We then make sure the schema and the initial data
// are in place, so the app works right after "npm install; nodemon index.js"
// without committing the .db file to the repository.
const db = new sqlite.Database('lastrace.db', (err) => {
    if (err) throw err;
});

db.serialize(() => {
    // Always ensure the tables exist (no-op if they already do)
    createTables(db);

    // Seed only when the database is empty, so restarting the server does not
    // duplicate the data
    db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
        if (err) throw err;
        if (row.count === 0) {
            seedDatabase(db);
            console.log('Database created and seeded.');
        }
    });
});

export default db;
