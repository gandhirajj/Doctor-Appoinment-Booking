import { useContext, useEffect, useState } from 'react';
import { Container, Card, Spinner, Alert, Row, Col } from 'react-bootstrap';
import AuthContext from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, token } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Error fetching profile');
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm text-center">
            <Card.Body>
              <div className="mb-3">
                <span role="img" aria-label="profile" style={{ fontSize: '4rem' }}>👤</span>
              </div>
              <Card.Title>{profile?.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{profile?.role?.charAt(0).toUpperCase() + profile?.role?.slice(1)}</Card.Subtitle>
              <Card.Text>
                <strong>Email:</strong> {profile?.email}<br />
                <strong>Phone:</strong> {profile?.phone || 'Not provided'}<br />
                <strong>Address:</strong> {profile?.address || 'Not provided'}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile; 