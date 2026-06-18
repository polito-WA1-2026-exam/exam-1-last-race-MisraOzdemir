import { useNavigate } from 'react-router-dom';
import { Container, Card, ListGroup, Badge, Button, Row, Col } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';

function InstructionsPage() {
    const { user } = useUser();
    const navigate = useNavigate();

    return (
        <Container className="py-4" style={{ maxWidth: '900px', overflowY: 'auto' }}>
            <div className="text-center mb-4">
                <h2 className="fw-bold">🚇 How to Play</h2>
                <p className="text-muted">Memorize the map, plan your route, survive the journey!</p>
            </div>

            <Card className="mb-3 overview-card shadow-sm">
                <Card.Body className="text-white rounded">
                    <Card.Title className="fw-bold">Game Overview</Card.Title>
                    <Card.Text>
                        Navigate through the city metro network to reach your destination.
                        You start with <strong>20 coins</strong> — random events along the way will affect your score!
                    </Card.Text>
                    {user && (
                        <Button variant="light" className="mt-2 fw-bold" onClick={() => navigate('/game')}>
                            Play Now →
                        </Button>
                    )}
                </Card.Body>
            </Card>

            <Row>
                <Col md={7}>
                    <Card className="border-0 shadow-sm h-100 light-card">
                        <Card.Body>
                            <Card.Title className="fw-bold">Game Phases</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item className="d-flex gap-3 align-items-start py-3">
                                    <Badge style={{ background: '#6366f1', minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>1</Badge>
                                    <div><strong>Setup</strong> — Study the full network map with all lines and connections.</div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex gap-3 align-items-start py-3">
                                    <Badge bg="warning" text="dark" style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>2</Badge>
                                    <div><strong>Planning</strong> — 90 seconds to build your route. Lines hidden — memory only!</div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex gap-3 align-items-start py-3">
                                    <Badge bg="info" style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>3</Badge>
                                    <div><strong>Execution</strong> — Route validated. Random events affect your coins each stop.</div>
                                </ListGroup.Item>
                                <ListGroup.Item className="d-flex gap-3 align-items-start py-3">
                                    <Badge bg="success" style={{ minWidth: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>4</Badge>
                                    <div><strong>Result</strong> — Final score shown. Play again to beat your best!</div>
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={5}>
                    <Card className="border-0 shadow-sm h-100 light-card">
                        <Card.Body>
                            <Card.Title className="fw-bold">Rules</Card.Title>
                            <ListGroup variant="flush">
                                <ListGroup.Item>🪙 Start with <strong>20 coins</strong></ListGroup.Item>
                                <ListGroup.Item>🗺️ Route must start and end at <strong>assigned stations</strong></ListGroup.Item>
                                <ListGroup.Item>🔄 Line changes only at <strong>interchange stations</strong></ListGroup.Item>
                                <ListGroup.Item>❌ Invalid or incomplete route = <strong>0 coins</strong></ListGroup.Item>
                                <ListGroup.Item>⚠️ Score <strong>cannot go below 0</strong></ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default InstructionsPage;