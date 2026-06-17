import sqlite3 from 'sqlite3';
import crypto from 'crypto';


const db = new sqlite3.Database('lastrace.db', (err) => {
    if (err) throw err;
});

db.serialize(() => {
    // Lines seed data
    db.run(`INSERT INTO lines (name, color) VALUES ('M1', '#FF0000')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M2', '#0000FF')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M3', '#00FF00')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M4', '#FFD700')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M5', '#800080')`);

    // stations
    const stations = [
        'Sesto', 'Loreto', 'Lima', 'Duomo', 'Cadorna', 'Pagano',
        'Cologno', 'Centrale', 'Gioia', 'Maciachini', 'Missori',
        'Brenta', 'San Babila', "Sant'Ambrogio", 'Solari', 'Bicocca'
    ];

    for (const name of stations) {
        db.run(`INSERT INTO stations (name) VALUES (?)`, [name]);
    }


    // line_stations: bridge table connecting lines and stations
    // each entry: [line_id, station_id, position]
    // position = order of station on the line (used to determine neighbors)
    // two stations on the same line with position difference of 1 are neighbors (= a segment)
    // stations appearing in multiple lines are interchange stations
    const lineStations = [
        // M1: Sesto → Loreto → Lima → Duomo → Cadorna → Pagano
        [1, 1, 1], [1, 2, 2], [1, 3, 3], [1, 4, 4], [1, 5, 5], [1, 6, 6],
        // M2: Cologno → Loreto → Centrale → Gioia
        [2, 7, 1], [2, 2, 2], [2, 8, 3], [2, 9, 4],
        // M3: Maciachini → Centrale → Duomo → Missori → Brenta
        [3, 10, 1], [3, 8, 2], [3, 4, 3], [3, 11, 4], [3, 12, 5],
        // M4: San Babila → Duomo → Sant'Ambrogio → Solari
        [4, 13, 1], [4, 4, 2], [4, 14, 3], [4, 15, 4],
        // M5: Bicocca → Gioia → Centrale
        [5, 16, 1], [5, 9, 2], [5, 8, 3]
    ];

    // destructuring: each inner array is split into 3 variables automatically
    for (const [lineId, stationId, position] of lineStations) {
        db.run(
            `INSERT INTO line_stations (line_id, station_id, position) VALUES (?, ?, ?)`,
            [lineId, stationId, position]
        );
    }

    // events: description and effect on score
    const events = [
        ['Quiet journey', 0],
        ['Wrong platform', -2],
        ['Kind passenger', +1],
        ['Emergency stop', -3],
        ['Free newspaper', +1],
        ['Pickpocket', -4],
        ['Early train', +2],
        ['Signal failure', -3],
        ['Friendly conductor', +3],
        ['Missed stop', -2]
    ];

    for (const [description, effect] of events) {
        db.run(
            `INSERT INTO events (description, effect) VALUES (?, ?)`,
            [description, effect]
        );
    }

    // salt: random string unique to each user, prevents same passwords having same hash
    // scryptSync: one way hash function, combines password + salt to produce a hash
    // only the hash and salt are stored, never the plain password
    // on login: re hash the entered password with the stored salt, compare with stored hash
    const users = [
        { username: 'misra', password: 'password123' },
        { username: 'emir', password: 'password456' },
        { username: 'pingu', password: 'password789' }
    ];

    for (const user of users) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.scryptSync(user.password, salt, 32).toString('hex');
        db.run(
            `INSERT INTO users (username, password, salt) VALUES (?, ?, ?)`,
            [user.username, hash, salt]
        );
    }

    // games seed data misra (user_id: 1) and emir (user_id: 2)
    db.run(`INSERT INTO games (user_id, score) VALUES (1, 25)`);
    db.run(`INSERT INTO games (user_id, score) VALUES (1, 12)`);
    db.run(`INSERT INTO games (user_id, score) VALUES (2, 20)`);
    db.run(`INSERT INTO games (user_id, score) VALUES (2, 7)`);
});

db.close();