import React, { useState, useEffect } from 'react';
import { Card, Alert, Spinner, Table, Badge, Button, Form, Row, Col } from 'react-bootstrap';
import api, { getHealth, getLogs, getStats } from '../api';

function Settings() {
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [logLevel, setLogLevel] = useState('INFO');

  const fetchSystemData = async () => {
    try {
      const [healthRes, logsRes, statsRes] = await Promise.all([
        getHealth(),
        getLogs(50),
        getStats()
      ]);
      setHealth(healthRes.data);
      setLogs(logsRes.data);
      setStats(statsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch system data. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
    const interval = setInterval(fetchSystemData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getLogLevelVariant = (level) => {
    switch (level?.toUpperCase()) {
      case 'ERROR': return 'danger';
      case 'WARNING': return 'warning';
      case 'INFO': return 'info';
      case 'DEBUG': return 'secondary';
      default: return 'secondary';
    }
  };

  const clearDatabase = async () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      alert('Database operations would be performed here. This is a demo interface.');
    }
  };

  const exportResults = () => {
    const data = {
      stats,
      experiments: stats?.recent_experiments || [],
      exported_at: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `senior_project_export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  if (loading && !health) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading system settings...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-4">⚙️ System Settings</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* System Status */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <strong>🖥️ System Status</strong>
              {health?.status === 'healthy' && <Badge bg="success">Healthy</Badge>}
            </Card.Header>
            <Card.Body>
              <Table size="sm">
                <tbody>
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>
                      <Badge bg={health?.status === 'healthy' ? 'success' : 'danger'}>
                        {health?.status || 'Unknown'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Debug Mode</strong></td>
                    <td>
                      <Badge bg={health?.debug ? 'warning' : 'secondary'}>
                        {health?.debug ? 'Enabled' : 'Disabled'}
                      </Badge>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>API Base URL</strong></td>
                    <td><code>http://localhost:8000/api</code></td>
                  </tr>
                  <tr>
                    <td><strong>Frontend Version</strong></td>
                    <td>1.0.0</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header><strong>📊 Quick Statistics</strong></Card.Header>
            <Card.Body>
              <Row>
                <Col xs={6} className="mb-3">
                  <Card bg="primary" text="white" className="text-center">
                    <Card.Body className="py-2">
                      <h6>Problems</h6>
                      <h3>{stats?.total_problems || 0}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6} className="mb-3">
                  <Card bg="success" text="white" className="text-center">
                    <Card.Body className="py-2">
                      <h6>Solutions</h6>
                      <h3>{(stats?.total_baseline_solutions || 0) + (stats?.total_improved_solutions || 0)}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card bg="info" text="white" className="text-center">
                    <Card.Body className="py-2">
                      <h6>Experiments</h6>
                      <h3>{stats?.total_experiments || 0}</h3>
                    </Card.Body>
                  </Card>
                </Col>
                <Col xs={6}>
                  <Card bg="warning" text="dark" className="text-center">
                    <Card.Body className="py-2">
                      <h6>Recent</h6>
                      <h3>{stats?.recent_experiments?.length || 0}</h3>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Actions */}
      <Card className="mb-4">
        <Card.Header><strong>🔧 System Actions</strong></Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-2">
              <Button variant="outline-primary" className="w-100" onClick={fetchSystemData}>
                🔄 Refresh Data
              </Button>
            </Col>
            <Col md={4} className="mb-2">
              <Button variant="outline-success" className="w-100" onClick={exportResults}>
                📥 Export Results
              </Button>
            </Col>
            <Col md={4} className="mb-2">
              <Button variant="outline-info" className="w-100" href="http://localhost:8000/docs" target="_blank">
                📚 API Documentation
              </Button>
            </Col>
            <Col md={4} className="mb-2">
              <Button variant="outline-warning" className="w-100" onClick={clearDatabase}>
                🗑️ Clear Database
              </Button>
            </Col>
            <Col md={4} className="mb-2">
              <Button variant="outline-secondary" className="w-100" href="http://localhost:8000/redoc" target="_blank">
                📖 Redoc Documentation
              </Button>
            </Col>
            <Col md={4} className="mb-2">
              <Button variant="outline-danger" className="w-100" onClick={() => window.location.reload()}>
                🔄 Reload Page
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* System Logs */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <strong>📜 System Logs</strong>
          <div>
            <Form.Select 
              size="sm" 
              style={{ width: '150px', display: 'inline-block' }}
              value={logLevel}
              onChange={(e) => setLogLevel(e.target.value)}
            >
              <option value="ALL">All Levels</option>
              <option value="INFO">Info</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
              <option value="DEBUG">Debug</option>
            </Form.Select>
          </div>
        </Card.Header>
        <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {logs.length === 0 ? (
            <p className="text-muted text-center">No logs available</p>
          ) : (
            <Table size="sm" hover>
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Timestamp</th>
                  <th>Message</th>
                  <th>Module</th>
                </tr>
              </thead>
              <tbody>
                {logs
                  .filter(log => logLevel === 'ALL' || log.level === logLevel)
                  .map((log) => (
                    <tr key={log.id}>
                      <td>
                        <Badge bg={getLogLevelVariant(log.level)}>{log.level}</Badge>
                      </td>
                      <td>
                        <small className="text-muted">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}
                        </small>
                      </td>
                      <td>{log.message}</td>
                      <td>
                        {log.module && <Badge bg="secondary">{log.module}</Badge>}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Recent Experiments */}
      {stats?.recent_experiments && stats.recent_experiments.length > 0 && (
        <Card className="mt-4">
          <Card.Header><strong>🔬 Recent Experiments</strong></Card.Header>
          <Card.Body>
            <Table responsive size="sm">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Baseline</th>
                  <th>Improved</th>
                  <th>Completed</th>
                </tr>
              </thead>
              <tbody>
                {stats.recent_experiments.map((exp) => (
                  <tr key={exp.id}>
                    <td><strong>{exp.name}</strong></td>
                    <td>
                      <Badge bg={exp.status === 'completed' ? 'success' : 'info'}>{exp.status}</Badge>
                    </td>
                    <td>{(exp.baseline_accuracy * 100).toFixed(1)}%</td>
                    <td>{(exp.improved_accuracy * 100).toFixed(1)}%</td>
                    <td>
                      {exp.completed_at 
                        ? new Date(exp.completed_at).toLocaleDateString()
                        : 'In Progress'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* About */}
      <Card className="mt-4">
        <Card.Header><strong>ℹ️ About This Project</strong></Card.Header>
        <Card.Body>
          <h5>Self-Improving AI System for Engineering Problem Solving</h5>
          <p>
            This senior project implements an AI-based system that solves engineering problems 
            and improves its own reasoning through self-evaluation. The system features:
          </p>
          <ul>
            <li><strong>Baseline Solver:</strong> Single-pass problem solving using LLM</li>
            <li><strong>Critic/Validator:</strong> Second-stage review for errors and inconsistencies</li>
            <li><strong>Self-Improvement:</strong> Two-stage architecture for improved accuracy</li>
            <li><strong>Experimental Evaluation:</strong> Compare baseline vs self-improving approaches</li>
          </ul>
          <hr />
          <p className="mb-0">
            <strong>Research Question:</strong> Can a self-reflective AI system improve the accuracy 
            and clarity of engineering problem-solving compared to a standard single-pass solution method?
          </p>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Settings;
