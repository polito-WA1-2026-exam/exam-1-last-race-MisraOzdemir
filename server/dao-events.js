import db from './db.js';

export const getRandomEvent = () =>{
    return new Promise((resolve, reject) => {
        db.get(`SELECT * FROM events ORDER BY RANDOM() LIMIT 1`, (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}