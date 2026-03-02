ENGINEERING_PROBLEMS = [
    {
        "id": 1,
        "title": "Basic Acceleration",
        "description": "A car accelerates from rest to 20 m/s in 5 seconds. What is its acceleration?",
        "domain": "mechanics",
        "difficulty": "easy",
        "known_variables": [{"name": "initial_velocity", "value": 0, "unit": "m/s"}, {"name": "final_velocity", "value": 20, "unit": "m/s"}, {"name": "time", "value": 5, "unit": "s"}],
        "unknown_variables": ["acceleration"],
        "expected_answer": 4.0,
        "expected_unit": "m/s²"
    },
    {
        "id": 2,
        "title": "Force Calculation",
        "description": "A 10 kg object experiences a net force of 50 N. What is its acceleration?",
        "domain": "mechanics",
        "difficulty": "easy",
        "known_variables": [{"name": "mass", "value": 10, "unit": "kg"}, {"name": "force", "value": 50, "unit": "N"}],
        "unknown_variables": ["acceleration"],
        "expected_answer": 5.0,
        "expected_unit": "m/s²"
    },
    {
        "id": 3,
        "title": "Free Fall Distance",
        "description": "An object is dropped from rest. How far does it fall in 3 seconds? (g = 9.8 m/s²)",
        "domain": "mechanics",
        "difficulty": "easy",
        "known_variables": [{"name": "initial_velocity", "value": 0, "unit": "m/s"}, {"name": "time", "value": 3, "unit": "s"}, {"name": "gravity", "value": 9.8, "unit": "m/s²"}],
        "unknown_variables": ["distance"],
        "expected_answer": 44.1,
        "expected_unit": "m"
    },
    {
        "id": 4,
        "title": "Projectile Maximum Height",
        "description": "A ball is thrown vertically upward with initial velocity of 30 m/s. What maximum height does it reach? (g = 9.8 m/s²)",
        "domain": "mechanics",
        "difficulty": "medium",
        "known_variables": [{"name": "initial_velocity", "value": 30, "unit": "m/s"}, {"name": "final_velocity", "value": 0, "unit": "m/s"}, {"name": "gravity", "value": 9.8, "unit": "m/s²"}],
        "unknown_variables": ["height"],
        "expected_answer": 45.92,
        "expected_unit": "m"
    },
    {
        "id": 5,
        "title": "Kinetic Energy",
        "description": "Calculate the kinetic energy of a 1500 kg car moving at 25 m/s.",
        "domain": "mechanics",
        "difficulty": "easy",
        "known_variables": [{"name": "mass", "value": 1500, "unit": "kg"}, {"name": "velocity", "value": 25, "unit": "m/s"}],
        "unknown_variables": ["kinetic_energy"],
        "expected_answer": 468750.0,
        "expected_unit": "J"
    },
    {
        "id": 6,
        "title": "Momentum Conservation",
        "description": "A 2 kg ball moving at 10 m/s collides with a stationary 3 kg ball. If they stick together, what is their final velocity?",
        "domain": "mechanics",
        "difficulty": "medium",
        "known_variables": [{"name": "mass1", "value": 2, "unit": "kg"}, {"name": "velocity1", "value": 10, "unit": "m/s"}, {"name": "mass2", "value": 3, "unit": "kg"}, {"name": "velocity2", "value": 0, "unit": "m/s"}],
        "unknown_variables": ["final_velocity"],
        "expected_answer": 4.0,
        "expected_unit": "m/s"
    },
    {
        "id": 7,
        "title": "Inclined Plane",
        "description": "A 5 kg block slides down a frictionless 30° incline. What is its acceleration? (g = 9.8 m/s²)",
        "domain": "mechanics",
        "difficulty": "medium",
        "known_variables": [{"name": "mass", "value": 5, "unit": "kg"}, {"name": "angle", "value": 30, "unit": "degrees"}, {"name": "gravity", "value": 9.8, "unit": "m/s²"}],
        "unknown_variables": ["acceleration"],
        "expected_answer": 4.9,
        "expected_unit": "m/s²"
    },
    {
        "id": 8,
        "title": "Circular Motion",
        "description": "A 0.5 kg object moves in a circle of radius 2 m at 6 m/s. What is the centripetal force?",
        "domain": "mechanics",
        "difficulty": "medium",
        "known_variables": [{"name": "mass", "value": 0.5, "unit": "kg"}, {"name": "radius", "value": 2, "unit": "m"}, {"name": "velocity", "value": 6, "unit": "m/s"}],
        "unknown_variables": ["centripetal_force"],
        "expected_answer": 9.0,
        "expected_unit": "N"
    },
    {
        "id": 9,
        "title": "Work Done",
        "description": "A force of 100 N pushes an object 15 m in the direction of the force. How much work is done?",
        "domain": "mechanics",
        "difficulty": "easy",
        "known_variables": [{"name": "force", "value": 100, "unit": "N"}, {"name": "distance", "value": 15, "unit": "m"}],
        "unknown_variables": ["work"],
        "expected_answer": 1500.0,
        "expected_unit": "J"
    },
    {
        "id": 10,
        "title": "Pendulum Period",
        "description": "What is the period of a simple pendulum with length 1.5 m? (g = 9.8 m/s²)",
        "domain": "mechanics",
        "difficulty": "medium",
        "known_variables": [{"name": "length", "value": 1.5, "unit": "m"}, {"name": "gravity", "value": 9.8, "unit": "m/s²"}],
        "unknown_variables": ["period"],
        "expected_answer": 2.46,
        "expected_unit": "s"
    },
    {
        "id": 11,
        "title": "Ohm's Law Basic",
        "description": "A 12 V battery is connected to a 4 Ω resistor. What current flows through the circuit?",
        "domain": "circuits",
        "difficulty": "easy",
        "known_variables": [{"name": "voltage", "value": 12, "unit": "V"}, {"name": "resistance", "value": 4, "unit": "Ω"}],
        "unknown_variables": ["current"],
        "expected_answer": 3.0,
        "expected_unit": "A"
    },
    {
        "id": 12,
        "title": "Series Resistors",
        "description": "Three resistors (2 Ω, 3 Ω, 5 Ω) are connected in series with a 20 V battery. What is the total current?",
        "domain": "circuits",
        "difficulty": "easy",
        "known_variables": [{"name": "r1", "value": 2, "unit": "Ω"}, {"name": "r2", "value": 3, "unit": "Ω"}, {"name": "r3", "value": 5, "unit": "Ω"}, {"name": "voltage", "value": 20, "unit": "V"}],
        "unknown_variables": ["current"],
        "expected_answer": 2.0,
        "expected_unit": "A"
    },
    {
        "id": 13,
        "title": "Parallel Resistors",
        "description": "Two resistors (6 Ω and 3 Ω) are connected in parallel. What is the equivalent resistance?",
        "domain": "circuits",
        "difficulty": "medium",
        "known_variables": [{"name": "r1", "value": 6, "unit": "Ω"}, {"name": "r2", "value": 3, "unit": "Ω"}],
        "unknown_variables": ["equivalent_resistance"],
        "expected_answer": 2.0,
        "expected_unit": "Ω"
    },
    {
        "id": 14,
        "title": "Power Dissipation",
        "description": "A 10 Ω resistor carries a current of 2 A. What power is dissipated?",
        "domain": "circuits",
        "difficulty": "easy",
        "known_variables": [{"name": "resistance", "value": 10, "unit": "Ω"}, {"name": "current", "value": 2, "unit": "A"}],
        "unknown_variables": ["power"],
        "expected_answer": 40.0,
        "expected_unit": "W"
    },
    {
        "id": 15,
        "title": "Voltage Divider",
        "description": "In a voltage divider with R1=4kΩ and R2=6kΩ connected to 10V, what is the output voltage across R2?",
        "domain": "circuits",
        "difficulty": "medium",
        "known_variables": [{"name": "r1", "value": 4000, "unit": "Ω"}, {"name": "r2", "value": 6000, "unit": "Ω"}, {"name": "vin", "value": 10, "unit": "V"}],
        "unknown_variables": ["vout"],
        "expected_answer": 6.0,
        "expected_unit": "V"
    },
    {
        "id": 16,
        "title": "Kirchhoff's Current Law",
        "description": "At a junction, currents of 5 A and 3 A enter, while 4 A leaves through one branch. What current leaves through the other branch?",
        "domain": "circuits",
        "difficulty": "easy",
        "known_variables": [{"name": "i1_in", "value": 5, "unit": "A"}, {"name": "i2_in", "value": 3, "unit": "A"}, {"name": "i1_out", "value": 4, "unit": "A"}],
        "unknown_variables": ["i2_out"],
        "expected_answer": 4.0,
        "expected_unit": "A"
    },
    {
        "id": 17,
        "title": "Capacitor Charge",
        "description": "A 100 μF capacitor is charged to 25 V. What is the stored charge?",
        "domain": "circuits",
        "difficulty": "medium",
        "known_variables": [{"name": "capacitance", "value": 0.0001, "unit": "F"}, {"name": "voltage", "value": 25, "unit": "V"}],
        "unknown_variables": ["charge"],
        "expected_answer": 0.0025,
        "expected_unit": "C"
    },
    {
        "id": 18,
        "title": "RC Time Constant",
        "description": "An RC circuit has R=2kΩ and C=50μF. What is the time constant?",
        "domain": "circuits",
        "difficulty": "medium",
        "known_variables": [{"name": "resistance", "value": 2000, "unit": "Ω"}, {"name": "capacitance", "value": 0.00005, "unit": "F"}],
        "unknown_variables": ["time_constant"],
        "expected_answer": 0.1,
        "expected_unit": "s"
    },
    {
        "id": 19,
        "title": "Inductor Energy",
        "description": "A 0.5 H inductor carries a current of 4 A. What energy is stored?",
        "domain": "circuits",
        "difficulty": "medium",
        "known_variables": [{"name": "inductance", "value": 0.5, "unit": "H"}, {"name": "current", "value": 4, "unit": "A"}],
        "unknown_variables": ["energy"],
        "expected_answer": 4.0,
        "expected_unit": "J"
    },
    {
        "id": 20,
        "title": "AC RMS Voltage",
        "description": "An AC voltage has a peak value of 170 V. What is its RMS value?",
        "domain": "circuits",
        "difficulty": "medium",
        "known_variables": [{"name": "peak_voltage", "value": 170, "unit": "V"}],
        "unknown_variables": ["rms_voltage"],
        "expected_answer": 120.2,
        "expected_unit": "V"
    },
    {
        "id": 21,
        "title": "Basic Derivative",
        "description": "Find the derivative of f(x) = 3x² + 5x - 2",
        "domain": "calculus",
        "difficulty": "easy",
        "known_variables": [{"name": "function", "value": "3x^2 + 5x - 2", "unit": "N/A"}],
        "unknown_variables": ["derivative"],
        "expected_answer": None,
        "expected_unit": "N/A"
    },
    {
        "id": 22,
        "title": "Derivative at Point",
        "description": "Find the slope of f(x) = x³ - 2x at x = 2",
        "domain": "calculus",
        "difficulty": "medium",
        "known_variables": [{"name": "function", "value": "x^3 - 2x", "unit": "N/A"}, {"name": "x", "value": 2, "unit": "N/A"}],
        "unknown_variables": ["slope"],
        "expected_answer": 10.0,
        "expected_unit": "N/A"
    },
    {
        "id": 23,
        "title": "Basic Integral",
        "description": "Evaluate the definite integral of f(x) = 2x from x=0 to x=5",
        "domain": "calculus",
        "difficulty": "easy",
        "known_variables": [{"name": "function", "value": "2x", "unit": "N/A"}, {"name": "lower", "value": 0, "unit": "N/A"}, {"name": "upper", "value": 5, "unit": "N/A"}],
        "unknown_variables": ["integral"],
        "expected_answer": 25.0,
        "expected_unit": "N/A"
    },
    {
        "id": 24,
        "title": "Area Under Curve",
        "description": "Find the area under f(x) = x² from x=0 to x=3",
        "domain": "calculus",
        "difficulty": "medium",
        "known_variables": [{"name": "function", "value": "x^2", "unit": "N/A"}, {"name": "lower", "value": 0, "unit": "N/A"}, {"name": "upper", "value": 3, "unit": "N/A"}],
        "unknown_variables": ["area"],
        "expected_answer": 9.0,
        "expected_unit": "N/A"
    },
    {
        "id": 25,
        "title": "Optimization Problem",
        "description": "Find the maximum value of f(x) = -x² + 6x - 5",
        "domain": "calculus",
        "difficulty": "medium",
        "known_variables": [{"name": "function", "value": "-x^2 + 6x - 5", "unit": "N/A"}],
        "unknown_variables": ["maximum_value"],
        "expected_answer": 4.0,
        "expected_unit": "N/A"
    },
    {
        "id": 26,
        "title": "Related Rates",
        "description": "A circle's radius increases at 2 cm/s. When r=5 cm, how fast is the area increasing?",
        "domain": "calculus",
        "difficulty": "hard",
        "known_variables": [{"name": "dr_dt", "value": 2, "unit": "cm/s"}, {"name": "radius", "value": 5, "unit": "cm"}],
        "unknown_variables": ["dA_dt"],
        "expected_answer": 62.83,
        "expected_unit": "cm²/s"
    },
    {
        "id": 27,
        "title": "Linear Equation",
        "description": "Solve for x: 3x + 7 = 22",
        "domain": "algebra",
        "difficulty": "easy",
        "known_variables": [{"name": "a", "value": 3, "unit": "N/A"}, {"name": "b", "value": 7, "unit": "N/A"}, {"name": "c", "value": 22, "unit": "N/A"}],
        "unknown_variables": ["x"],
        "expected_answer": 5.0,
        "expected_unit": "N/A"
    },
    {
        "id": 28,
        "title": "Quadratic Equation",
        "description": "Solve: x² - 5x + 6 = 0",
        "domain": "algebra",
        "difficulty": "medium",
        "known_variables": [{"name": "a", "value": 1, "unit": "N/A"}, {"name": "b", "value": -5, "unit": "N/A"}, {"name": "c", "value": 6, "unit": "N/A"}],
        "unknown_variables": ["x1", "x2"],
        "expected_answer": 3.0,
        "expected_unit": "N/A"
    },
    {
        "id": 29,
        "title": "System of Equations",
        "description": "Solve: 2x + y = 7 and x - y = 2",
        "domain": "algebra",
        "difficulty": "medium",
        "known_variables": [{"name": "eq1", "value": "2x + y = 7", "unit": "N/A"}, {"name": "eq2", "value": "x - y = 2", "unit": "N/A"}],
        "unknown_variables": ["x", "y"],
        "expected_answer": 3.0,
        "expected_unit": "N/A"
    },
    {
        "id": 30,
        "title": "Exponential Equation",
        "description": "Solve: 2^x = 32",
        "domain": "algebra",
        "difficulty": "easy",
        "known_variables": [{"name": "base", "value": 2, "unit": "N/A"}, {"name": "result", "value": 32, "unit": "N/A"}],
        "unknown_variables": ["x"],
        "expected_answer": 5.0,
        "expected_unit": "N/A"
    },
    {
        "id": 31,
        "title": "Logarithm",
        "description": "Evaluate: log₂(64)",
        "domain": "algebra",
        "difficulty": "easy",
        "known_variables": [{"name": "base", "value": 2, "unit": "N/A"}, {"name": "argument", "value": 64, "unit": "N/A"}],
        "unknown_variables": ["result"],
        "expected_answer": 6.0,
        "expected_unit": "N/A"
    },
    {
        "id": 32,
        "title": "Polynomial Division",
        "description": "Divide (x³ + 2x² - 5x + 3) by (x - 1). What is the remainder?",
        "domain": "algebra",
        "difficulty": "hard",
        "known_variables": [{"name": "dividend", "value": "x^3 + 2x^2 - 5x + 3", "unit": "N/A"}, {"name": "divisor", "value": "x - 1", "unit": "N/A"}],
        "unknown_variables": ["remainder"],
        "expected_answer": 1.0,
        "expected_unit": "N/A"
    }
]


def get_problems_by_domain(domain: str = None, difficulty: str = None):
    filtered = ENGINEERING_PROBLEMS

    if domain:
        filtered = [p for p in filtered if p["domain"] == domain]

    if difficulty:
        filtered = [p for p in filtered if p["difficulty"] == difficulty]

    return filtered


def get_problem_by_id(problem_id: int):
    for problem in ENGINEERING_PROBLEMS:
        if problem["id"] == problem_id:
            return problem
    return None
