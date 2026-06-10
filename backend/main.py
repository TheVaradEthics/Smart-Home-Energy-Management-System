import asyncio
import csv
import math
import os
import random
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Initialize FastAPI App
app = FastAPI(
    title="Smart Home Energy Monitoring System API",
    description="Backend engine simulating sensor data, calculations, alerts, and time-series logging.",
    version="1.0.0"
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants & Configurations
CSV_FILE_PATH = "data/energy_log.csv"
VOLTAGE_NOMINAL = 230.0  # Indian/Euro Standard Mains Voltage (Volts)
ALERT_THRESHOLD_WATTS = 3000.0  # High consumption threshold (Watts)
ELECTRICITY_RATE_PER_KWH = 7.50  # Tariff rate (e.g., ₹7.50 or $0.15 per kWh)

# Create data directory if it doesn't exist
os.makedirs("data", exist_ok=True)

# Initialize CSV Log file with tracking headers if file doesn't exist
if not os.path.exists(CSV_FILE_PATH):
    with open(CSV_FILE_PATH, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Timestamp", "Voltage_V", "Current_A", "Power_W", "Energy_kWh", "Cost", "Alert_Status"])

# Global System State
system_state = {
    "timestamp": datetime.now().isoformat(),
    "voltage": VOLTAGE_NOMINAL,
    "current": 0.0,
    "power": 0.0,
    "energy_kwh": 0.0,
    "cost": 0.0,
    "alert_status": "NORMAL"
}

# Active WebSocket connections list
active_connections = []

class SystemSettings(BaseModel):
    alert_threshold: float
    electricity_rate: float

@app.on_event("startup")
async def startup_event():
    """Triggers the virtual sensor simulation task loop on startup."""
    asyncio.create_task(sensor_simulation_engine())

async def sensor_simulation_engine():
    """
    Simulates real-time edge hardware collection loops.
    Computes RMS Current, True/Apparent Power, Cumulative Energy usage, and Costs.
    Logs parameters to CSV and broadcasts data points via WebSockets.
    """
    global system_state
    last_time = datetime.now()
    
    while True:
        try:
            now = datetime.now()
            time_delta_hours = (now - last_time).total_seconds() / 3600.0
            last_time = now

            # 1. Simulate Hardware Signal Dynamics (Simulating random active home appliances)
            # Baseline background draw (fridge, router, standby units)
            base_current = random.uniform(1.2, 2.5) 
            
            # Simulate high-load cycling appliances (A/C, Geyser, Microwave) turning on/off
            hour = now.hour
            if 18 <= hour <= 23:  # Peak evening usage scenario
                appliance_load = random.choice([0.0, 8.5, 12.0, 15.4])
            else:
                appliance_load = random.choice([0.0, 0.0, 4.2, 1.1])
                
            simulated_current = base_current + appliance_load
            
            # Minor nominal voltage grid fluctuations (+/- 4 Volts)
            simulated_voltage = VOLTAGE_NOMINAL + random.uniform(-4.0, 4.0)

            # 2. Compute Mathematical Metrics
            # Power (W) = Voltage (V) * Current (A)
            calculated_power = simulated_voltage * simulated_current
            
            # Energy Consumption (kWh) = (Power in kW) * Time in Hours
            energy_gain = (calculated_power / 1000.0) * time_delta_hours
            system_state["energy_kwh"] += energy_gain
            
            # Cost Calculation = Total Energy Used * Unit Tariff Rate
            system_state["cost"] = system_state["energy_kwh"] * ELECTRICITY_RATE_PER_KWH

            # Update remaining state values
            system_state["timestamp"] = now.strftime("%Y-%m-%d %H:%M:%S")
            system_state["voltage"] = round(simulated_voltage, 2)
            system_state["current"] = round(simulated_current, 3)
            system_state["power"] = round(calculated_power, 2)
            
            # 3. Threshold Check Engine
            if calculated_power > ALERT_THRESHOLD_WATTS:
                system_state["alert_status"] = "OVERLOAD_WARNING"
            else:
                system_state["alert_status"] = "NORMAL"

            # 4. Persistence Tier: Time-series CSV Logging
            with open(CSV_FILE_PATH, mode='a', newline='') as file:
                writer = csv.writer(file)
                writer.writerow([
                    system_state["timestamp"],
                    system_state["voltage"],
                    system_state["current"],
                    system_state["power"],
                    round(system_state["energy_kwh"], 4),
                    round(system_state["cost"], 2),
                    system_state["alert_status"]
                ])

            # 5. Network Broadcast: Stream live parameters to UI clients
            await broadcast_telemetry(system_state)

        except Exception as e:
            print(f"Error in backend simulation loop: {e}")
            
        # Sampling interval frequency matching industrial refresh loops (1 Hz)
        await asyncio.sleep(1.0)

async def broadcast_telemetry(data: dict):
    """Broadcasts current state metrics payload to all active UI dashboard nodes."""
    for connection in active_connections:
        try:
            await connection.send_json(data)
        except Exception:
            active_connections.remove(connection)

@app.get("/api/telemetry")
async def get_current_telemetry():
    """REST endpoint exposing the current snapshot metrics of the system."""
    return system_state

@app.post("/api/settings")
async def update_system_settings(settings: SystemSettings):
    """Allows administrators to dynamically reconfigure threshold boundaries."""
    global ALERT_THRESHOLD_WATTS, ELECTRICITY_RATE_PER_KWH
    ALERT_THRESHOLD_WATTS = settings.alert_threshold
    ELECTRICITY_RATE_PER_KWH = settings.electricity_rate
    return {"message": "Configuration successfully deployed to runtime registry."}

@app.websocket("/ws/telemetry")

async def websocket_telemetry_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    # 🌟 ADD THIS TEMPORARY DEBUG LINE HERE:
    print("🚀 TARGET ACQUIRED: Frontend has successfully connected to the WebSocket engine!")
    
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        print("❌ Client disconnected.")
        active_connections.remove(websocket)