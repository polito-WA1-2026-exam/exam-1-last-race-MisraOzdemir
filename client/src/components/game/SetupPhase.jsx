import { Button, Card, Container, Row, Col } from 'react-bootstrap';
import metroMap from '../../assets/metro-map.png';

function SetupPhase({ network, onStart }) {
    return (
        <Container className="py-4">
            <h2 className="mb-4">Network Map</h2>

            <Row>
                {/* metro map image added to left of the page*/}
                <Col md={6}>
                    <img
                        src={metroMap}
                        alt="Metro Network Map"
                        className="img-fluid rounded shadow-sm"
                    />
                </Col>

                {/* right: line cards and  button */}
                <Col md={6}>
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

                    <Button className="mt-3 w-100 setup-play-button" onClick={onStart}>
                        Ready to Play
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default SetupPhase;