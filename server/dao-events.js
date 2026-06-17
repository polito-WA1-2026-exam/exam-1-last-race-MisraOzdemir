import db from './db.js';

export const getEvents = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM events`, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
};