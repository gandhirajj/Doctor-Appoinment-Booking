import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaUserMd, FaCalendarCheck, FaUserPlus } from 'react-icons/fa';

const Home = () => {
  return (
    <Container>
      <Row className="mb-5">
        <Col md={6} className="d-flex flex-column justify-content-center">
          <h1 className="display-4 mb-4">Doctor Appointment Booking System</h1>
          <p className="lead mb-4">
            Book appointments with the best doctors in your area. Get the best healthcare
            services at your convenience.
          </p>
          <div>
            <Button as={Link} to="/doctors" variant="primary" size="lg" className="me-3">
              Find Doctors
            </Button>
            <Button as={Link} to="/register" variant="outline-primary" size="lg">
              Register Now
            </Button>
          </div>
        </Col>
        <Col md={6} className="mt-4 mt-md-0">
          <img
            src="https://img.freepik.com/free-photo/doctor-with-stethoscope-hands-hospital-background_1423-1.jpg"
            alt="Doctor"
            className="img-fluid rounded shadow"
          />
        </Col>
      </Row>

      <h2 className="text-center mb-4">Our Services</h2>
      <Row className="mb-5">
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FaUserMd size={50} className="text-primary" />
              </div>
              <Card.Title>Find Doctors</Card.Title>
              <Card.Text>
                Browse through our list of qualified doctors and specialists in various fields.
              </Card.Text>
              <Button as={Link} to="/doctors" variant="outline-primary">
                Find Doctors
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FaCalendarCheck size={50} className="text-primary" />
              </div>
              <Card.Title>Book Appointments</Card.Title>
              <Card.Text>
                Schedule appointments with your preferred doctors at your convenient time.
              </Card.Text>
              <Button as={Link} to="/login" variant="outline-primary">
                Book Now
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body className="text-center">
              <div className="mb-3">
                <FaUserPlus size={50} className="text-primary" />
              </div>
              <Card.Title>Create Account</Card.Title>
              <Card.Text>
                Register to manage your appointments and medical history efficiently.
              </Card.Text>
              <Button as={Link} to="/register" variant="outline-primary">
                Register
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h2 className="text-center mb-4">Why Choose Us</h2>
      <Row className="mb-5">
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Qualified Doctors</Card.Title>
              <Card.Text>
                Our platform features only verified and qualified healthcare professionals with
                years of experience in their respective fields.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Easy Booking</Card.Title>
              <Card.Text>
                Our user-friendly interface makes it simple to find doctors and book
                appointments in just a few clicks.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Appointment Management</Card.Title>
              <Card.Text>
                Easily manage your appointments, reschedule or cancel if needed, and get
                reminders for upcoming visits.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Secure Platform</Card.Title>
              <Card.Text>
                Your personal and medical information is kept secure with our advanced
                encryption and privacy measures.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
