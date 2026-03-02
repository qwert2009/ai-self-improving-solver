import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Alert, Spinner, Table, Badge, ProgressBar, Modal, Row, Col } from 'react-bootstrap';
import api, { getExperiments, getExperiment, runExperiment } from '../api';

function Experiments() {
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [runningExperiment, setRunningExperiment] = useState(null);
  const [showRunModal, setShowRunModal] = useState(false);
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [experimentConfig, setExperimentConfig] = useState({
    name: '',
    description: '',
    domain: '',
    difficulty: ''
  });

  const fetchExperiments = async () => {
    try {
      setLoading(true);
      const response = await getExperiments();
      setExperiments(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch experiments. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiments();
    const interval = setInterval(fetchExperiments, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRunExperiment = async () => {
    if (!experimentConfig.name.trim()) {
      alert('Please enter an experiment name');
      return;
    }

    setRunningExperiment(true);
    setShowRunModal(false);

    try {
      const params = {
        name: experimentConfig.name,
        description: experimentConfig.description || '',
        domain: experimentConfig.domain || null,
        difficulty: experimentConfig.difficulty || null
      };

      const response = await runExperiment(params);

      if (response.data.status === 'running') {
        // Experiment running in background
        alert(`Experiment "${experimentConfig.name}" started in background!`);
      } else {
        alert(`Experiment completed! Baseline: ${(response.data.baseline_accuracy * 100).toFixed(1)}%, Improved: ${(response.data.improved_accuracy * 100).toFixed(1)}%`);
      }

      setExperimentConfig({ name: '', description: '', domain: '', difficulty: '' });
      fetchExperiments();
    } catch (err) {
      alert('Failed to run experiment: ' + err.message);
    } finally {
      setRunningExperiment(false);
    }
  };

  const handleViewExperiment = async (exp) => {
    try {
      const response = await getExperiment(exp.id);
      setSelectedExperiment(response.data);
    } catch (err) {
      alert('Failed to fetch experiment details');
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'info';
      case 'pending': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔬 Experiments</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowRunModal(true)}
          disabled={runningExperiment}
        >
          {runningExperiment ? <><Spinner size="sm" animation="border" className="me-2" /> Starting...</> : '+ Run Experiment'}
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Info Card */}
      <Card className="mb-4 bg-info">
        <Card.Body>
          <Card.Title>📊 About Experiments</Card.Title>
          <Card.Text>
            Experiments compare the baseline (single-pass) solver against the self-improving (two-stage) solver.
            The system runs both approaches on a set of engineering problems and measures:
          </Card.Text>
          <ul>
            <li><strong>Accuracy:</strong> Percentage of correct answers</li>
            <li><strong>Error Detection Rate:</strong> How often the critic identifies issues</li>
            <li><strong>Improvement:</strong> Difference in accuracy between methods</li>
          </ul>
        </Card.Body>
      </Card>

      {/* Experiments Table */}
      {loading && experiments.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : experiments.length === 0 ? (
        <Alert variant="info">
          No experiments yet. Click "Run Experiment" to start your first comparison study.
        </Alert>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Baseline Accuracy</th>
                  <th>Improved Accuracy</th>
                  <th>Improvement</th>
                  <th>Problems</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {experiments.map((exp) => (
                  <tr key={exp.id}>
                    <td>
                      <strong>{exp.name}</strong>
                      {exp.description && (
                        <div className="text-muted small">{exp.description}</div>
                      )}
                    </td>
                    <td>
                      <Badge bg={getStatusVariant(exp.status)}>{exp.status}</Badge>
                    </td>
                    <td style={{ minWidth: '200px' }}>
                      <div className="d-flex justify-content-between mb-1">
                        <small>{exp.completed_problems}/{exp.total_problems}</small>
                        <small>{Math.round((exp.completed_problems / exp.total_problems) * 100)}%</small>
                      </div>
                      <ProgressBar 
                        now={(exp.completed_problems / exp.total_problems) * 100}
                        variant={exp.status === 'completed' ? 'success' : 'info'}
                        label={`${Math.round((exp.completed_problems / exp.total_problems) * 100)}%`}
                      />
                    </td>
                    <td>
                      <span className={exp.baseline_accuracy >= 0.7 ? 'text-success' : exp.baseline_accuracy >= 0.5 ? 'text-warning' : 'text-danger'}>
                        {(exp.baseline_accuracy * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      <span className={exp.improved_accuracy >= 0.7 ? 'text-success' : exp.improved_accuracy >= 0.5 ? 'text-warning' : 'text-danger'}>
                        {(exp.improved_accuracy * 100).toFixed(1)}%
                      </span>
                    </td>
                    <td>
                      {exp.improved_accuracy - exp.baseline_accuracy !== 0 && (
                        <Badge bg={exp.improved_accuracy - exp.baseline_accuracy > 0 ? 'success' : 'danger'}>
                          {exp.improved_accuracy - exp.baseline_accuracy > 0 ? '+' : ''}
                          {((exp.improved_accuracy - exp.baseline_accuracy) * 100).toFixed(1)}%
                        </Badge>
                      )}
                    </td>
                    <td>{exp.total_problems}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewExperiment(exp)}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Run Experiment Modal */}
      <Modal show={showRunModal} onHide={() => setShowRunModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Run New Experiment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Experiment Name *</Form.Label>
              <Form.Control 
                value={experimentConfig.name}
                onChange={(e) => setExperimentConfig({...experimentConfig, name: e.target.value})}
                placeholder="e.g., Mechanics Test Run"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description (optional)</Form.Label>
              <Form.Control 
                as="textarea"
                rows={2}
                value={experimentConfig.description}
                onChange={(e) => setExperimentConfig({...experimentConfig, description: e.target.value})}
                placeholder="Brief description of this experiment..."
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Domain Filter (optional)</Form.Label>
                  <Form.Control
                    as="select"
                    value={experimentConfig.domain}
                    onChange={(e) => setExperimentConfig({...experimentConfig, domain: e.target.value})}
                  >
                    <option value="">All Domains</option>
                    <option value="mechanics">Mechanics</option>
                    <option value="circuits">Circuits</option>
                    <option value="calculus">Calculus</option>
                    <option value="algebra">Algebra</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Difficulty Filter (optional)</Form.Label>
                  <Form.Control
                    as="select"
                    value={experimentConfig.difficulty}
                    onChange={(e) => setExperimentConfig({...experimentConfig, difficulty: e.target.value})}
                  >
                    <option value="">All Difficulties</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Alert variant="info" className="mt-3 mb-0">
            <strong>Note:</strong> Experiments with more than 5 problems will run in the background.
            You can monitor progress from this page.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRunModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleRunExperiment}>
            Start Experiment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* View Experiment Details Modal */}
      {selectedExperiment && (
        <Modal 
          show={!!selectedExperiment} 
          onHide={() => setSelectedExperiment(null)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedExperiment.experiment?.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedExperiment.experiment && (
              <div>
                <p className="text-muted">{selectedExperiment.experiment.description}</p>
                
                <Row className="mb-4">
                  <Col md={3} className="text-center">
                    <h6>Status</h6>
                    <Badge bg={getStatusVariant(selectedExperiment.experiment.status)}>{selectedExperiment.experiment.status}</Badge>
                  </Col>
                  <Col md={3} className="text-center">
                    <h6>Baseline Accuracy</h6>
                    <h4 className="text-primary">
                      {(selectedExperiment.experiment.baseline_accuracy * 100).toFixed(1)}%
                    </h4>
                  </Col>
                  <Col md={3} className="text-center">
                    <h6>Improved Accuracy</h6>
                    <h4 className="text-success">
                      {(selectedExperiment.experiment.improved_accuracy * 100).toFixed(1)}%
                    </h4>
                  </Col>
                  <Col md={3} className="text-center">
                    <h6>Error Detection Rate</h6>
                    <h4 className="text-info">
                      {(selectedExperiment.experiment.error_detection_rate * 100).toFixed(1)}%
                    </h4>
                  </Col>
                </Row>

                <h5>Individual Results</h5>
                <Table size="sm" responsive>
                  <thead>
                    <tr>
                      <th>Problem ID</th>
                      <th>Baseline</th>
                      <th>Improved</th>
                      <th>Baseline Conf.</th>
                      <th>Improved Conf.</th>
                      <th>Errors Detected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExperiment.results?.map((result, i) => (
                      <tr key={i}>
                        <td>#{result.problem_id}</td>
                        <td>
                          <Badge bg={result.baseline_correct ? 'success' : 'danger'}>
                            {result.baseline_correct ? '✓' : '✗'}
                          </Badge>
                        </td>
                        <td>
                          <Badge bg={result.improved_correct ? 'success' : 'danger'}>
                            {result.improved_correct ? '✓' : '✗'}
                          </Badge>
                        </td>
                        <td>{(result.baseline_confidence * 100).toFixed(0)}%</td>
                        <td>{(result.improved_confidence * 100).toFixed(0)}%</td>
                        <td>{result.errors_detected?.length || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setSelectedExperiment(null)}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
}

export default Experiments;
