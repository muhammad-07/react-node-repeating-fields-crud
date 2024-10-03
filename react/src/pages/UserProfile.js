import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (  
<Container className="mt-5">
<Row className="justify-content-center">
  <Col md={6}>
    <Card>
      <Card.Body>
        <Card.Title>User Profile</Card.Title>
        <Card.Text><strong>Username:</strong> {user.username}</Card.Text>
        <Card.Text><strong>Email:</strong> {user.email}</Card.Text>
        {user.profilePicture && (
          <div className="text-center">
            <img
              src={`http://localhost:5000${user.profilePicture}`}
              onError={(e) => (e.target.src = 'http://localhost:5000/uploads/user.png')}
              alt="Profile"
              className="img-fluid rounded-circle mb-3"
              style={{ width: '150px', height: '150px', objectFit: 'cover', border: '1px solid #ccc', redius: '50%' }}
            />
          </div>
        )}
        <Button variant="primary" onClick={() => alert('Edit Profile functionality will be added soon.')}>Edit Profile</Button>
      </Card.Body>
    </Card>
  </Col>
</Row>
</Container>
  );
};

export default UserProfile;
