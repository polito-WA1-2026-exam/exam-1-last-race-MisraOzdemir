import {Link, useNavigate} from "react-router-dom";
import {useUser} from "../contexts/UserContext.jsx";
import {Navbar, Nav, Container, Button} from "react-bootstrap";

function AppNavbar() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch('http://localhost:3001/api/logout', {
            method: 'POST',
            credentials: 'include',
        })
        setUser(null);
        navigate('/');
    };

    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Last Race</Navbar.Brand>
                <Nav className="ms-auto d-flex align-items-center gap-2">
                    {
                        user ? (
                            <div className="d-flex align-items-center gap-2">
                                <span className="navbar-text me-3">Hi, {user.username}</span>
                                <Nav.Link as={Link} to="/game">Game</Nav.Link>
                                <Nav.Link as={Link} to="/ranking">Ranking</Nav.Link>
                                <Button variant="outline-danger" size="sm" onClick={handleLogout}>Logout</Button>
                            </div>
                        ) : (
                            <Nav.Link as={Link} to="/login">Login</Nav.Link>
                        )
                    }
                </Nav>
            </Container>
        </Navbar>
    )
}

export default AppNavbar;