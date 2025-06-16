import React from 'react';
import { Card, Placeholder, Container } from 'react-bootstrap';

export default function Loading() {
  return (
    <Container className="mt-5">
      {[1, 2, 3].map((_, i) => (
        <Card className="mb-4 shadow-sm" key={i}>
          <Card.Header>
            <Placeholder as="div" animation="glow">
              <Placeholder xs={2} style={{ height: '40px', borderRadius: '50%' }} />{' '}
              <Placeholder xs={4} />
            </Placeholder>
          </Card.Header>
          <Card.Body>
            <Placeholder as={Card.Text} animation="glow">
              <Placeholder xs={8} /> <Placeholder xs={6} /> <Placeholder xs={4} />
            </Placeholder>
            <div className="mt-3">
              <Placeholder.Button xs={2} variant="danger" className="me-2" />
              <Placeholder.Button xs={3} variant="secondary" />
            </div>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}
