import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, signupUser } from '../store/slices/authSlice';
import { Form, Button, Card, Container, Row, Col, Alert } from 'react-bootstrap';
import './LoginPage.css';

function LoginPage() {
  const [email, setEmail] = useState('testing@gmail.com');
  const [password, setPassword] = useState('testing123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [signupMode, setSignupMode] = useState(false);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users } = useSelector(state => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    let authenticated = false;
    if (signupMode) {
      if (!name.trim()) {
        setError('Name is required');
      } else if (users.some(user => user.email.toLowerCase() === email.trim().toLowerCase())) {
        setError('An account with this email already exists');
      } else {
        dispatch(signupUser({ name: name.trim(), email: email.trim(), password }));
        authenticated = true;
      }
    } else {
      authenticated = await dispatch(loginUser(email, password));
    }
    setLoading(false);
    if (authenticated) navigate('/workspace');
    else setError('Invalid email or password');
  };

  return (
    <div className="login-page">
      <Container>
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col md={5}>
            <Card className="login-card shadow-lg">
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold">Workspace Manager</h2>
                    <p className="text-muted">{signupMode ? 'Create a local demo account' : 'Sign in to your account'}</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  {signupMode && <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                  </Form.Group>}
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <small className="d-block mt-2 text-muted">
                      Demo accounts use the password shown below.
                    </small>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? 'Please wait...' : signupMode ? 'Create Account' : 'Sign In'}
                  </Button>
                </Form>

                <Button variant="link" className="w-100" onClick={() => { setSignupMode(!signupMode); setError(''); }}>
                  {signupMode ? 'Already have an account? Sign in' : 'Create a local account'}
                </Button>

                <hr />

                <div className="demo-users">
                  <p className="small mb-2">Demo Accounts:</p>
                  {users.map(user => (
                    <button key={user.id} type="button" className="btn btn-link d-flex justify-content-between w-100 text-start p-0 small" onClick={() => { setEmail(user.email); setPassword(user.password); }}>
                      <span>📧 {user.email}</span>
                      <code>{user.password}</code>
                    </button>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default LoginPage;
