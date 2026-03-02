import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import api, { getStats, getExperiments, getComparisonAnalysis } from '../api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [experiments, setExperiments] = useState([]);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, experimentsRes, analysisRes] = await Promise.all([
        getStats(),
        getExperiments(),
        getComparisonAnalysis()
      ]);
      setStats(statsRes.data);
      setExperiments(experimentsRes.data);
      setAnalysis(analysisRes.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data. Make sure the backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000); // Refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading && !stats) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  if (error && !stats) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Connection Error</Alert.Heading>
        <p>{error}</p>
        <hr />
        <p className="mb-0">Please ensure the backend server is running on port 8000.</p>
      </Alert>
    );
  }

  const progressData = experiments.slice(0, 5).map(exp => ({
    name: exp.name.length > 15 ? exp.name.substring(0, 15) + '...' : exp.name,
    progress: Math.round((exp.completed_problems / exp.total_problems) * 100),
    status: exp.status
  }));

  const accuracyData = analysis?.data ? [
    { name: 'Baseline', accuracy: (analysis.data.summary.baseline_accuracy * 100).toFixed(1) },
    { name: 'Self-Improving', accuracy: (analysis.data.summary.improved_accuracy * 100).toFixed(1) }
  ] : [];

  const domainData = stats ? [
    { name: 'Problems', value: stats.total_problems || 0 },
    { name: 'Baseline Solutions', value: stats.total_baseline_solutions || 0 },
    { name: 'Improved Solutions', value: stats.total_improved_solutions || 0 },
    { name: 'Experiments', value: stats.total_experiments || 0 }
  ] : [];

  return (
    <div>
      <h2 className="mb-4">📊 Dashboard</h2>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card bg="primary" text="white" className="text-center">
            <Card.Body>
              <Card.Title>Problems</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats?.total_problems || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="success" text="white" className="text-center">
            <Card.Body>
              <Card.Title>Baseline Solutions</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats?.total_baseline_solutions || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="info" text="white" className="text-center">
            <Card.Body>
              <Card.Title>Improved Solutions</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats?.total_improved_solutions || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card bg="warning" text="dark" className="text-center">
            <Card.Body>
              <Card.Title>Experiments</Card.Title>
              <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                {stats?.total_experiments || 0}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Analysis Summary */}
      {analysis?.data && (
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Header>
                <strong>🔬 Research Summary</strong>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={3} className="text-center">
                    <h6>Baseline Accuracy</h6>
                    <h3 className="text-primary">
                      {(analysis.data.summary.baseline_accuracy * 100).toFixed(1)}%
                    </h3>
                  </Col>
                  <Col md={3} className="text-center">
                    <h6>Self-Improving Accuracy</h6>
                    <h3 className="text-success">
                      {(analysis.data.summary.improved_accuracy * 100).toFixed(1)}%
                    </h3>
                  </Col>
                  <Col md={3} className="text-center">
                    <h6>Improvement</h6>
                    <h3 className={analysis.data.summary.accuracy_improvement > 0 ? 'text-success' : 'text-danger'}>
                      {(analysis.data.summary.accuracy_improvement * 100).toFixed(1)}%
                    </h3>
                  </Col>
                  <Col md={3} className="text-center">
                    <h6>Relative Gain</h6>
                    <h3 className={analysis.data.summary.improvement_percentage > 0 ? 'text-success' : 'text-danger'}>
                      {(analysis.data.summary.improvement_percentage).toFixed(1)}%
                    </h3>
                  </Col>
                </Row>
                <Alert variant={analysis.data.summary.accuracy_improvement > 0 ? 'success' : 'info'} className="mt-3 mb-0">
                  <strong>Conclusion:</strong> {analysis.data.conclusion}
                </Alert>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}

      {/* Charts */}
      <Row className="mb-4">
        <Col md={6}>
          <Card>
            <Card.Header>📈 Accuracy Comparison</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={accuracyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="accuracy" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card>
            <Card.Header>📊 System Activity</Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={domainData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {domainData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Experiments Progress */}
      <Row>
        <Col>
          <Card>
            <Card.Header>🔬 Recent Experiments Progress</Card.Header>
            <Card.Body>
              {progressData.length > 0 ? (
                progressData.map((exp, index) => (
                  <div key={index} className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>{exp.name}</span>
                      <span className={exp.status === 'completed' ? 'text-success' : 'text-primary'}>
                        {exp.progress}% ({exp.status})
                      </span>
                    </div>
                    <ProgressBar
                      now={exp.progress}
                      variant={exp.status === 'completed' ? 'success' : exp.status === 'running' ? 'info' : 'secondary'}
                      label={`${exp.progress}%`}
                    />
                  </div>
                ))
              ) : (
                <p className="text-muted text-center">No experiments yet. Run an experiment from the Experiments page.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Dashboard;
