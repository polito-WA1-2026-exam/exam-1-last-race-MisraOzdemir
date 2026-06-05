import db from './db.js';
import crypto from 'crypto';

export const getUserByUsername = (username) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export const getUserById = (id) => {
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

export const verifyPassword = (user, password) => {
    const hash = crypto.scryptSync(password, user.salt, 32).toString('hex');
    return hash === user.password;
}