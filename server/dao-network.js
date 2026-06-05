import db from './db.js';

export const getStations = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM stations`,  (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

export const getLines = () => {
    return new Promise((resolve, reject) => {
        db.all(`SELECT * FROM lines`,  (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// Returns all line-station relationships with full line and station details
// JOIN combines line_stations with lines and stations tables
// Ordered by line then position to get stations in correct sequence
export const getNetwork = () => {
    return new Promise((resolve, reject) => {
        db.all(
            `SELECT l.id as line_id, l.name as line_name, l.color,
              s.id as station_id, s.name as station_name,
              ls.position
       FROM line_stations ls
       JOIN lines l ON ls.line_id = l.id
       JOIN stations s ON ls.station_id = s.id
       ORDER BY l.id, ls.position`,
            (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            }
        );
    });
};