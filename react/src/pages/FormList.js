import React from 'react';
import { Card, Button, ListGroup, Container } from 'react-bootstrap';

const FormList = ({ forms, error, onEdit, onDelete }) => {

  return (
    <Container className="mt-5">
      <h2>Your Forms</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {forms.length === 0 ? (
        <p>No forms available</p>
      ) : (
        <ListGroup>
          {forms.map((form, index) => (
            <ListGroup.Item key={index} className="mb-3">
              <Card>
                <Card.Body>
                  <Card.Title>Form {index + 1}</Card.Title>
                  <Card.Text>
                    <strong>Name:</strong> {form.name} <br />
                    <strong>City:</strong> {form.city}
                  </Card.Text>
                  <Button
                    variant="primary"
                    onClick={() => onEdit(form)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => onDelete(form._id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default FormList;
