import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    formData.append('password', password);
    if (profilePicture) {
      formData.append('profilePicture', profilePicture);
    }

    try {
      
      // Send the registration request to the backend
      const response = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (response.status === 201) {
        alert('User registered successfully! Please login.');
        // Redirect to login page after successful registration
        navigate('/login');
      }
    } catch (error) {
      // console.error('Signup error:', error.response?.data?.error || error.message);
      if (error.response && error.response.status === 400) {
        setError(error.response.data.error); // Display backend error
      } else {
        console.error('Signup error:', error);
        setError('An error occurred during signup. Please try again.');
      }
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        {error && <p className="text-danger">{error}</p>}
        <Col md={6}>
          <Form onSubmit={handleSignup}>
            <h3>Sign Up</h3>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setProfilePicture(e.target.files[0])}
              />
            </Form.Group>

            <Button variant="primary" type="submit">Sign Up</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
