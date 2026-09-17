# Hospital-Redistribution-System
Predictive Healthcare Supply Chain Dashboard
Built for Manipal Hackathon 2026

A predictive, simulation-driven dashboard designed to predict, visualize, and mitigate critical healthcare supply chain collapses. Engineered to solve the "cold start" problem of restricted medical telemetry, this system generates a rigorous probabilistic mathematical environment to simulate 15-day inventory depletion and dynamic logistics rerouting across a regional hospital network.

🏗️ Architecture & Tech Stack

This project utilizes a strictly decoupled architecture, allowing the frontend visualization to operate independently of the backend data generation engine.

Frontend (User Interface & Visualization)
React.js: Single Page Application (SPA) providing a highly responsive command-center interface.

Tailwind CSS: Custom dark-mode styling for high-contrast data legibility.

Recharts: Renders complex analytics, including multi-axis time-series trajectories and inventory distribution charts.

React-Leaflet: OpenStreetMap integration with custom CSS inversion filters for a watermark-free, dark-mode topological map.

Backend (Simulation & Algorithmic Engine)
Python: Core simulation engine.

NumPy & Pandas: Powers the heavy mathematical lifting, matrix generation, and variance statistics without relying on pre-built black-box machine learning libraries.

✨ Core Features

Probabilistic Inventory Forecasting: Utilizes normal distribution variance to model daily supply depletion. It projects a 15-day trajectory, actively calculating Day-7 critical stockouts to trigger preemptive dashboard alerts.

Heuristic Routing & Logistics: Calculates optimal redistribution vectors using base Open Source Routing Machine (OSRM) matrices injected with randomized traffic delay multipliers.

Strict Cold-Chain Validation: Autonomously validates or rejects emergency delivery vectors by comparing predicted actual transit times against rigid thermal limits (e.g., automatically terminating an O-Negative Blood dispatch if traffic pushes it past its 60-minute viability window).

"Time Engine" Scrubber: A custom global state controller that iterates through the backend's stateful JSON array, driving synchronized animations across the map, routing terminal, and forecast charts.

🚀 How to Run the Project:

Prerequisites:

Ensure you have the following installed on your system:

Node.js (v16 or higher)

Python (3.8 or higher)

npm or yarn

Step 1: Run the Backend Engine

The backend engine must be executed first to generate the synthetic mathematical simulation and build the JSON dataset required by the frontend.

Open your terminal and navigate to the project's root directory.

Install the required Python data science libraries:

Bash

pip install pandas numpy

Execute the simulation engine:

Bash

python core_engine.py

Note: This will successfully generate a 15-day simulated timeline and output it directly to src/data/liveDashboardData.json.

Step 2: Launch the Frontend Dashboard

Once the backend has generated the required data array, you can launch the React interface.

Open a new terminal instance in the project's root directory.

Install the required Node dependencies:

Bash

npm install

Start the development server:

Bash

npm run dev

Open your browser and navigate to http://localhost:3000 (or the port provided in your terminal).

