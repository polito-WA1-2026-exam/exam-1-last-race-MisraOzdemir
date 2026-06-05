import { Container, Card, ListGroup, Badge } from 'react-bootstrap';

function InstructionsPage() {
    return (
        <Container className="mt-4" style={{ maxWidth: '800px' }}>
            <h2 className="mb-4">🚇 How to Play</h2>

            <Card className="mt-3 border-0 shadow-sm">
                <Card.Body className="bg-success text-white rounded">
                    <Card.Title>Game Overview</Card.Title>
                    <Card.Text>
                        Navigate through the city metro network to reach your destination.
                        You start with <strong>20 coins</strong> random events along the way will affect your score!
                    </Card.Text>
                </Card.Body>
            </Card>

            <Card className="mt-3 border-0 shadow-sm">
                <Card.Body>
                    <Card.Title>Game Phases</Card.Title>
                    <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex gap-2 align-items-start">
                            <Badge bg="secondary">1</Badge>
                            <div><strong>Setup</strong> — Study the full network map with all lines and connections.</div>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex gap-2 align-items-start">
                            <Badge bg="warning" text="dark">2</Badge>
                            <div><strong>Planning</strong> — You have 90 seconds to build your route. Only station names shown, no lines!</div>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex gap-2 align-items-start">
                            <Badge bg="info">3</Badge>
                            <div><strong>Execution</strong> — Your route is validated. Random events affect your coins each step.</div>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex gap-2 align-items-start">
                            <Badge bg="success">4</Badge>
                            <div><strong>Result</strong> — Your final score is shown. Play again to beat your best!</div>
                        </ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>

            <Card className="mt-3 border-0 shadow-sm">
                <Card.Body>
                    <Card.Title>Rules</Card.Title>
                    <ListGroup variant="flush">
                        <ListGroup.Item>🪙 Start with 20 coins</ListGroup.Item>
                        <ListGroup.Item>🗺️ Route must start and end at assigned stations</ListGroup.Item>
                        <ListGroup.Item>🔄 Line changes only allowed at interchange stations</ListGroup.Item>
                        <ListGroup.Item>❌ Invalid or incomplete route = 0 coins</ListGroup.Item>
                        <ListGroup.Item>⚠️ Final score cannot go below 0</ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </Container>
    );
}

export default InstructionsPage;