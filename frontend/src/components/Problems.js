import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Badge, Modal, Alert, Spinner, Table, Row, Col } from 'react-bootstrap';
import api, { getProblems, getProblem, createProblem, solveCustom } from '../api';

function Problems() {
  const [problems, setProblems] = useState([]);
  const [filteredProblems, setFilteredProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [newProblem, setNewProblem] = useState({
    title: '',
    description: '',
    domain: 'mechanics',
    difficulty: 'medium',
    expected_answer: '',
    expected_unit: ''
  });
  const [solving, setSolving] = useState(null);
  const [solutionResult, setSolutionResult] = useState(null);

  const domains = ['mechanics', 'circuits', 'calculus', 'algebra'];
  const difficulties = ['easy', 'medium', 'hard'];

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const params = {};
      if (selectedDomain !== 'all') params.domain = selectedDomain;
      if (selectedDifficulty !== 'all') params.difficulty = selectedDifficulty;

      const response = await getProblems(
        selectedDomain !== 'all' ? selectedDomain : null,
        selectedDifficulty !== 'all' ? selectedDifficulty : null
      );
      setProblems(response.data);
      setFilteredProblems(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch problems. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [selectedDomain, selectedDifficulty]);

  const handleCreateProblem = async () => {
    try {
      await createProblem({
        title: newProblem.title,
        description: newProblem.description,
        domain: newProblem.domain,
        difficulty: newProblem.difficulty,
        expected_answer: newProblem.expected_answer ? parseFloat(newProblem.expected_answer) : null,
        expected_unit: newProblem.expected_unit
      });
      setShowCreateModal(false);
      setNewProblem({
        title: '',
        description: '',
        domain: 'mechanics',
        difficulty: 'medium',
        expected_answer: '',
        expected_unit: ''
      });
      fetchProblems();
    } catch (err) {
      alert('Failed to create problem: ' + err.message);
    }
  };

  const handleViewProblem = async (problem) => {
    try {
      const response = await getProblem(problem.id);
      setSelectedProblem(response.data);
      setShowViewModal(true);
      setSolutionResult(null);
    } catch (err) {
      alert('Failed to fetch problem details');
    }
  };

  const handleSolveProblem = async (useImproved) => {
    if (!selectedProblem) return;

    setSolving(useImproved ? 'improved' : 'baseline');
    try {
      const response = await solveCustom(
        selectedProblem.id,
        null,
        useImproved
      );
      setSolutionResult(response.data);
    } catch (err) {
      setSolutionResult({ error: err.message });
    } finally {
      setSolving(null);
    }
  };

  const getDomainBadgeVariant = (domain) => {
    switch (domain) {
      case 'mechanics': return 'primary';
      case 'circuits': return 'warning';
      case 'calculus': return 'info';
      case 'algebra': return 'success';
      default: return 'secondary';
    }
  };

  const getDifficultyBadgeVariant = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'success';
      case 'medium': return 'warning';
      case 'hard': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>📚 Engineering Problems</h2>
        <Button variant="primary" onClick={() => setShowCreateModal(true)}>
          + Create Problem
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {/* Filters */}
      <Card className="mb-4">
        <Card.Body>
          <Form>
            <Row>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Domain</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                  >
                    <option value="all">All Domains</option>
                    {domains.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                  >
                    <option value="all">All Difficulties</option>
                    {difficulties.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex align-items-end">
                <Badge bg="secondary" pill>{filteredProblems.length} problems found</Badge>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {/* Problems List */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Row>
          {filteredProblems.map((problem) => (
            <Col md={6} lg={4} key={problem.id} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between mb-2">
                    <Badge bg={getDomainBadgeVariant(problem.domain)}>{problem.domain}</Badge>
                    <Badge bg={getDifficultyBadgeVariant(problem.difficulty)}>{problem.difficulty}</Badge>
                  </div>
                  <Card.Title>{problem.title}</Card.Title>
                  <Card.Text className="text-muted">
                    {problem.description.length > 100 
                      ? problem.description.substring(0, 100) + '...' 
                      : problem.description}
                  </Card.Text>
                </Card.Body>
                <Card.Footer>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    className="me-2"
                    onClick={() => handleViewProblem(problem)}
                  >
                    View & Solve
                  </Button>
                  <Badge bg="secondary" pill>{problem.source}</Badge>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Create Problem Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Problem</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control 
                value={newProblem.title}
                onChange={(e) => setNewProblem({...newProblem, title: e.target.value})}
                placeholder="e.g., Basic Acceleration Problem"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control 
                as="textarea"
                rows={4}
                value={newProblem.description}
                onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                placeholder="Describe the engineering problem..."
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Domain</Form.Label>
                  <Form.Control
                    as="select"
                    value={newProblem.domain}
                    onChange={(e) => setNewProblem({...newProblem, domain: e.target.value})}
                  >
                    {domains.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Control
                    as="select"
                    value={newProblem.difficulty}
                    onChange={(e) => setNewProblem({...newProblem, difficulty: e.target.value})}
                  >
                    {difficulties.map(d => <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>)}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Expected Answer (optional)</Form.Label>
                  <Form.Control
                    type="number"
                    step="any"
                    value={newProblem.expected_answer}
                    onChange={(e) => setNewProblem({...newProblem, expected_answer: e.target.value})}
                    placeholder="e.g., 9.8"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Unit (optional)</Form.Label>
                  <Form.Control
                    value={newProblem.expected_unit}
                    onChange={(e) => setNewProblem({...newProblem, expected_unit: e.target.value})}
                    placeholder="e.g., m/s²"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleCreateProblem}>Create Problem</Button>
        </Modal.Footer>
      </Modal>

      {/* View Problem Modal */}
      <Modal show={showViewModal} onHide={() => setShowViewModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{selectedProblem?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProblem && (
            <div>
              <div className="mb-3">
                <Badge bg={getDomainBadgeVariant(selectedProblem.domain)} className="me-2">
                  {selectedProblem.domain}
                </Badge>
                <Badge bg={getDifficultyBadgeVariant(selectedProblem.difficulty)}>
                  {selectedProblem.difficulty}
                </Badge>
              </div>
              
              <Card className="mb-3">
                <Card.Header>Problem Statement</Card.Header>
                <Card.Body>
                  <p>{selectedProblem.description}</p>
                </Card.Body>
              </Card>

              {selectedProblem.known_variables && selectedProblem.known_variables.length > 0 && (
                <Card className="mb-3">
                  <Card.Header>Known Variables</Card.Header>
                  <Card.Body>
                    <Table size="sm">
                      <thead>
                        <tr><th>Name</th><th>Value</th><th>Unit</th></tr>
                      </thead>
                      <tbody>
                        {selectedProblem.known_variables.map((v, i) => (
                          <tr key={i}>
                            <td>{v.name}</td>
                            <td>{v.value}</td>
                            <td>{v.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}

              {selectedProblem.expected_answer !== null && (
                <Alert variant="info">
                  <strong>Expected Answer:</strong> {selectedProblem.expected_answer} {selectedProblem.expected_unit}
                </Alert>
              )}

              <hr />
              
              <h5>Solve This Problem</h5>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  onClick={() => handleSolveProblem(false)}
                  disabled={solving !== null}
                >
                  {solving === 'baseline' ? <Spinner size="sm" animation="border" /> : '⚡ Baseline Solver'}
                </Button>
                <Button 
                  variant="outline-success" 
                  onClick={() => handleSolveProblem(true)}
                  disabled={solving !== null}
                >
                  {solving === 'improved' ? <Spinner size="sm" animation="border" /> : '🧠 Self-Improving Solver'}
                </Button>
              </div>

              {solutionResult && (
                <Card className="mt-3">
                  <Card.Header>
                    <Badge bg={solutionResult.method === 'self-improving' ? 'success' : 'primary'}>
                      {solutionResult.method === 'self-improving' ? 'Self-Improving' : 'Baseline'}
                    </Badge>
                  </Card.Header>
                  <Card.Body>
                    {solutionResult.error ? (
                      <Alert variant="danger">{solutionResult.error}</Alert>
                    ) : (
                      <div>
                        {solutionResult.result && (
                          <>
                            {solutionResult.result.improved_solution?.steps && (
                              <div className="mb-3">
                                <strong>Solution Steps:</strong>
                                <ol>
                                  {solutionResult.result.improved_solution.steps.map((step, i) => (
                                    <li key={i}>{step}</li>
                                  ))}
                                </ol>
                              </div>
                            )}
                            {solutionResult.result.improved_solution?.final_answer !== undefined && (
                              <Alert variant="success">
                                <strong>Final Answer:</strong> {solutionResult.result.improved_solution.final_answer} {solutionResult.result.improved_solution.final_unit}
                              </Alert>
                            )}
                            {solutionResult.result.improvement_made !== undefined && (
                              <Alert variant={solutionResult.result.improvement_made ? 'info' : 'secondary'}>
                                <strong>Improvement Made:</strong> {solutionResult.result.improvement_made ? 'Yes' : 'No'}
                              </Alert>
                            )}
                            {solutionResult.result.confidence_score && (
                              <Alert variant="info">
                                <strong>Confidence:</strong> {(solutionResult.result.confidence_score * 100).toFixed(1)}%
                              </Alert>
                            )}
                            {solutionResult.result.is_correct !== null && (
                              <Alert variant={solutionResult.result.is_correct ? 'success' : 'danger'}>
                                <strong>Correct:</strong> {solutionResult.result.is_correct ? '✓ Yes' : '✗ No'}
                              </Alert>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowViewModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Problems;
