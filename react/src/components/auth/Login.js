// Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { username, password });
      const token = response.data.token;

      // Store the token in localStorage
      localStorage.setItem('token', token);

      // Redirect to form page after login
      navigate('/form');
      window.location.reload(); 
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    
    <Container className='mt-5'>
      <Row className='justify-content-center'>
        {/* {error && <p className='text-danger'>{error}</p>} */}
        <Col md={6}>
          <Form onSubmit={handleLogin}>
            <h2>Login</h2>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder='Username'
              />
            </Form.Group>
            <Form.Group className='mb-3'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder='Password'
              />
            </Form.Group>
            <Button variant='primary' type='submit'>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
      
    
  );
};

export default Login;
