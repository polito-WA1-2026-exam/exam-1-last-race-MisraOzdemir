import { Button, Container, Alert, ListGroup, Badge } from 'react-bootstrap';

function ResultPhase({ result, onRestart }) {
    return (
        <Container className="py-4 text-center">
            <h2 className="mb-4">Game Over</h2>

            {/* Show different message based on route validity */}
            {!result.valid
                ? (
                    <Alert variant="danger">
                        <h4>Invalid Route!</h4>
                        <p>Your route was invalid or incomplete. You lose all your coins.</p>
                    </Alert>
                ) : (
                    <Alert variant={result.finalScore > 0 ? 'success' : 'warning'}>
                        <h4>You made it!</h4>
                        <p>You completed the route successfully.</p>
                    </Alert>
                )
            }

            {/* Final score */}
            <h1 style={{ fontSize: '4rem' }}>
                {result.finalScore} 🪙
            </h1>
            <p className="text-muted mb-4">Final Score</p>

            {/* Journey summary — only shown for valid routes */}
            {result.valid && result.steps.length > 0 && (
                <>
                    <h5 className="text-start mb-2">Journey Summary</h5>
                    <ListGroup className="mb-4 text-start">
                        {result.steps.map((step, index) => (
                            <ListGroup.Item
                                key={index}
                                className="d-flex justify-content-between align-items-center"
                            >
                                <div>
                                    <strong>{step.from} → {step.to}</strong>
                                    <br />
                                    <small className="text-muted">{step.event}</small>
                                </div>
                                <div className="text-end">
                                    <Badge bg={step.effect >= 0 ? 'success' : 'danger'}>
                                        {step.effect >= 0 ? '+' : ''}{step.effect}
                                    </Badge>
                                    <div><small>{step.coins} 🪙</small></div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </>
            )}

            <Button variant="primary" size="lg" onClick={onRestart}>
                Play Again
            </Button>
        </Container>
    );
}

export default ResultPhase;