import sqlite3 from 'sqlite3';
import crypto from 'crypto';

const db = new sqlite3.Database('lastrace.db', (err) => {
    if (err) throw err;
});

db.serialize(() => {
    // Lines seed data — 5 lines
    db.run(`INSERT INTO lines (name, color) VALUES ('M1', '#FF0000')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M2', '#0000FF')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M3', '#00FF00')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M4', '#FFD700')`);
    db.run(`INSERT INTO lines (name, color) VALUES ('M5', '#800080')`);

    // stations: [name, is_interchange]
    // is_interchange = 1 means passengers can change lines here
    // IMPORTANT: a station can be on multiple lines but still NOT be an interchange.
    const stations = [
        ['Sesto', 0],           // 1  M1
        ['Loreto', 1],          // 2  M1+M2 interchange
        ['Lima', 1],            // 3  M1+M5 interchange
        ['Duomo', 1],           // 4  M1+M3+M4 interchange
        ['Cadorna', 0],         // 5  M1
        ['Pagano', 0],          // 6  M1
        ['Molino', 0],          // 7  M1
        ['Cologno', 0],         // 8  M2
        ['Centrale', 1],        // 9  M2+M3+M5 interchange
        ['Gioia', 1],           // 10 M2+M5 interchange
        ['Famagosta', 0],       // 11 M2
        ['Maciachini', 0],      // 12 M3
        ['Missori', 0],         // 13 M3
        ['Brenta', 0],          // 14 M3
        ['Lodi', 0],            // 15 M3
        ['San Babila', 0],      // 16 M4
        ["Sant'Ambrogio", 0],   // 17 M4
        ['Solari', 0],          // 18 M4
        ['Romolo', 0],          // 19 M4
        ['Bicocca', 0],         // 20 M5
        ['Bignami', 0],         // 21 M5
    ];

    for (const [name, isInterchange] of stations) {
        db.run(`INSERT INTO stations (name, is_interchange) VALUES (?, ?)`, [name, isInterchange]);
    }

    // line_stations: [line_id, station_id, position]
    const lineStations = [
        // M1: Sesto → Loreto → Lima → Duomo → Cadorna → Pagano → Molino
        [1, 1, 1], [1, 2, 2], [1, 3, 3], [1, 4, 4], [1, 5, 5], [1, 6, 6], [1, 7, 7],
        // M2: Cologno → Loreto → Centrale → Gioia → Famagosta
        [2, 8, 1], [2, 2, 2], [2, 9, 3], [2, 10, 4], [2, 11, 5],
        // M3: Maciachini → Centrale → Duomo → Missori → Brenta → Lodi
        [3, 12, 1], [3, 9, 2], [3, 4, 3], [3, 13, 4], [3, 14, 5], [3, 15, 6],
        // M4: San Babila → Duomo → Sant'Ambrogio → Solari → Romolo
        [4, 16, 1], [4, 4, 2], [4, 17, 3], [4, 18, 4], [4, 19, 5],
        // M5: Bicocca → Gioia → Centrale → Lima → Bignami
        [5, 20, 1], [5, 10, 2], [5, 9, 3], [5, 3, 4], [5, 21, 5],
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
        db.run(`INSERT INTO events (description, effect) VALUES (?, ?)`, [description, effect]);
    }

    // salt: random string unique to each user, prevents same passwords having same hash
    // scryptSync: one way hash function, combines password + salt to produce a hash
    // only the hash and salt are stored, never the plain password
    // on login: re hash the entered password with the stored salt, compare with stored hash
    const users = [
        { username: 'misra', password: '123' },
        { username: 'emir', password: '456' },
        { username: 'pingu', password: '789' }
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