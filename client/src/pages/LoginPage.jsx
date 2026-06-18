import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
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
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <span className="login-emoji">🚇</span>
                    <h1 className="login-title">Last Race</h1>
                    <p className="login-subtitle">Sign in to start your journey</p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                        <Form.Label className="login-label">Username</Form.Label>
                        <Form.Control
                            className="login-input"
                            type="text"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            placeholder="Enter your username"
                        />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label className="login-label">Password</Form.Label>
                        <Form.Control
                            className="login-input"
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </Form.Group>
                    <Button className="login-button" type="submit">
                        Login →
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default LoginPage;