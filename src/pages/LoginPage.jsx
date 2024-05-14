import React from 'react';
import '../App.css';
import './LoginPageStyle.css';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function LoginPage() {
    return (
        <div className="Background">
            <div className="LoginContainer">
                <h1>Login</h1>
                <Form style={{marginTop:"10px"}}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">Submit</button>
                </Form>
                <Link to="/forgot-password" className="mt-3 d-block text-center">Forgot password?</Link>
            </div>
        </div>
    );
};

export default LoginPage;