import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { format } from 'date-fns';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    date: new Date(),
    time: '',
    reason: '',
    notes: '',
  });
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { date, time, reason, notes } = formData;

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const res = await axios.get(`/api/doctors/${doctorId}`);
        setDoctor(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching doctor details');
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [doctorId]);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    setSubmitting(true);

    try {
      const appointmentData = {
        doctor: doctorId,
        date: format(date, 'yyyy-MM-dd'),
        time,
        reason,
        notes,
      };

      const res = await axios.post('/api/appointments', appointmentData);
      
      if (res.data.success) {
        toast.success('Appointment booked successfully!');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setSubmitting(false);
    }
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
        <Alert variant="danger">
          Error: {error || 'Doctor not found'}
        </Alert>
        <Button as={Link} to="/doctors" variant="primary" className="mt-3">
          Back to Doctors
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <h2 className="mb-4">Book an Appointment</h2>
      
      <Row>
        <Col md={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Doctor Information</Card.Title>
              <Card.Text>
                <strong>Name:</strong> {doctor.user?.name || doctor.name || 'Unknown Doctor'}
                <br />
                <strong>Specialization:</strong> {doctor.specialization}
                <br />
                <strong>Consultation Fee:</strong> ₹{doctor.fees}
              </Card.Text>
              
              <Card.Title className="mt-4">Available Timings</Card.Title>
              {doctor.timings && doctor.timings.length > 0 ? (
                <div>
                  {doctor.timings.map((timing, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`timing-${index}`}
                      label={timing}
                      name="time"
                      value={timing}
                      onChange={onChange}
                      checked={time === timing}
                      required
                    />
                  ))}
                </div>
              ) : (
                <p>No available timings</p>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Appointment Details</Card.Title>
              <Form noValidate validated={validated} onSubmit={onSubmit}>
                <Form.Group className="mb-3" controlId="date">
                  <Form.Label>Select Date</Form.Label>
                  <DatePicker
                    selected={date}
                    onChange={handleDateChange}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    className="form-control"
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please select a date.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="reason">
                  <Form.Label>Reason for Visit</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Describe your symptoms or reason for the appointment"
                    name="reason"
                    value={reason}
                    onChange={onChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a reason for your visit.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="notes">
                  <Form.Label>Additional Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="Any additional information you'd like to share"
                    name="notes"
                    value={notes}
                    onChange={onChange}
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                          className="me-2"
                        />
                        Booking...
                      </>
                    ) : (
                      'Book Appointment'
                    )}
                  </Button>
                  <Button
                    variant="success"
                    className="mt-2"
                    onClick={() => window.open('https://pay.google.com', '_blank')}
                  >
                    Pay Consultation Fee
                  </Button>
                  <Button
                    as={Link}
                    to={`/doctors/${doctorId}`}
                    variant="outline-secondary"
                  >
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookAppointment;
