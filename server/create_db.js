// Creates the database schema.
// Tables are created with "IF NOT EXISTS", so calling this on a database that
// already has the tables does nothing. The connection is passed in by the
// caller (db.js), which runs this once at server startup.
export function createTables(db) {
    db.run(`CREATE TABLE IF NOT EXISTS users (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 username TEXT NOT NULL UNIQUE,
                 password TEXT NOT NULL,
                 salt TEXT NOT NULL
            )`);

    db.run(`CREATE TABLE IF NOT EXISTS stations (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 name TEXT NOT NULL UNIQUE
            ) `);
    db.run(`CREATE TABLE IF NOT EXISTS lines (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 name TEXT NOT NULL UNIQUE,
                 color TEXT NOT NULL
            ) `);
    db.run(`CREATE TABLE IF NOT EXISTS line_stations (
                line_id INTEGER NOT NULL,
                station_id INTEGER NOT NULL,
                position INTEGER NOT NULL,
                FOREIGN KEY (line_id) REFERENCES lines(id),
                FOREIGN KEY (station_id) REFERENCES stations(id)
            )`);
    db.run(`CREATE TABLE IF NOT EXISTS events (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 description TEXT NOT NULL,
                 effect INTEGER NOT NULL
            ) `);
    db.run(`CREATE TABLE IF NOT EXISTS games (
                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                 user_id INTEGER NOT NULL,
                 score INTEGER NOT NULL,
                 FOREIGN KEY (user_id) REFERENCES users(id)
            ) `);
}
