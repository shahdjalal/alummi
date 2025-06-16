import React from 'react';
import { Placeholder, Container } from 'react-bootstrap';

export default function MessageLoading() {
  return (
    <Container className="my-3">
      {[1, 2, 3, 4].map((_, i) => (
        <div
          key={i}
          className="d-flex mb-3"
          style={{ justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' }}
        >
          <div
            style={{
              backgroundColor: '#e0e0e0',
              borderRadius: '20px',
              padding: '10px 15px',
              maxWidth: '60%',
              minWidth: '120px'
            }}
          >
            <Placeholder animation="wave">
              <Placeholder xs={8} />
              <Placeholder xs={6} />
            </Placeholder>
          </div>
        </div>
      ))}
    </Container>
  );
}
