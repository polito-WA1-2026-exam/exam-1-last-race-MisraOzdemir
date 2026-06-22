import { useState, useEffect, useRef } from 'react';
import { Container, Badge, ListGroup, Spinner } from 'react-bootstrap';

function ExecutionPhase({ playerRoute, onFinish }) {
    // Steps returned from backend (each step has event, effect, coins)
    const [steps, setSteps] = useState([]);

    // Which step we're currently showing (revealed one by one)
    const [currentStep, setCurrentStep] = useState(0);

    // Loading while waiting for backend response
    const [loading, setLoading] = useState(true);

    // Guard against StrictMode running this effect twice (which would POST
    // /validate twice and save two games for a single playthrough)
    const validated = useRef(false);

    // --- FETCH VALIDATION FROM BACKEND ---
    useEffect(() => {
        if (validated.current) return;
        validated.current = true;

        fetch('http://localhost:3001/api/games/validate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            // Only the route is sent — the server already knows the assigned
            // start/end stations from the session, so it doesn't trust the client
            body: JSON.stringify({ playerRoute })
        })
            .then(res => res.json())
            .then(data => {
                if (!data.valid) {
                    // Invalid route — skip execution, go straight to result with 0
                    onFinish({ valid: false, finalScore: 0, steps: [] });
                    return;
                }
                // Valid route — store steps and start revealing them
                setSteps(data.steps);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    // --- REVEAL STEPS ONE BY ONE when current step and loading changes---
    useEffect(() => {
        // Don't start until steps are loaded
        if (loading || steps.length === 0) return;

        // All steps already revealed
        if (currentStep >= steps.length) {
            // Wait 1 second then move to result phase
            const timeout = setTimeout(() => {
                onFinish({
                    valid: true,
                    finalScore: steps[steps.length - 1].coins,
                    steps
                });
            }, 1000);
            return () => clearTimeout(timeout);
        }

        // Reveal next step every 1.5 seconds
        const timeout = setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 1500);

        return () => clearTimeout(timeout);
    }, [currentStep, loading, steps]);

    // --- RENDER ---
    if (loading) {
        return (
            <Container className="py-4 text-center">
                <Spinner animation="border" />
                <p className="mt-2">Validating your route...</p>
            </Container>
        );
    }

    // Coins shown live in the header: the last revealed step's total, or the
    // starting 20 before any step is revealed
    const currentCoins = currentStep > 0 ? steps[currentStep - 1].coins : 20;

    return (
        <Container className="py-4">
            {/* Header — keeps the screen lively and shows live progress */}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h2 className="mb-0">🚇 Executing Route</h2>
                    <Badge bg="warning" text="dark" style={{ fontSize: '1.1rem', padding: '8px 12px' }}>
                        {currentCoins} 🪙
                    </Badge>
                </div>
                <p className="text-muted mb-3">
                    Riding through your route — each stop triggers a random event that changes your coins.
                </p>
                {/* Train moving along the route line — slides right each step */}
                <div style={{ position: 'relative', height: '32px', padding: '0 12px' }}>
                    {/* full track (remaining part) */}
                    <div style={{
                        position: 'absolute', top: '50%', left: 0, right: 0,
                        height: '4px', background: '#dee2e6', borderRadius: '2px',
                        transform: 'translateY(-50%)'
                    }} />
                    {/* traveled part */}
                    <div style={{
                        position: 'absolute', top: '50%', left: 0,
                        width: `${(currentStep / steps.length) * 100}%`,
                        height: '4px', background: '#0dcaf0', borderRadius: '2px',
                        transform: 'translateY(-50%)', transition: 'width 0.9s ease'
                    }} />
                    {/* the train */}
                    <div style={{
                        position: 'absolute', top: '50%',
                        left: `${(currentStep / steps.length) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        transition: 'left 0.9s ease', fontSize: '1.6rem'
                    }}>
                        🚆
                    </div>
                </div>
                <div className="d-flex justify-content-between">
                    <small className="fw-bold">{steps[0].from}</small>
                    <small className="text-muted">Stop {Math.min(currentStep, steps.length)} / {steps.length}</small>
                    <small className="fw-bold">{steps[steps.length - 1].to}</small>
                </div>
            </div>

            <ListGroup>
                {/* Only show steps up to currentStep */}
                {steps.slice(0, currentStep).map((step, index) => (
                    <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                        <div>
                            <strong>{step.from} → {step.to}</strong>
                            <br />
                            <small className="text-muted">{step.event}</small>
                        </div>
                        <div className="text-end">
                            {/* Show effect with + or - sign */}
                            <Badge bg={step.effect >= 0 ? 'success' : 'danger'}>
                                {step.effect >= 0 ? '+' : ''}{step.effect}
                            </Badge>
                            <div><small>{step.coins} coins</small></div>
                        </div>
                    </ListGroup.Item>
                ))}

                {/* Pending step — shows the upcoming segment while its random event
                    is being "rolled", so the wait feels like progress, not a freeze */}
                {currentStep < steps.length && (
                    <ListGroup.Item className="d-flex justify-content-between align-items-center text-muted">
                        <div>
                            <strong>{steps[currentStep].from} → {steps[currentStep].to}</strong>
                            <br />
                            <small>On the way — waiting for what happens next…</small>
                        </div>
                        <Spinner animation="grow" size="sm" variant="secondary" />
                    </ListGroup.Item>
                )}
            </ListGroup>
        </Container>
    );
}

export default ExecutionPhase;