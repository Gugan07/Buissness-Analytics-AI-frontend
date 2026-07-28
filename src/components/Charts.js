import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { getMetrics } from '../api';

export default function Charts() {
  const [data, setData] = useState([]);

  useEffect(() => {
    getMetrics().then(r => setData(r.data.data || [])).catch(() => {});
  }, []);

  const chartData = data.map(d => ({
    name: d.month || d.date || '',
    Revenue: d.revenue,
    Profit: d.profit,
    Units: d.units_sold,
    Customers: d.new_customers,
    Marketing: d.marketing_spend,
  }));

  const card = { background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155', marginBottom: 20 };
  const title = { color: '#94a3b8', fontSize: 14, marginBottom: 16 };

  return (
    <div>
      <div style={card}>
        <div style={title}>Revenue & Profit Trend</div>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="prof" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
            <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
            <Legend />
            <Area type="monotone" dataKey="Revenue" stroke="#6366f1" fill="url(#rev)" strokeWidth={2} />
            <Area type="monotone" dataKey="Profit" stroke="#22c55e" fill="url(#prof)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={card}>
          <div style={title}>Units Sold & New Customers</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend />
              <Bar dataKey="Units" fill="#6366f1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Customers" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div style={card}>
          <div style={title}>Marketing Spend vs Revenue</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 10 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 8 }} />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="Marketing" stroke="#ef4444" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
