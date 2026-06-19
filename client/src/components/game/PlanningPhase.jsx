import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Badge, ListGroup } from 'react-bootstrap';

function PlanningPhase({ network, gameData, playerRoute, setPlayerRoute, onSubmit }) {
    // Timer state — counts down from 90
    const [timeLeft, setTimeLeft] = useState(90);

    // Prevent multiple submissions
    const [submitted, setSubmitted] = useState(false);

    // --- SUBMIT ---
    const handleSubmit = () => {
        if (submitted) return;
        setSubmitted(true);
        onSubmit(); // tell GamePage to move to execution phase
    };

    // --- TIMER ---
    useEffect(() => {
        // If already submitted, don't start/continue timer
        if (submitted) return;

        // setInterval calls the function every 1000ms (1 second)
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    // Time's up — clear interval and auto-submit
                    clearInterval(interval);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        // Cleanup: clear interval when component unmounts or submitted changes
        // Without this, the interval would keep running even after phase changes
        return () => clearInterval(interval);
    }, [submitted]);

    const handleSegmentClick = (segment) => {
        if (submitted) return;

        // Check if already selected — toggle off if so
        const alreadySelected = playerRoute.some(
            s => (s.from === segment.from && s.to === segment.to) ||
                (s.from === segment.to && s.to === segment.from)
        );
        if (alreadySelected) {
            // Remove from route
            setPlayerRoute(playerRoute.filter(
                s => !((s.from === segment.from && s.to === segment.to) ||
                    (s.from === segment.to && s.to === segment.from))
            ));
            return;
        }

        if (playerRoute.length === 0) {
            // First segment — from must be start station
            const ordered = segment.from === gameData.startStation.name
                ? segment
                : { from: segment.to, to: segment.from };
            setPlayerRoute([ordered]);
        } else {
            // Next segment — from must connect to last station
            const lastStation = playerRoute[playerRoute.length - 1].to;
            const ordered = segment.from === lastStation
                ? segment
                : { from: segment.to, to: segment.from };
            setPlayerRoute([...playerRoute, ordered]);
        }
    };

    // --- HELPERS ---
    // Check if a segment is currently selected
    const isSelected = (segment) =>
        playerRoute.some(s => s.from === segment.from && s.to === segment.to) ||
        playerRoute.some(s => s.from === segment.to && s.to === segment.from);

    const isClickable = (segment) => {
        if (isSelected(segment)) return true; // already selected, can deselect

        if (playerRoute.length === 0) {
            // Only segments containing start station
            return segment.from === gameData.startStation.name ||
                segment.to === gameData.startStation.name;
        }

        // Only segments connecting to last station in route
        const lastStation = playerRoute[playerRoute.length - 1].to;
        return segment.from === lastStation || segment.to === lastStation;
    };
    // Timer color — red when under 15 seconds
    const timerVariant = timeLeft <= 15 ? 'danger' : 'primary';

    return (
        <Container className="py-4">

            {/* Header: start/end stations and timer */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2>Plan Your Route</h2>
                    <p>
                        <strong>From:</strong> {gameData.startStation.name}
                        {' → '}
                        <strong>To:</strong> {gameData.endStation.name}
                    </p>
                </Col>
                <Col xs="auto">
                    {/* Timer badge — turns red under 15 seconds */}
                    <Badge bg={timerVariant} style={{ fontSize: '1.5rem', padding: '10px' }}>
                        {timeLeft}s
                    </Badge>
                </Col>
            </Row>

            <Row>
                {/* Segments — scrollable */}
                <Col md={6}>
                    <h5 className="mb-3">Segments</h5>
                    <div className="segment-scroll">
                        <ListGroup>
                            {network.segments.map((segment, index) => (
                                <ListGroup.Item
                                    key={index}
                                    action={isClickable(segment)}
                                    variant={isSelected(segment) ? 'success' : ''}
                                    onClick={() => isClickable(segment) && handleSegmentClick(segment)}
                                    style={{
                                        cursor: isClickable(segment) ? 'pointer' : 'not-allowed',
                                        opacity: isClickable(segment) || isSelected(segment) ? 1 : 0.4
                                    }}
                                >
                                    {segment.from} — {segment.to}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                </Col>

                {/* Your Route */}
                <Col md={6}>
                    <h5 className="mb-3">Your Route</h5>
                    {playerRoute.length === 0
                        ? <p className="text-muted">No segments selected yet</p>
                        : (
                            <div className="p-3 border rounded bg-light">
                                <p className="mb-0" style={{ wordBreak: 'break-word' }}>
                                    {/* First station + each subsequent 'to' station joined with arrows */}
                                    {playerRoute[0].from}
                                    {playerRoute.map((segment, index) => (
                                        <span key={index}> → {segment.to}</span>
                                    ))}
                                </p>
                            </div>
                        )
                    }

                    <Button
                        className="mt-3 w-100 setup-play-btn"
                        onClick={handleSubmit}
                        disabled={submitted || playerRoute.length === 0}
                    >
                        Submit Route
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default PlanningPhase;