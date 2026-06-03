import express from 'express';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { getUserByUsername, getUserById, verifyPassword } from './dao-users.js';
import { getNetwork, getStations, getLines } from './dao-network.js';
import { getRandomEvent } from './dao-events.js';
import { saveGame, getTopScores } from './dao-games.js';

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});