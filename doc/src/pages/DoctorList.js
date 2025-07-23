import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const DoctorList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch doctors from backend API
  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/doctors');
        if (!res.ok) throw new Error('Failed to fetch doctors');
        const data = await res.json();
        console.log('Fetched doctors:', data); // Debug log
        // If your backend returns { data: [...] }
        const doctorsArray = Array.isArray(data) ? data : (data.data || []);
        setDoctors(doctorsArray);
      } catch (err) {
        setError(err.message || 'Something went wrong');
      }
      setLoading(false);
    };
    fetchDoctors();
  }, []);

  // Extract unique specializations (guard for array)
  const specializations = Array.isArray(doctors)
    ? [...new Set(doctors
        .filter(doctor => doctor && doctor.specialization)
        .map(doctor => doctor.specialization))]
    : [];

  // Filter doctors based on search term and specialization (guard for array and user)
  const filteredDoctors = Array.isArray(doctors)
    ? doctors.filter(doctor => {
        if (!doctor) return false;
        // Accept both embedded user or missing user
        const name = doctor.user?.name || doctor.name || '';
        const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialization = specialization === '' || doctor.specialization === specialization;
        return matchesSearch && matchesSpecialization;
      })
    : [];

  // Render star ratings
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

  return (
    <Container>
      <h2 className="mb-4">Find Doctors</h2>

      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="searchTerm">
            <Form.Control
              type="text"
              placeholder="Search doctors by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="specialization">
            <Form.Select
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            >
              <option value="">All Specializations</option>
              {specializations.map((spec, index) => (
                <option key={index} value={spec}>
                  {spec}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" />
        </div>
      ) : error ? (
        <Alert variant="danger" className="my-5 text-center">
          {error}
        </Alert>
      ) : filteredDoctors.length === 0 ? (
        <div className="text-center my-5">
          <h4>No doctors found matching your criteria</h4>
        </div>
      ) : (
        <Row>
          {filteredDoctors.map((doctor) => (
            <Col key={doctor._id} md={6} lg={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title>{doctor.user?.name || doctor.name || 'Unknown Doctor'}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {doctor.specialization}
                  </Card.Subtitle>
                  <div className="mb-2">
                    {renderStars(doctor.averageRating)}
                    <span className="ms-1">
                      ({doctor.averageRating?.toFixed(1)}) from {doctor.numberOfReviews} reviews
                    </span>
                  </div>
                  <Card.Text>
                    <strong>Experience:</strong> {doctor.experience} years
                    <br />
                    <strong>Consultation Fee:</strong> ₹{doctor.fees}
                  </Card.Text>
                  <Button
                    as={Link}
                    to={`/doctors/${doctor._id}`}
                    variant="primary"
                    className="w-100"
                  >
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default DoctorList;
