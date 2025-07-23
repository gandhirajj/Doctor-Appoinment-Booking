import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-4 mt-auto">
      <Container>
        <Row>
          <Col md={6} className="text-center text-md-start">
            <h5>Doctor Appointment System</h5>
            <p className="mb-0">Book your appointments with the best doctors</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Doctor Appointment. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
