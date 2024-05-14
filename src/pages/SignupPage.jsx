import React from 'react';
import '../App.css';
import './SingupPageStyle.css';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';

function SignupPage() {
    return (
        <div className="Background">
            <div className="SignupContainer">
                <h1>Sign Up</h1>
                <Form style={{marginTop:"10px"}}>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Full Name</Form.Label>
                        <Form.Control type="text" placeholder="John Doe" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" />
                    </Form.Group>
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </Form>
                <Link to="/login" className="mt-3 d-block text-center">Already have an account? Log in</Link>
            </div>
        </div>
    );
};

export default SignupPage;