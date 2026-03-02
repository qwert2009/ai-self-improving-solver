import React, { useState } from 'react';
import { Card, Button, Form, Alert, Spinner, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import api, { solveBaseline, solveImproved, solveCustom } from '../api';

function Solver() {
  const [problemText, setProblemText] = useState('');
  const [expectedAnswer, setExpectedAnswer] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [solving, setSolving] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);

  const domains = [
    { value: 'all', label: 'Auto-detect' },
    { value: 'mechanics', label: 'Mechanics' },
    { value: 'circuits', label: 'Circuits' },
    { value: 'calculus', label: 'Calculus' },
    { value: 'algebra', label: 'Algebra' }
  ];

  const exampleProblems = [
    "A car accelerates from rest to 20 m/s in 5 seconds. What is its acceleration?",
    "A 12 V battery is connected to a 4 Ω resistor. What current flows through the circuit?",
    "Find the derivative of f(x) = 3x² + 5x - 2",
    "Solve for x: 3x + 7 = 22"
  ];

  const handleSolve = async (method) => {
    if (!problemText.trim()) {
      setError('Please enter a problem statement');
      return;
    }

    setSolving(method);
    setError(null);
    setResult(null);

    try {
      const startTime = Date.now();
      let response;

      if (method === 'baseline') {
        response = await solveBaseline(problemText, selectedDomain !== 'all' ? selectedDomain : null);
      } else {
        response = await solveImproved(
          problemText,
          expectedAnswer ? parseFloat(expectedAnswer) : null
        );
      }

      const endTime = Date.now();

      const solutionData = {
        method,
        data: response.data,
        timestamp: new Date().toISOString(),
        executionTime: endTime - startTime
      };

      setResult(solutionData);
      setHistory(prev => [solutionData, ...prev.slice(0, 9)]); // Keep last 10
    } catch (err) {
      setError('Failed to solve problem: ' + (err.response?.data?.detail || err.message));
    } finally {
      setSolving(null);
    }
  };

  const loadExample = (example) => {
    setProblemText(example);
    setError(null);
  };

  const clearAll = () => {
    setProblemText('');
    setExpectedAnswer('');
    setResult(null);
    setError(null);
  };

  return (
    <div>
      <h2 className="mb-4">🧮 Problem Solver</h2>

      <Row>
        <Col md={8}>
          {/* Input Card */}
          <Card className="mb-4">
            <Card.Header>
              <strong>Enter Engineering Problem</strong>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Domain</Form.Label>
                  <Form.Control 
                    as="select"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                  >
                    {domains.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </Form.Control>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Problem Statement</Form.Label>
                  <Form.Control 
                    as="textarea"
                    rows={5}
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    placeholder="Enter your engineering problem here..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Expected Answer (for validation, optional)</Form.Label>
                  <Form.Control 
                    type="number"
                    step="any"
                    value={expectedAnswer}
                    onChange={(e) => setExpectedAnswer(e.target.value)}
                    placeholder="e.g., 9.8"
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button 
                    variant="primary" 
                    onClick={() => handleSolve('baseline')}
                    disabled={solving !== null || !problemText.trim()}
                  >
                    {solving === 'baseline' ? (
                      <><Spinner size="sm" animation="border" className="me-2" /> Solving...</>
                    ) : '⚡ Solve (Baseline)'}
                  </Button>
                  <Button 
                    variant="success" 
                    onClick={() => handleSolve('improved')}
                    disabled={solving !== null || !problemText.trim()}
                  >
                    {solving === 'improved' ? (
                      <><Spinner size="sm" animation="border" className="me-2" /> Solving...</>
                    ) : '🧠 Solve (Self-Improving)'}
                  </Button>
                  <Button variant="outline-secondary" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* Result Card */}
          {result && (
            <Card className="mb-4">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <div>
                  <Badge bg={result.method === 'baseline' ? 'primary' : 'success'}>
                    {result.method === 'baseline' ? 'Baseline Solver' : 'Self-Improving Solver'}
                  </Badge>
                  <span className="ms-2 text-muted">
                    Execution time: {(result.executionTime / 1000).toFixed(2)}s
                  </span>
                </div>
                <Badge bg="secondary">{result.timestamp}</Badge>
              </Card.Header>
              <Card.Body>
                {result.method === 'improved' && result.data.result ? (
                  <div>
                    {/* Comparison Section */}
                    <Row className="mb-4">
                      <Col md={6}>
                        <Card bg="light">
                          <Card.Header>Baseline Solution</Card.Header>
                          <Card.Body>
                            {result.data.result.baseline_solution?.final_answer !== undefined && (
                              <div className="mb-2">
                                <strong>Answer:</strong> {result.data.result.baseline_solution.final_answer} {result.data.result.baseline_solution.final_unit}
                              </div>
                            )}
                            {result.data.result.baseline_solution?.confidence_score && (
                              <div>
                                <strong>Confidence:</strong> {(result.data.result.baseline_solution.confidence_score * 100).toFixed(1)}%
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                      <Col md={6}>
                        <Card bg="light">
                          <Card.Header>Improved Solution</Card.Header>
                          <Card.Body>
                            {result.data.result.improved_solution?.final_answer !== undefined && (
                              <div className="mb-2">
                                <strong>Answer:</strong> {result.data.result.improved_solution.final_answer} {result.data.result.improved_solution.final_unit}
                              </div>
                            )}
                            {result.data.result.confidence_score && (
                              <div>
                                <strong>Confidence:</strong> {(result.data.result.confidence_score * 100).toFixed(1)}%
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>

                    {/* Critique Section */}
                    {result.data.result.critique?.issues_found && result.data.result.critique.issues_found.length > 0 && (
                      <Alert variant="warning" className="mb-3">
                        <strong>⚠️ Issues Found:</strong>
                        <ul className="mb-0 mt-2">
                          {result.data.result.critique.issues_found.map((issue, i) => (
                            <li key={i}>
                              <Badge bg={issue.severity === 'high' ? 'danger' : issue.severity === 'medium' ? 'warning' : 'info'} className="me-2">
                                {issue.severity}
                              </Badge>
                              [{issue.type}] {issue.description}
                            </li>
                          ))}
                        </ul>
                      </Alert>
                    )}

                    {/* Solution Steps */}
                    {result.data.result.improved_solution?.steps && (
                      <Card className="mb-3">
                        <Card.Header>Solution Steps</Card.Header>
                        <Card.Body>
                          <ol>
                            {result.data.result.improved_solution.steps.map((step, i) => (
                              <li key={i} className="mb-2">{step}</li>
                            ))}
                          </ol>
                        </Card.Body>
                      </Card>
                    )}

                    {/* Final Result */}
                    {result.data.result.is_correct !== null && (
                      <Alert variant={result.data.result.is_correct ? 'success' : 'danger'}>
                        <h4>
                          {result.data.result.is_correct ? '✓ Correct!' : '✗ Incorrect'}
                        </h4>
                        {expectedAnswer && (
                          <p className="mb-0">
                            Expected: {expectedAnswer} | Got: {result.data.result.improved_solution?.final_answer}
                          </p>
                        )}
                      </Alert>
                    )}

                    {/* Improvement Status */}
                    <Alert variant={result.data.result.improvement_made ? 'info' : 'secondary'}>
                      <strong>Improvement Made:</strong> {result.data.result.improvement_made ? 'Yes ✓' : 'No (original solution was optimal)'}
                    </Alert>
                  </div>
                ) : result.data.solution ? (
                  // Baseline only result
                  <div>
                    {result.data.solution.steps && (
                      <Card className="mb-3">
                        <Card.Header>Solution Steps</Card.Header>
                        <Card.Body>
                          <ol>
                            {result.data.solution.steps.map((step, i) => (
                              <li key={i} className="mb-2">{step}</li>
                            ))}
                          </ol>
                        </Card.Body>
                      </Card>
                    )}
                    {result.data.solution.final_answer !== undefined && (
                      <Alert variant="success">
                        <strong>Final Answer:</strong> {result.data.solution.final_answer} {result.data.solution.final_unit}
                      </Alert>
                    )}
                  </div>
                ) : null}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* Sidebar */}
        <Col md={4}>
          {/* Example Problems */}
          <Card className="mb-4">
            <Card.Header>📝 Example Problems</Card.Header>
            <Card.Body>
              <p className="text-muted small">Click to load an example:</p>
              {exampleProblems.map((example, i) => (
                <Button 
                  key={i}
                  variant="outline-secondary" 
                  size="sm"
                  className="mb-2 w-100 text-start"
                  onClick={() => loadExample(example)}
                >
                  {example.length > 50 ? example.substring(0, 50) + '...' : example}
                </Button>
              ))}
            </Card.Body>
          </Card>

          {/* History */}
          {history.length > 0 && (
            <Card>
              <Card.Header>📜 Recent Solutions</Card.Header>
              <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {history.map((item, i) => (
                  <Card key={i} bg="light" className="mb-2">
                    <Card.Body className="p-2">
                      <div className="d-flex justify-content-between">
                        <Badge bg={item.method === 'baseline' ? 'primary' : 'success'}>
                          {item.method}
                        </Badge>
                        <small className="text-muted">
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </small>
                      </div>
                      <small className="text-muted">{item.data.result?.improved_solution?.final_answer || item.data.solution?.final_answer || 'N/A'}</small>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default Solver;
