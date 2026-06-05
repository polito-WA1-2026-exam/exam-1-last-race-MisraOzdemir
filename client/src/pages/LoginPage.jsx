import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useUser } from '../contexts/UserContext';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser } = useUser();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            if (res.ok) {
                const user = await res.json();
                setUser(user);
                navigate('/');
            } else {
                setError('Invalid username or password');
            }
        } catch (err) {
            setError('Server error');
        }
    };

    return (
        <Container className="mt-5" style={{ maxWidth: '400px' }}>
            <h2>Login</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                    />
                </Form.Group>
                <Button type="submit" variant="primary">Login</Button>
            </Form>
        </Container>
    );
}

export default LoginPage;