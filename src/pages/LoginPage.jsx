import React, { useState } from 'react';
import '../App.css';
import './LoginPageStyle.css';
import Form from 'react-bootstrap/Form';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../api/AuthApi';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setErrorMessage('');
        console.log('handleSubmit called');
        try {
            const data = await loginUser(email, password);
            console.log('Login successful:', data);
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);
            navigate('/home');
        } catch (error) {
            console.error('Failed to login', error);
            setErrorMessage('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="Background">
            <div className="LoginContainer">
                <h1>Login</h1>
                <Form style={{ marginTop: "10px" }} onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control 
                            type="email" 
                            placeholder="name@example.com" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)} 
                            disabled={loading}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            disabled={loading}
                        />
                    </Form.Group>
                    {errorMessage && <h3 style={{color: "red", fontSize:"12px"}}>{errorMessage}</h3>}
                    <button type="submit" className="btn btn-primary" disabled={loading}>
                        {loading ? 'Loading...' : 'Submit'}
                    </button>
                </Form>
                <Link to="/forgot-password" className="mt-3 d-block text-center">Forgot password?</Link>
            </div>
        </div>
    );
};

export default LoginPage;
