import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { getUserByUsername, getUserById, verifyPassword } from './dao-users.js';
import { getNetwork, getStations, getLines } from './dao-network.js';
import { saveGame, getTopScores, getRandomStartEnd } from './dao-games.js';
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(session({
    secret: 'lastrace-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true }
}));
// passport.initialize() — activates passport for each incoming request
app.use(passport.initialize());
// passport.session() — allows passport to read the user from the session cookie
app.use(passport.session());
app.use(express.json());

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        const user = await getUserByUsername(username);
        if (!user) return done(null, false, { message: 'User not found' });

        const valid = verifyPassword(user, password);
        if (!valid) return done(null, false, { message: 'Wrong password' });

        return done(null, user);
    } catch (err) {
        return done(err);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});

// Authentication routes
// 1- Login route
app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ id: req.user.id, username: req.user.username });
});
// 2- Logout route
app.post('/api/logout', (req, res) => {
    req.logout(() => {
        res.json({ message: 'Logged out successfully' });
    });
});
// 3- session check route
app.get('/api/session', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ id: req.user.id, username: req.user.username });
    } else {
        res.status(401).json({ message: 'Not authenticated' });
    }
});

// Network routes
app.get('/api/network', async (req, res) => {
    // check if user is logged in, if not return 401 - authentication required
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const network = await getNetwork();
        res.json(network);
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

app.get('/api/ranking', async (req, res) => {
    // check if user is logged in, if not return 401 - authentication required
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        const ranking = await getTopScores();
        res.json(ranking);
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});

// Game start route — assigns random start/end stations and returns full network data
app.get('/api/games/start', async (req, res) => {
    // Only logged in users can start a game
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }
    try {
        // Fetch raw network rows and station list from DB
        const rows = await getNetwork();
        const stations = await getStations();

        // Build structured lines and segments from raw rows
        const { lines, segments } = buildNetworkData(rows);

        // Pick random start and end stations (different from each other)
        const { startStation, endStation } = getRandomStartEnd(stations);

        res.json({
            startStation,
            endStation,
            stations,
            lines,
            segments
        });
    } catch (err) {
        res.status(500).json({ message: 'Database error' });
    }
});


function buildNetworkData(rows) {
    // rows: getNetwork()'ten gelen ham satırlar

    // Adım 1: line_id'ye göre grupla
    const grouped = {};
    for (const row of rows) {
        if (!grouped[row.line_id]) grouped[row.line_id] = [];
        grouped[row.line_id].push(row);
    }

    const lines = [];
    const segmentSet = new Set(); // duplicate önlemek için
    const segments = [];

    // Adım 2: her hat için...
    for (const lineId in grouped) {
        const stops = grouped[lineId]; // bu hattın istasyonları, pozisyona göre sıralı

        // lines dizisini doldur
        lines.push({
            id: Number(lineId),
            name: stops[0].line_name,
            color: stops[0].color,
            stations: stops.map(s => ({ id: s.station_id, name: s.station_name }))
        });

        // Adım 3: ardışık çiftlerden segment üret
        for (let i = 0; i < stops.length - 1; i++) {
            const a = stops[i].station_name;
            const b = stops[i + 1].station_name;

            // duplicate kontrolü — aynı segment iki hatta da olabilir
            const key = [a, b].sort().join('—');
            if (!segmentSet.has(key)) {
                segmentSet.add(key);
                segments.push({ from: a, to: b });
            }
        }
    }

    return { lines, segments };
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});