import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { getUserByUsername, getUserById, verifyPassword } from './dao-users.js';
import { getNetwork, getStations, getLines } from './dao-network.js';
import { saveGame, getTopScores, getRandomStartEnd } from './dao-games.js';
import { getEvents } from './dao-events.js';
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

app.post('/api/games/validate', async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    const { playerRoute, startStation, endStation } = req.body;

    // Basic input validation
    if (!playerRoute || !Array.isArray(playerRoute) || playerRoute.length === 0) {
        return res.status(400).json({ message: 'Invalid route' });
    }

    try {
        const networkRows = await getNetwork();
        const validation = validateRoute(playerRoute, networkRows, startStation, endStation);

        if (!validation.valid) {
            // Invalid route — save score as 0 and return
            await saveGame(req.user.id, 0);
            return res.json({ valid: false, finalScore: 0 });
        }

        // Valid route — get all events for random selection
        const events = await getEvents();

        // For each segment, pick a random event and calculate running coin total
        let coins = 20; // starting coins
        const steps = playerRoute.map(segment => {
            const event = events[Math.floor(Math.random() * events.length)];
            coins = Math.max(0, coins + event.effect); // score can't go below 0
            return {
                from: segment.from,
                to: segment.to,
                event: event.description,
                effect: event.effect,
                coins
            };
        });

        const finalScore = coins;
        await saveGame(req.user.id, finalScore);

        res.json({ valid: true, steps, finalScore });

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

// Validates a player's route against the network rules
// Returns { valid: true/false, reason: string }
function validateRoute(playerRoute, networkRows, startStation, endStation) {

    // Rule 1: must start at assigned station
    if (playerRoute[0].from !== startStation) {
        return { valid: false, reason: 'Wrong start station' };
    }

    // Rule 2: must end at assigned station
    if (playerRoute[playerRoute.length - 1].to !== endStation) {
        return { valid: false, reason: 'Wrong end station' };
    }

    // Rule 3a: no segment used more than once
    const usedSegments = new Set();
    for (const segment of playerRoute) {
        const key = [segment.from, segment.to].sort().join('-');
        if (usedSegments.has(key)) {
            return { valid: false, reason: 'Segment used more than once' };
        }
        usedSegments.add(key);
    }

    // Build a map: "StationA-StationB" → [line_id, line_id, ...]
    // This tells us which lines cover each segment
    const segmentLines = {};
    for (let i = 0; i < networkRows.length - 1; i++) {
        const curr = networkRows[i];
        const next = networkRows[i + 1];

        // Only pair stations on the same line with consecutive positions
        if (curr.line_id === next.line_id && next.position === curr.position + 1) {
            const key = [curr.station_name, next.station_name].sort().join('-');
            if (!segmentLines[key]) segmentLines[key] = [];
            segmentLines[key].push(curr.line_id);
        }
    }

    // Build interchange set from the explicit is_interchange flag.
    // A station may be on multiple lines but still NOT be an interchange,
    // so we read the flag instead of counting lines.
    const interchanges = new Set(
        networkRows
            .filter(row => row.is_interchange === 1)
            .map(row => row.station_name)
    );

    // Rule 3: validate each segment
    let currentLine = null;

    for (const segment of playerRoute) {
        const key = [segment.from, segment.to].sort().join('-');
        const linesForSegment = segmentLines[key];

        // Segment doesn't exist in the network
        if (!linesForSegment || linesForSegment.length === 0) {
            return { valid: false, reason: `Segment ${segment.from}-${segment.to} not in network` };
        }

        if (currentLine === null) {
            // First segment — pick any line that covers it
            currentLine = linesForSegment[0];
        } else if (linesForSegment.includes(currentLine)) {
            // Same line continues — no change needed
        } else {
            // Line change needed — from station must be an interchange
            if (!interchanges.has(segment.from)) {
                return { valid: false, reason: `Cannot change line at ${segment.from}` };
            }
            // Switch to a line that covers this segment
            currentLine = linesForSegment[0];
        }
    }

    return { valid: true };
}

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});