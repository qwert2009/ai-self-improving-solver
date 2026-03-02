import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Container, Nav, Navbar, NavDropdown, Spinner, Alert } from 'react-bootstrap';
import Dashboard from './components/Dashboard';
import Problems from './components/Problems';
import Solver from './components/Solver';
import Experiments from './components/Experiments';
import Analysis from './components/Analysis';
import Settings from './components/Settings';
import { getStats, getHealth } from './api';

const API_BASE = 'http://localhost:8000';

function App() {
  const [stats, setStats] = useState(null);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = async () => {
    try {
      await getHealth();
      setIsOnline(true);
      setError(null);
    } catch (err) {
      setIsOnline(false);
      setError('Cannot connect to backend server. Make sure it\'s running on port 8000.');
    }
  };

  const fetchStats = async () => {
    if (!isOnline) return;
    try {
      const response = await getStats();
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  useEffect(() => {
    checkHealth();
    fetchStats();

    const healthInterval = setInterval(checkHealth, 30000);
    const statsInterval = setInterval(fetchStats, 60000);

    return () => {
      clearInterval(healthInterval);
      clearInterval(statsInterval);
    };
  }, [isOnline]);

  return (
    <Router>
      <div className="App">
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
          <Container>
            <Navbar.Brand as={Link} to="/">
              AI Self-Improving System
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                <Nav.Link as={Link} to="/problems">Problems</Nav.Link>
                <Nav.Link as={Link} to="/solver">Solver</Nav.Link>
                <Nav.Link as={Link} to="/experiments">Experiments</Nav.Link>
                <Nav.Link as={Link} to="/analysis">Analysis</Nav.Link>
                <Nav.Link as={Link} to="/settings">Settings</Nav.Link>
              </Nav>
              <Nav>
                <NavDropdown title={
                  <span>
                    <span className={`badge ${isOnline ? 'bg-success' : 'bg-danger'} me-2`}>
                      {isOnline ? '●' : '●'}
                    </span>
                    System
                  </span>
                } id="system-dropdown">
                  <NavDropdown.ItemText>
                    {stats ? (
                      <>
                        <div>Problems: {stats.total_problems}</div>
                        <div>Baseline Solutions: {stats.total_baseline_solutions}</div>
                        <div>Improved Solutions: {stats.total_improved_solutions}</div>
                        <div>Experiments: {stats.total_experiments}</div>
                      </>
                    ) : (
                      <div className="text-center py-2">
                        <Spinner animation="border" size="sm" />
                        <div className="mt-1 small">Loading...</div>
                      </div>
                    )}
                  </NavDropdown.ItemText>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href={`${API_BASE}/docs`} target="_blank" rel="noopener noreferrer">
                    API Documentation
                  </NavDropdown.Item>
                  <NavDropdown.Item href={`${API_BASE}/health`} target="_blank" rel="noopener noreferrer">
                    Health Check
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Connection Error</Alert.Heading>
              {error}
            </Alert>
          )}

          <Routes>
            <Route path="/" element={<Dashboard isOnline={isOnline} stats={stats} refreshStats={fetchStats} />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/solver" element={<Solver />} />
            <Route path="/experiments" element={<Experiments />} />
            <Route path="/analysis" element={<Analysis />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
