import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext.jsx";
import { Navbar, Nav, Container, Button } from "react-bootstrap";

function AppNavbar() {
    const { user, setUser } = useUser();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await fetch('http://localhost:3001/api/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setUser(null);
        navigate('/');
    };

    return (
        <Navbar className="app-navbar" expand="lg">
            <Container>
                {/* Brand — metro emoji + game name */}
                <Navbar.Brand as={Link} to="/" className="navbar-brand-custom">
                    🚇 Last Race
                </Navbar.Brand>

                <Nav className="ms-auto d-flex align-items-center gap-3">
                    {user ? (
                        <>
                            <span className="navbar-greeting">Hi, {user.username}</span>
                            <Nav.Link as={Link} to="/game" className="navbar-link">Game</Nav.Link>
                            <Nav.Link as={Link} to="/ranking" className="navbar-link">Ranking</Nav.Link>
                            <Button className="navbar-logout" size="sm" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Nav.Link as={Link} to="/login" className="navbar-link">Login</Nav.Link>
                    )}
                </Nav>
            </Container>
        </Navbar>
    );
}

export default AppNavbar;