```markdown
# 🏠 Smart Home Energy Monitoring System

[cite_start]An industry-oriented, full-stack IoT portfolio project that provides real-time visibility into domestic and commercial electrical consumption[cite: 11, 27, 298]. [cite_start]This system combines a high-performance **Python (FastAPI) back-end telemetry engine** with an interactive **React (Vite + Tailwind CSS + Recharts) dashboard** to measure, calculate, log, and visualize electrical consumption metrics dynamically [cite: 4, 183-190, 226].

---

## 📑 Table of Contents
1. [Overview & Problem Statement](#1-overview--problem-statement)
2. [Folder Structure](#2-folder-structure)
3. [Components / Tech Stack](#3-components--tech-stack)
4. [System Architecture](#4-system-architecture)
5. [Key Features](#5-key-features)
6. [Setup & Execution Steps](#6-setup--execution-steps)
7. [Sample Output](#7-sample-output)
8. [Future Improvements](#8-future-improvements)
9. [Learning Outcomes](#9-learning-outcomes)

---

## 1. 🎯 Overview & Problem Statement

### The Problem
[cite_start]Modern households, hostels, and small facilities lack real-time visibility into where their electrical utility spending goes[cite: 298]. [cite_start]Hidden "phantom/standby loads" (appliances consuming power even when idle) and unmonitored heavy machinery cause significant energy waste and inflated utility bills[cite: 467, 521]. [cite_start]Traditional utility meters only provide a retrospective monthly bill, making it impossible to diagnose consumption anomalies proactively[cite: 433, 521].

### The Solution
[cite_start]This project implements a modular, low-cost, and non-invasive energy monitoring system[cite: 302]. [cite_start]The core computing edge reads analog data points (simulating physical hardware like an ESP32 and an ACS712 Hall-effect current sensor), applies real-time mathematical root-mean-square (RMS) tracking algorithms, detects overload thresholds, logs time-series historical data, and streams low-latency data pipelines over WebSockets directly to a responsive UI web dashboard [cite: 73, 74, 105-115, 183-190, 226, 326].

---

## 2. 📂 Folder Structure

[cite_start]The repository is organized following professional, clean separation of concerns guidelines to facilitate easy maintenance and rapid scalability[cite: 146, 303]:

```text
Smart-Home-Energy-Monitoring-System/
[cite_start]├── backend/                  # Python FastAPI high-performance web service [cite: 152]
[cite_start]│   ├── data/                 # Time-series persistent database engine [cite: 154]
[cite_start]│   │   └── energy_log.csv    # Local structured records storage [cite: 243]
[cite_start]│   ├── main.py               # Application engine and simulation event loops [cite: 162]
[cite_start]│   └── requirements.txt      # Backend Python dependencies [cite: 161]
[cite_start]├── frontend/                 # Modern React single-page application dashboard [cite: 153]
│   ├── src/
│   │   ├── App.jsx           # Core layout component, charting, and WebSocket pipeline
│   │   ├── index.css         # Global native Tailwind styling directives
│   │   └── main.jsx          # React DOM mounting entry point
│   ├── index.html            # Core HTML template shell
│   ├── package.json          # Node dependency manifests and environment scripts
│   └── tailwind.config.js    # Tailwind layout compile configurations
├── .gitignore                # Production tracking exclusion rules
[cite_start]└── README.md                 # Project verification documentation [cite: 160]

```

---

## 3. 🛠️ Components / Tech Stack

This project supports dual-mode implementation tracks: hardware deployment for physical setups and virtual software simulation for immediate environment testing without hardware dependencies .

### 💻 Software Architecture

* **Backend Framework:** `FastAPI` (Python) - Handles concurrent execution loops and low-overhead HTTP REST endpoints.
* 
**Data Pipeline:** `WebSockets` - Full-duplex protocol streaming updates directly to clients at 1 Hz intervals .


* 
**Database Tier:** Local `CSV` time-series ingestion engine modeling sequential telemetry updates.


* **Frontend Library:** `React.js` (with Vite bundling engine for sub-millisecond hot module reloading).
* **Styling Engine:** `Tailwind CSS` - Utility-first layout compilation.
* **Data Visualization:** `Recharts` - Declarative vector graphics mapping real-time appliance usage curves.

### 🔌 Hardware Counterpart Architecture (Optional)

If deploying onto bare metal, the application maps perfectly to the following hardware specifications:

* 
**Microcontroller:** `ESP32-DevKitC` (Built-in 2.4GHz Wi-Fi and multiple analog-to-digital converter channels).


* 
**Current Sensing:** `ACS712` (Hall-effect 20A/30A sensor) or `SCT-013-050` non-invasive split-core CT clamp.


* 
**Voltage Sensing:** `ZMPT101B` AC Voltage transformer module or `PZEM-004T v3` true-power UART module.



---

## 4. 🔀 System Architecture

The technical workflow isolates data sourcing from data rendering, simulating real industrial SCADA system designs :

```text
  [ PHYSICAL SENSORS ]  -->  [ ESP32 EDGE NODE ]  --┐
         - OR -                                      ├──> [ WebSockets / MQTT ]
  [ SIMULATION ENGINE ] -->  [ FastAPI BACKEND ]  --┘           │
                                                                 ▼
  [ DASHBOARD UI ]      <--  [ Recharts Engine ]  <─── [ JSON Data Streams ]
         │
         ▼
  [ ALERT MODULE ]      -->  [ Trigger UI Red Alert / Breaker Cut-off Simulation ]
         │
         ▼
  [ LOGGING TIERS ]     -->  [ Local Time-Series CSV Append Registry ]

```

---

## 5. ✨ Key Features

* 
**Real-Time Data Streaming:** Full-duplex WebSocket connection updating critical parameters every 1 second without browser polling overhead .


* 
**Precise Mathematical Analytics Engine:** Computes electrical parameters in real time :


* 
*Active Power Calculation:* $Power (W) = Voltage (V) \times Current (A)$ 


* 
*Cumulative Energy Accrual:* $Energy (kWh) = \sum \left(\frac{Power (kW) \times \Delta t (s)}{3600}\right)$ 


* *Dynamic Cost Scaling:* $Cost = Energy (kWh) \times Base Tariff Rate$


* 
**Intelligent Breaker Alert System:** Monitors active consumption and triggers immediate warning indicators if current draw exceeds a safe power threshold.


* 
**Time-Series Data Ingestion:** Automates file-append processes to log runtime data parameters into local persistent CSV sheets for historical audits.



---

## 6. 🚀 Setup & Execution Steps

Follow these exact terminal steps to configure and run the full-stack system locally:

### Prerequisites

* Python 3.8+ installed on your machine.
* Node.js (v18 or higher) and npm installed.

### Step 1: Clone the Repository

```bash
git clone [https://github.com/YOUR_USERNAME/Smart-Home-Energy-Monitoring-System.git](https://github.com/YOUR_USERNAME/Smart-Home-Energy-Monitoring-System.git)
cd Smart-Home-Energy-Monitoring-System

```

### Step 2: Initialize & Launch the Backend Engine

Open a new terminal window at the root folder:

```bash
# Navigate to backend directory
cd backend

# Create a clean virtual isolated environment
python -m venv venv

# Activate the environment (Windows)
venv\Scripts\activate
# Activate the environment (Mac/Linux)
source venv/bin/activate

# Install exact dependency manifest libraries
pip install -r requirements.txt

# Boot the ASGI Uvicorn web server explicitly bound to IPv4
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000

```

Verify that the output displays: `INFO: Uvicorn running on http://127.0.0.1:8000`

### Step 3: Initialize & Launch the Frontend UI Dashboard

Open a **second, separate terminal window** at the root folder:

```bash
# Navigate to frontend dashboard directory
cd frontend

# Install clean project node module dependencies
npm install

# Fire up the local Vite engine environment compiler tool
npm run dev

```

Open your browser and navigate to the address provided by Vite (typically `http://localhost:5173`).

---

## 7. 📊 Sample Output

### Real-Time Live JSON Telemetry Payload

The backend broadcasts data packages over the open WebSocket connection using this structured JSON schema :

```json
{
  "timestamp": "2026-06-10 16:30:45",
  "voltage": 232.45,
  "current": 4.12,
  "power": 957.69,
  "energy_kwh": 0.1245,
  "cost": 0.93,
  "alert_status": "NORMAL"
}

```

### Time-Series Local Log File View (`data/energy_log.csv`)

Data entries are continuously appended locally every second to support historical energy profile reviews:

```csv
Timestamp,Voltage_V,Current_A,Power_W,Energy_kWh,Cost,Alert_Status
2026-06-10 16:30:45,232.45,4.12,957.69,0.1245,0.93,NORMAL
2026-06-10 16:30:46,229.12,14.85,3402.43,0.1254,0.94,OVERLOAD_WARNING

```

---

## 8. 🔮 Future Improvements

* 
**Multi-Circuit Core Scaling:** Add an external `ADS1115` 16-bit high-resolution I2C ADC converter to track 4 isolated current clamp wire nodes simultaneously .


* 
**True Power Factor Integration:** Transition calculations from apparent volt-amperes to true active power metrics using dedicated hardware couplers like the `PZEM-004T` module .


* 
**Industrial IoT Broker Ingestion:** Integrate a dedicated local `Eclipse Mosquitto` MQTT publisher container with a structured `InfluxDB` time-series engine.


* 
**Predictive AI Load Analytics:** Apply local machine learning models (such as Linear Regression or LSTM) to predict future energy costs based on historical consumption trends.



---

## 9. 🧠 Learning Outcomes

* **Full-Stack Pipeline Integration:** Mastered linking a fast-executing asynchronous Python backend service directly to a dynamic, visual React user interface framework.
* **Low-Latency Stream Architecture:** Avoided typical server-polling overhead bottlenecks by building standard full-duplex WebSocket connections for immediate UI data refreshes.
* **Mathematical Telemetry Tracking:** Learned how to transform raw, noisy analog signals into accurate physical electricity metrics using discrete accumulation integration principles over time.
* 
**Production Code Governance:** Gained practical experience in setting up defensive code routines, configuring precise `.gitignore` files, and structuring real-time web services to mimic industrial SCADA platforms.



```

```