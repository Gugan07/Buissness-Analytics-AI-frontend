import React, { useState, useEffect } from 'react';
import { getMetrics } from '../api';
import { TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Target } from 'lucide-react';

const iconMap = { revenue: DollarSign, profit: Target, units_sold: ShoppingCart, new_customers: Users };
const fmt = (v) => v >= 1000 ? `${(v / 1000).toFixed(1)}K` : v?.toFixed(1);

export default function KPICards() {
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    getMetrics().then(r => setMetrics(r.data.metrics)).catch(() => {});
  }, []);

  const keys = ['revenue', 'profit', 'units_sold', 'new_customers'];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
      {keys.map(k => {
        const m = metrics[k];
        const Icon = iconMap[k] || Target;
        const up = m?.trend === 'up';
        return (
          <div key={k} style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <span style={{ color: '#94a3b8', fontSize: 13, textTransform: 'capitalize' }}>{k.replace(/_/g, ' ')}</span>
              <Icon size={18} color="#6366f1" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, color: '#f1f5f9' }}>{m ? fmt(m.total) : '—'}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8, fontSize: 12 }}>
              {up ? <TrendingUp size={14} color="#22c55e" /> : <TrendingDown size={14} color="#ef4444" />}
              <span style={{ color: up ? '#22c55e' : '#ef4444' }}>{up ? 'Trending Up' : 'Trending Down'}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
