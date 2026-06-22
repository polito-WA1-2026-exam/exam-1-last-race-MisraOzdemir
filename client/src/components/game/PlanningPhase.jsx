import { useState, useEffect } from 'react';
import { Button, Container, Row, Col, Badge, ListGroup, CloseButton } from 'react-bootstrap';
import emptyMap from '../../assets/empty-map.png';


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

    // --- ADD a segment to the route (clicking a row only adds, not removes) ---
    const handleSelect = (segment) => {
        if (submitted) return;
        // Already selected or not reachable from the current end → ignore the click
        if (isSelected(segment) || !isClickable(segment)) return;

        if (playerRoute.length === 0) {
            // First segment starts at the assigned start station
            const ordered = segment.from === gameData.startStation.name
                ? segment
                : { from: segment.to, to: segment.from };
            setPlayerRoute([ordered]);
        } else {
            // Next segment it starts at the current last station
            const lastStation = playerRoute[playerRoute.length - 1].to;
            const ordered = segment.from === lastStation
                ? segment
                : { from: segment.to, to: segment.from };
            setPlayerRoute([...playerRoute, ordered]);
        }
    };

    // --- REMOVE only the last segment of the route ---
    const handleRemoveLast = () => {
        if (submitted) return;
        setPlayerRoute(playerRoute.slice(0, -1));
    };

    // --- HELPERS ---
    // Is this segment currently part of the route?
    const isSelected = (segment) =>
        playerRoute.some(s =>
            (s.from === segment.from && s.to === segment.to) ||
            (s.from === segment.to && s.to === segment.from)
        );

    // Is this segment the last one added? (only this one can be removed)
    const isLastSelected = (segment) => {
        if (playerRoute.length === 0) return false;
        const last = playerRoute[playerRoute.length - 1];
        return (last.from === segment.from && last.to === segment.to) ||
            (last.from === segment.to && last.to === segment.from);
    };

    // Can this segment be added right now? (already-selected ones can't be re-added)
    const isClickable = (segment) => {
        if (isSelected(segment)) return false;

        if (playerRoute.length === 0) {
            // Only segments touching the start station
            return segment.from === gameData.startStation.name ||
                segment.to === gameData.startStation.name;
        }

        // Only segments connecting to the last station in the route
        const lastStation = playerRoute[playerRoute.length - 1].to;
        return segment.from === lastStation || segment.to === lastStation;
    };

    // Timer color — red when under 15 seconds
    const timerVariant = timeLeft <= 15 ? 'danger' : 'primary';

    return (
        <Container className="py-4">

            {/* Header: title, assigned stations and timer */}
            <Row className="mb-4 align-items-center">
                <Col>
                    <h2 className="mb-1">Plan Your Route</h2>
                    <p className="mb-0">
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
                {/* LEFT: station-only map + the route being built */}
                <Col md={6}>
                    <img
                        src={emptyMap}
                        alt="Metro stations (no lines)"
                        className="img-fluid rounded shadow-sm mb-4 d-block mx-auto"
                        style={{ maxHeight: '320px', width: 'auto' }}
                    />

                    <h5 className="mb-2">Your Route</h5>
                    {playerRoute.length === 0
                        ? <p className="text-muted">No segments selected yet</p>
                        : (
                            <div className="p-3 border rounded bg-light" style={{ minHeight: '90px' }}>
                                <p className="mb-0" style={{ wordBreak: 'break-word', fontSize: '1.1rem' }}>
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
                        className="mt-3 w-100 setup-play-button"
                        onClick={handleSubmit}
                        disabled={submitted || playerRoute.length === 0}
                    >
                        Submit Route
                    </Button>
                </Col>

                {/* RIGHT: scrollable list of all segments */}
                <Col md={6}>
                    <h5 className="mb-3">Segments</h5>
                    <div className="segment-scroll">
                        <ListGroup>
                            {network.segments.map((segment, index) => {
                                const selected = isSelected(segment);
                                const clickable = isClickable(segment);
                                return (
                                    <ListGroup.Item
                                        key={index}
                                        action={clickable}
                                        variant={selected ? 'success' : ''}
                                        onClick={() => handleSelect(segment)}
                                        className="d-flex justify-content-between align-items-center"
                                        style={{
                                            cursor: clickable ? 'pointer' : 'default',
                                            opacity: clickable || selected ? 1 : 0.4
                                        }}
                                    >
                                        <span>{segment.from} — {segment.to}</span>

                                        {/* Only the last selected segment can be removed */}
                                        {isLastSelected(segment) && !submitted && (
                                            <CloseButton
                                                aria-label="Remove last segment"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // don't trigger the row click
                                                    handleRemoveLast();
                                                }}
                                            />
                                        )}
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default PlanningPhase;
