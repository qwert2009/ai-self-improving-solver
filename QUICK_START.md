# Senior Project - Quick Start Guide

## Project: Self-Improving AI System for Engineering Problem Solving

### What This Project Does

This system implements an AI that:
1. **Solves engineering problems** (mechanics, circuits, calculus, algebra)
2. **Reviews its own solutions** using a critic/validator agent
3. **Improves accuracy** through self-reflection
4. **Tracks progress** with experiments and analysis

### Quick Start

**Option 1: Run Everything (Recommended)**
```
Double-click: RUN.bat
```

**Option 2: Manual Start**
1. Start backend: `start_backend.bat`
2. Start frontend: `start_frontend_simple.bat`

### Access Points

- **Frontend (UI)**: http://localhost:3000
- **API Documentation**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/health

### Features

#### 1. Dashboard
- Real-time statistics
- System health monitoring
- Recent experiments overview
- Accuracy comparison charts

#### 2. Problems Library
- 32 engineering problems pre-loaded
- Filter by domain (mechanics, circuits, calculus, algebra)
- Filter by difficulty (easy, medium, hard)
- Create custom problems

#### 3. Solver
- **Baseline Solver**: Fast single-pass solution
- **Self-Improving Solver**: Two-stage with critique
- Example problems included
- Step-by-step solutions

#### 4. Experiments
- Run comparative studies
- Track baseline vs improved accuracy
- Monitor progress in real-time
- Save results to database

#### 5. Analysis
- Research findings visualization
- Accuracy comparison charts
- Statistical metrics
- Conclusion generation

### Project Structure

```
senior_project/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── solver.py               # Baseline solver
│   ├── critic.py               # Critic/validator
│   ├── self_improving_solver.py # Two-stage solver
│   ├── llm_client.py           # AI API client
│   ├── problems.py             # 32 engineering problems
│   ├── models.py               # Database models
│   ├── database.py             # DB connection
│   └── config.py               # Settings
├── frontend/
│   ├── index.html              # Single-page UI
│   └── src/                    # React components
├── .env                        # API keys & config
├── requirements.txt            # Python dependencies
├── RUN.bat                     # Quick start script
└── README.md                   # Full documentation
```

### Technical Details

**Backend:**
- Framework: FastAPI (Python)
- Database: SQLite with SQLAlchemy
- AI APIs: DeepSeek, Google Gemini
- Architecture: Two-stage (Solver + Critic)

**Frontend:**
- Bootstrap 5 for UI
- Chart.js for visualizations
- Axios for API calls
- Vanilla JavaScript (no build required)

### How It Works

1. **Problem Input**: User enters or selects an engineering problem
2. **Baseline Solving**: AI solves using single-pass reasoning
3. **Critique Phase**: Second AI layer reviews for errors
4. **Improvement**: Solution revised if issues found
5. **Comparison**: Results compared and stored
6. **Analysis**: Statistics aggregated across experiments

### Research Question

*"Can a self-reflective AI system improve the accuracy and clarity of engineering problem-solving compared to a standard single-pass solution method?"*

### Testing the System

1. **Open** http://localhost:3000
2. **Go to** Problems page
3. **Click** on any problem
4. **Try** both solvers (Baseline and Self-Improving)
5. **Compare** the results
6. **Run** an experiment from Experiments page
7. **View** analysis in Analysis page

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/problems | List all problems |
| GET | /api/problems/{id} | Get specific problem |
| POST | /api/solve/baseline | Solve with baseline |
| POST | /api/solve/improved | Solve with self-improvement |
| POST | /api/experiments/run | Run new experiment |
| GET | /api/experiments | List experiments |
| GET | /api/analysis/comparison | Get analysis |
| GET | /api/stats | System statistics |
| GET | /api/health | Health check |

### Troubleshooting

**Backend won't start:**
- Check if Python 3.9+ is installed
- Ensure virtual environment is activated
- Verify .env file exists with API keys

**Frontend won't load:**
- Check if backend is running on port 8000
- Ensure port 3000 is not in use
- Try refreshing the browser

**API errors:**
- Check API keys in .env file
- Verify internet connection for AI APIs
- Check backend logs for details

### Next Steps

1. **Run experiments** to collect data
2. **Analyze results** in the Analysis page
3. **Export findings** for your research paper
4. **Add more problems** to expand the dataset
5. **Customize** the system for your needs

### Support

For issues or questions:
1. Check the README.md for detailed documentation
2. Review API docs at http://localhost:8000/docs
3. Check backend logs in the console window

---

**Good luck with your senior project presentation!**
