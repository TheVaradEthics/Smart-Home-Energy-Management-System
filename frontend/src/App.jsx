import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { Activity, Zap, ShieldAlert, DollarSign, Gauge, Cpu } from 'lucide-react';

export default function App() {
  const [telemetry, setTelemetry] = useState({
    timestamp: '--',
    voltage: 0,
    current: 0,
    power: 0,
    energy_kwh: 0,
    cost: 0,
    alert_status: 'NORMAL'
  });
  const [history, setHistory] = useState([]);

useEffect(() => {
  let ws = null;
  let reconnectTimeout = null;
  let isComponentMounted = true;

  const connectTelemetryStream = () => {
    if (!isComponentMounted) return;

    console.log("🔌 Attempting WebSocket handshake pipeline to edge engine...");
    ws = new WebSocket('ws://127.0.0.1:8000/ws/telemetry');

    ws.onopen = () => {
      console.log("✅ WebSocket pipeline successfully locked and synchronized!");
    };

    ws.onmessage = (event) => {
      if (!isComponentMounted) return;
      const data = JSON.parse(event.data);
      setTelemetry(data);
      
      // Update rolling chart history layout data points
      setHistory(prev => {
        const updated = [...prev, { time: data.timestamp.split(' ')[1], power: data.power }];
        if (updated.length >= 15) updated.shift();
        return updated;
      });
    };

    ws.onerror = (err) => {
      console.error("❌ WebSocket pipeline error encountered:", err);
    };

    ws.onclose = (event) => {
      if (!isComponentMounted) return;
      // Reconnect immediately if closed unexpectedly, unless clean unmount occurred
      console.warn("⚠️ Telemetry link severed. Retrying connection loop in 3 seconds...", event.reason);
      reconnectTimeout = setTimeout(connectTelemetryStream, 3000);
    };
  };

  // Trigger initial network loop initialization
  connectTelemetryStream();

  // Component unmount cleanup function
  return () => {
    isComponentMounted = false;
    clearTimeout(reconnectTimeout);
    if (ws) {
      // Only close if socket finished connecting, avoiding the "closed before established" error
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    }
  };
}, []);

  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 p-6">
      {/* HEADER SECTION */}
      <header className="flex justify-between items-center border-b border-gray-800 pb-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
            <Cpu className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Smart Home Energy Management Hub</h1>
            <p className="text-sm text-gray-400">Industry Proof of Work • Real-Time Edge Telemetry Node</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Active Engine Clock</p>
          <p className="text-sm font-mono text-gray-300">{telemetry.timestamp}</p>
        </div>
      </header>

      {/* EMERGENCY SAFETY BREAKER TIER STATUS */}
      {telemetry.alert_status === 'OVERLOAD_WARNING' && (
        <div className="mb-6 p-4 bg-red-950/40 border border-red-500/40 text-red-200 rounded-xl flex items-center gap-3 animate-bounce">
          <ShieldAlert className="w-6 h-6 text-red-400 shrink-0" />
          <div>
            <span className="font-bold uppercase tracking-wider text-sm mr-2">[CRITICAL OVERLOAD]:</span>
            Current aggregate appliance draw has crossed your configured safe threshold parameters!
          </div>
        </div>
      )}

      {/* LIVE METRICS DATA METERS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-8">
        {/* VOLTAGE */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm transition hover:border-gray-700">
          <div className="flex justify-between items-start text-gray-400 mb-3">
            <span className="text-sm font-medium">RMS Voltage</span>
            <Gauge className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-cyan-400 font-mono">{telemetry.voltage} <span className="text-sm font-normal text-gray-500">V</span></div>
          <p className="text-xs text-gray-500 mt-1">Grid Compliance Standard</p>
        </div>

        {/* CURRENT */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm transition hover:border-gray-700">
          <div className="flex justify-between items-start text-gray-400 mb-3">
            <span className="text-sm font-medium">RMS Current</span>
            <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-indigo-400 font-mono">{telemetry.current} <span className="text-sm font-normal text-gray-500">A</span></div>
          <p className="text-xs text-gray-500 mt-1">ACS712 Sensor Yield</p>
        </div>

        {/* POWER */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm transition hover:border-gray-700">
          <div className="flex justify-between items-start text-gray-400 mb-3">
            <span className="text-sm font-medium">Active Power</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-400 font-mono">{telemetry.power} <span className="text-sm font-normal text-gray-500">W</span></div>
          <p className="text-xs text-gray-500 mt-1">Real-time Load Apparent</p>
        </div>

        {/* TOTAL ENERGY CONSUMPTION */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm transition hover:border-gray-700">
          <div className="flex justify-between items-start text-gray-400 mb-3">
            <span className="text-sm font-medium">Cumulative Energy</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-emerald-400 font-mono">{telemetry.energy_kwh.toFixed(4)} <span className="text-sm font-normal text-gray-500">kWh</span></div>
          <p className="text-xs text-gray-500 mt-1">Integration Time Registry</p>
        </div>

        {/* FINANCIAL TRACKER ACCRUED TAB */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 shadow-sm transition hover:border-gray-700">
          <div className="flex justify-between items-start text-gray-400 mb-3">
            <span className="text-sm font-medium">Estimated Cost</span>
            <DollarSign className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold tracking-tight text-rose-400 font-mono">₹{telemetry.cost.toFixed(2)}</div>
          <p className="text-xs text-gray-500 mt-1">Tariff Calculations Baseline</p>
        </div>
      </div>

      {/* TIME SERIES OSCILLOSCOPE TIME GRAPH */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-lg font-semibold tracking-tight">Active Load Profile Ingestion Graph</h3>
          <p className="text-xs text-gray-400">Visualizing high-resolution rolling power profiles mapped via virtual edge simulation intervals.</p>
        </div>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
              <XAxis dataKey="time" stroke="#6b7280" style={{ fontSize: '12px', fontFamily: 'monospace' }} />
              <YAxis stroke="#6b7280" style={{ fontSize: '12px', fontFamily: 'monospace' }} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#111827', borderColor: '#374151', borderRadius: '12px', color: '#f3f4f6' }}
                itemStyle={{ color: '#f59e0b' }}
              />
              <Area type="monotone" dataKey="power" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#powerGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}