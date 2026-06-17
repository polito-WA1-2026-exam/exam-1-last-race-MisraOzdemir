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

    // --- SEGMENT SELECTION ---
    const handleSegmentClick = (segment) => {
        // Don't allow changes after submission
        if (submitted) return;

        // Check if this segment is already in the route — toggle off if so
        const alreadySelected = playerRoute.some(
            s => s.from === segment.from && s.to === segment.to
        );
        if (alreadySelected) {
            setPlayerRoute(playerRoute.filter(
                s => !(s.from === segment.from && s.to === segment.to)
            ));
            return;
        }

        // If route is empty, first segment must start from startStation
        if (playerRoute.length === 0) {
            if (segment.from !== gameData.startStation.name &&
                segment.to !== gameData.startStation.name) {
                alert('Route must start from ' + gameData.startStation.name);
                return;
            }
            // Ensure correct direction — from=start, to=next
            const ordered = segment.from === gameData.startStation.name
                ? segment
                : { from: segment.to, to: segment.from };
            setPlayerRoute([ordered]);
            return;
        }

        // Next segment must connect to the last station in the route
        const lastStation = playerRoute[playerRoute.length - 1].to;
        if (segment.from !== lastStation && segment.to !== lastStation) {
            alert('Segment must connect to ' + lastStation);
            return;
        }

        // Ensure correct direction
        const ordered = segment.from === lastStation
            ? segment
            : { from: segment.to, to: segment.from };

        setPlayerRoute([...playerRoute, ordered]);
    };

    // --- HELPERS ---
    // Check if a segment is currently selected
    const isSelected = (segment) =>
        playerRoute.some(s => s.from === segment.from && s.to === segment.to) ||
        playerRoute.some(s => s.from === segment.to && s.to === segment.from);

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
                {/* Left: station list (no lines — just names) */}
                <Col md={4}>
                    <h5>Stations</h5>
                    <ListGroup>
                        {network.stations.map(station => (
                            <ListGroup.Item key={station.id}>
                                {station.name}
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Middle: segment list — clickable */}
                <Col md={4}>
                    <h5>Segments (click to add)</h5>
                    <ListGroup>
                        {network.segments.map((segment, index) => {
                            // Check if this segment contains the start station
                            const containsStart = playerRoute.length === 0 && (
                                segment.from === gameData.startStation.name ||
                                segment.to === gameData.startStation.name
                            );

                            return (
                                <ListGroup.Item
                                    key={index}
                                    action
                                    // Selected = green, contains start = yellow, normal = default
                                    variant={isSelected(segment) ? 'success' : containsStart ? 'warning' : ''}
                                    onClick={() => handleSegmentClick(segment)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {segment.from} — {segment.to}
                                </ListGroup.Item>
                            );
                        })}
                    </ListGroup>
                </Col>

                {/* Right: player's built route so far */}
                <Col md={4}>
                    <h5>Your Route</h5>
                    {playerRoute.length === 0
                        ? <p className="text-muted">No segments selected yet</p>
                        : (
                            <ListGroup>
                                {playerRoute.map((segment, index) => (
                                    <ListGroup.Item key={index} variant="success">
                                        {segment.from} → {segment.to}
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        )
                    }
                    <Button
                        variant="primary"
                        className="mt-3 w-100"
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