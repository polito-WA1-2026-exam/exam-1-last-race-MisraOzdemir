import db from './db.js';

export const saveGame = (userId, score) => {
    return new Promise((resolve, reject) => {
        db.run(`INSERT INTO games (user_id, score) VALUES (?, ?)`,
            [userId, score],
            (err) => {
                if (err) reject(err);
                else resolve();
            }
        );
    });
};

export const getTopScores = () => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT u.username, MAX(g.score) as best_score
             FROM games g
                      JOIN users u ON g.user_id = u.id
             GROUP BY g.user_id
             ORDER BY best_score DESC`,
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};