import { Button, Card, Container } from 'react-bootstrap';

function SetupPhase({ network, onStart }) {
    return (
        <Container className="py-4">
            <h2 className="mb-4">Network Map</h2>

            {network.lines.map(line => (
                <Card key={line.id} style={{ borderLeft: `4px solid ${line.color}`, marginBottom: '12px' }}>
                    <Card.Body>
                        {/* Line name colored with its own color */}
                        <Card.Title style={{ color: line.color }}>{line.name}</Card.Title>
                        <p className="mb-0">
                            {/* map over stations, join with arrow — last station gets no arrow */}
                            {line.stations.map((station, index) => (
                                <span key={station.id}>
                  {station.name}
                                    {index < line.stations.length - 1 && ' → '}
                </span>
                            ))}
                        </p>
                    </Card.Body>
                </Card>
            ))}

            <Button variant="success" className="mt-3" onClick={onStart}>
                Ready to Play
            </Button>
        </Container>
    );
}

export default SetupPhase;