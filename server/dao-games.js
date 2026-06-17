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

// Randomly selects two different stations as start and end points
// Takes the stations array as parameter to avoid an extra DB call
export const getRandomStartEnd = (stations) => {
    // Pick a random index for start station
    const startIndex = Math.floor(Math.random() * stations.length);

    let endIndex;
    do {
        // Keep picking until we get a different station than start
        endIndex = Math.floor(Math.random() * stations.length);
    } while (endIndex === startIndex);

    return {
        startStation: stations[startIndex],
        endStation: stations[endIndex]
    };
};