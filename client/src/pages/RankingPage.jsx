import { useState, useEffect } from 'react';
import { Container, Table } from 'react-bootstrap';

function RankingPage() {
    const [ranking, setRanking] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/api/ranking', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setRanking(data));
    }, []);

    return (
        <Container className="mt-4">
            <h2>🏆 Ranking</h2>
            <Table striped bordered hover className="mt-3">
                <thead>
                <tr>
                    <th>#</th>
                    <th>Player</th>
                    <th>Best Score</th>
                </tr>
                </thead>
                <tbody>
                {ranking.map((entry, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{entry.username}</td>
                        <td>{entry.best_score} 🪙</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </Container>
    );
}

export default RankingPage;