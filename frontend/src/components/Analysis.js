import React, { useState, useEffect } from 'react';
import { Card, Alert, Spinner, Row, Col, Table, Badge, ProgressBar } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Area, Line } from 'recharts';
import api, { getComparisonAnalysis, getExperiments } from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Analysis() {
  const [analysis, setAnalysis] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analysisRes, experimentsRes] = await Promise.all([
        getComparisonAnalysis(),
        getExperiments()
      ]);
      setAnalysis(analysisRes.data);
      setExperiments(experimentsRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch analysis data. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading analysis...</p>
      </div>
    );
  }

  if (error && !analysis) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Connection Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  if (!analysis?.data) {
    return (
      <Alert variant="info">
        <Alert.Heading>No Data Available</Alert.Heading>
        <p>No completed experiments found. Run an experiment from the Experiments page to see analysis.</p>
      </Alert>
    );
  }

  // Prepare data for charts
  const comparisonData = [
    {
      metric: 'Baseline',
      accuracy: parseFloat(analysis.data.summary.baseline_accuracy.toFixed(3)) * 100,
      fill: '#8884d8'
    },
    {
      metric: 'Self-Improving',
      accuracy: parseFloat(analysis.data.summary.improved_accuracy.toFixed(3)) * 100,
      fill: '#82ca9d'
    }
  ];

  const experimentTrendData = experiments.map((exp, i) => ({
    name: `Exp ${i + 1}`,
    baseline: parseFloat((exp.baseline_accuracy * 100).toFixed(1)),
    improved: parseFloat((exp.improved_accuracy * 100).toFixed(1)),
    improvement: parseFloat(((exp.improved_accuracy - exp.baseline_accuracy) * 100).toFixed(1))
  }));

  const improvementDistribution = experiments.reduce((acc, exp) => {
    const diff = exp.improved_accuracy - exp.baseline_accuracy;
    if (diff > 0) acc.positive++;
    else if (diff < 0) acc.negative++;
    else acc.neutral++;
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });

  const improvementPieData = [
    { name: 'Positive Improvement', value: improvementDistribution.positive, fill: '#00C49F' },
    { name: 'No Change', value: improvementDistribution.neutral, fill: '#FFBB28' },
    { name: 'Negative', value: improvementDistribution.negative, fill: '#FF8042' }
  ];

  return (
    <div>
      <h2 className="mb-4">📈 Research Analysis</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Total Experiments</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }} className="text-primary">
                {analysis.data.summary.total_experiments}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Problems Solved</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }} className="text-info">
                {analysis.data.summary.total_problems_solved}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Avg. Baseline Accuracy</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }} className={analysis.data.summary.baseline_accuracy >= 0.7 ? 'text-success' : 'text-warning'}>
                {(analysis.data.summary.baseline_accuracy * 100).toFixed(1)}%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <Card.Title>Avg. Improved Accuracy</Card.Title>
              <Card.Text style={{ fontSize: '2.5rem', fontWeight: 'bold' }} className={analysis.data.summary.improved_accuracy >= 0.7 ? 'text-success' : 'text-warning'}>
                {(analysis.data.summary.improved_accuracy * 100).toFixed(1)}%
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Key Findings */}
      <Card className="mb-4">
        <Card.Header bg="dark" text="white">
          <strong>🔬 Key Research Findings</strong>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h5>Accuracy Comparison</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis domain={[0, 100]} label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#8884d8" label={{ position: 'top', formatter: (v) => `${v.toFixed(1)}%` }} />
                </BarChart>
              </ResponsiveContainer>
            </Col>
            <Col md={6}>
              <h5>Improvement Distribution</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={improvementPieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    dataKey="value"
                  >
                    {improvementPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Col>
          </Row>

          <Row className="mt-4">
            <Col>
              <Alert variant={analysis.data.summary.accuracy_improvement > 0 ? 'success' : 'warning'}>
                <h4>📊 Research Conclusion</h4>
                <p className="mb-0">
                  <strong>{analysis.data.conclusion}</strong>
                </p>
                <hr />
                <div className="row">
                  <div className="col-md-4">
                    <strong>Absolute Improvement:</strong> {(analysis.data.summary.accuracy_improvement * 100).toFixed(2)}%
                  </div>
                  <div className="col-md-4">
                    <strong>Relative Gain:</strong> {(analysis.data.summary.improvement_percentage).toFixed(2)}%
                  </div>
                  <div className="col-md-4">
                    <strong>Self-Improvement Efficacy:</strong> {analysis.data.summary.improvement_percentage > 10 ? 'High' : analysis.data.summary.improvement_percentage > 5 ? 'Moderate' : 'Low'}
                  </div>
                </div>
              </Alert>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Experiment Trends */}
      {experimentTrendData.length > 0 && (
        <Card className="mb-4">
          <Card.Header>
            <strong>📉 Experiment Trends Over Time</strong>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={experimentTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} label={{ value: 'Accuracy (%)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
                <Legend />
                <Area type="monotone" dataKey="baseline" fill="#8884d8" stroke="#8884d8" name="Baseline" />
                <Area type="monotone" dataKey="improved" fill="#82ca9d" stroke="#82ca9d" name="Self-Improving" />
                <Line type="monotone" dataKey="improvement" stroke="#ff7300" name="Improvement" strokeWidth={2} />
              </ComposedChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      )}

      {/* Detailed Statistics Table */}
      <Card>
        <Card.Header>
          <strong>📋 Detailed Experiment Statistics</strong>
        </Card.Header>
        <Card.Body>
          <Table responsive hover size="sm">
            <thead>
              <tr>
                <th>Experiment</th>
                <th>Baseline Accuracy</th>
                <th>Improved Accuracy</th>
                <th>Absolute Improvement</th>
                <th>Relative Gain</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analysis.data.experiments.map((exp, i) => (
                <tr key={i}>
                  <td><strong>{exp.name}</strong></td>
                  <td>
                    <span className={exp.baseline >= 0.7 ? 'text-success' : exp.baseline >= 0.5 ? 'text-warning' : 'text-danger'}>
                      {(exp.baseline * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <span className={exp.improved >= 0.7 ? 'text-success' : exp.improved >= 0.5 ? 'text-warning' : 'text-danger'}>
                      {(exp.improved * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td>
                    <Badge bg={exp.improvement > 0 ? 'success' : exp.improvement < 0 ? 'danger' : 'secondary'}>
                      {exp.improvement > 0 ? '+' : ''}{(exp.improvement * 100).toFixed(1)}%
                    </Badge>
                  </td>
                  <td>
                    {exp.baseline > 0 ? ((exp.improvement / exp.baseline) * 100).toFixed(1) : 0}%
                  </td>
                  <td>
                    <Badge bg="success">Completed</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* Research Metrics */}
      <Row className="mt-4">
        <Col md={6}>
          <Card>
            <Card.Header>📊 Statistical Metrics</Card.Header>
            <Card.Body>
              <Table size="sm">
                <tbody>
                  <tr>
                    <td><strong>Total Problems Analyzed</strong></td>
                    <td className="text-end">{analysis.data.summary.total_problems_solved}</td>
                  </tr>
                  <tr>
                    <td><strong>Baseline Success Rate</strong></td>
                    <td className="text-end">{(analysis.data.summary.baseline_accuracy * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td><strong>Self-Improving Success Rate</strong></td>
                    <td className="text-end">{(analysis.data.summary.improved_accuracy * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td><strong>Net Accuracy Improvement</strong></td>
                    <td className="text-end">{(analysis.data.summary.accuracy_improvement * 100).toFixed(2)}%</td>
                  </tr>
                  <tr>
                    <td><strong>Relative Performance Gain</strong></td>
                    <td className="text-end">{(analysis.data.summary.improvement_percentage).toFixed(2)}%</td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>🎯 Research Questions Answered</Card.Header>
            <Card.Body>
              <ul className="list-group list-group-flush">
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Does self-reflection improve accuracy?</span>
                  <Badge bg={analysis.data.summary.accuracy_improvement > 0 ? 'success' : 'warning'}>
                    {analysis.data.summary.accuracy_improvement > 0 ? 'Yes ✓' : 'Inconclusive'}
                  </Badge>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Is two-stage approach better?</span>
                  <Badge bg={analysis.data.summary.improved_accuracy > analysis.data.summary.baseline_accuracy ? 'success' : 'warning'}>
                    {analysis.data.summary.improved_accuracy > analysis.data.summary.baseline_accuracy ? 'Yes ✓' : 'No'}
                  </Badge>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <span>Is improvement statistically significant?</span>
                  <Badge bg={analysis.data.summary.improvement_percentage > 5 ? 'success' : 'info'}>
                    {analysis.data.summary.improvement_percentage > 10 ? 'Highly' : analysis.data.summary.improvement_percentage > 5 ? 'Moderately' : 'Marginally'}
                  </Badge>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Analysis;
