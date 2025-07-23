import { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup, Tab, Tabs, Spinner } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';
import { format } from 'date-fns';
import AuthContext from '../context/AuthContext';

const DoctorProfile = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/api/doctors/${id}`);
        setDoctor(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching doctor details');
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-warning" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-warning" />);
      }
    }

    return stars;
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error || !doctor) {
    return (
      <Container className="text-center my-5">
        <h3 className="text-danger">Error: {error || 'Doctor not found'}</h3>
        <Button as={Link} to="/doctors" variant="primary" className="mt-3">
          Back to Doctors
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Row>
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body className="text-center">
              <img
                src={`https://ui-avatars.com/api/?name=${doctor.user?.name || doctor.name || 'Unknown Doctor'}&background=random&size=150`}
                alt={doctor.user?.name || doctor.name || 'Unknown Doctor'}
                className="rounded-circle mb-3"
                width="150"
                height="150"
              />
              <Card.Title className="mb-1">{doctor.user?.name || doctor.name || 'Unknown Doctor'}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                {doctor.specialization}
              </Card.Subtitle>
              <div className="mb-3">
                {renderStars(doctor.averageRating)}
                <span className="ms-1">
                  ({doctor.averageRating?.toFixed(1)}) from {doctor.numberOfReviews} reviews
                </span>
              </div>
              <div className="d-grid gap-2">
                {isAuthenticated ? (
                  <Button
                    as={Link}
                    to={`/book-appointment/${doctor._id}`}
                    variant="primary"
                  >
                    Book Appointment
                  </Button>
                ) : (
                  <Button as={Link} to="/login" variant="primary">
                    Login to Book Appointment
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>

          <Card className="mt-4 shadow-sm">
            <Card.Body>
              <Card.Title>Contact Information</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item className="d-flex align-items-center">
                  <FaPhone className="me-2 text-primary" />
                  {doctor.user?.phone || doctor.phone || 'Phone not provided'}
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FaEnvelope className="me-2 text-primary" />
                  {doctor.user?.email || doctor.email || 'Email not provided'}
                </ListGroup.Item>
                <ListGroup.Item className="d-flex align-items-center">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  {doctor.user?.address || doctor.address || 'Address not provided'}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs defaultActiveKey="about" className="mb-3">
                <Tab eventKey="about" title="About">
                  <h5>Professional Experience</h5>
                  <p>{doctor.experience} years of experience in {doctor.specialization}</p>

                  <h5>Consultation Fee</h5>
                  <p>₹{doctor.fees} per session</p>

                  <h5>Qualifications</h5>
                  {doctor.qualifications && doctor.qualifications.length > 0 ? (
                    <ListGroup variant="flush">
                      {doctor.qualifications.map((qual, index) => (
                        <ListGroup.Item key={index}>
                          <strong>{qual.degree}</strong> - {qual.college} ({qual.year})
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>No qualification details available</p>
                  )}
                </Tab>

                <Tab eventKey="schedule" title="Schedule">
                  <h5>Available Timings</h5>
                  {doctor.timings && doctor.timings.length > 0 ? (
                    <Row>
                      {doctor.timings.map((time, index) => (
                        <Col key={index} xs={6} md={4} className="mb-2">
                          <Badge bg="info" className="p-2">
                            {time}
                          </Badge>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <p>No schedule information available</p>
                  )}

                  <div className="mt-3">
                    <p>
                      <strong>Status:</strong>{' '}
                      <Badge bg={doctor.isAvailable ? 'success' : 'danger'}>
                        {doctor.isAvailable ? 'Available' : 'Not Available'}
                      </Badge>
                    </p>
                  </div>
                </Tab>

                <Tab eventKey="reviews" title="Reviews">
                  <h5>Patient Reviews</h5>
                  {doctor.reviews && doctor.reviews.length > 0 ? (
                    <ListGroup variant="flush">
                      {doctor.reviews.map((review, index) => (
                        <ListGroup.Item key={index}>
                          <div className="d-flex justify-content-between">
                            <strong>{review.user.name || 'Anonymous'}</strong>
                            <small>{format(new Date(review.createdAt), 'MMM dd, yyyy')}</small>
                          </div>
                          <div className="mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <p className="mb-0">{review.comment}</p>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  ) : (
                    <p>No reviews yet</p>
                  )}
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <div className="text-center mt-4 mb-5">
        <Button as={Link} to="/doctors" variant="outline-primary">
          Back to Doctors List
        </Button>
      </div>
    </Container>
  );
};

export default DoctorProfile;
