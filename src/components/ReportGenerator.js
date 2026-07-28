import React, { useState } from 'react';
import { generateReport } from '../api';
import { FileText, Loader, ChevronDown, ChevronUp } from 'lucide-react';

const Section = ({ title, items, color }) => {
  const [open, setOpen] = useState(true);
  if (!items?.length) return null;
  return (
    <div style={{ marginBottom: 16, background: '#0f172a', borderRadius: 8, border: '1px solid #334155', overflow: 'hidden' }}>
      <div onClick={() => setOpen(!open)} style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', borderBottom: open ? '1px solid #334155' : 'none' }}>
        <span style={{ color, fontWeight: 600, fontSize: 14 }}>{title}</span>
        {open ? <ChevronUp size={16} color="#64748b" /> : <ChevronDown size={16} color="#64748b" />}
      </div>
      {open && (
        <ul style={{ padding: '12px 16px 12px 32px', margin: 0 }}>
          {items.map((item, i) => (
            <li key={i} style={{ fontSize: 13, color: '#cbd5e1', marginBottom: 6, lineHeight: 1.5 }}>
              {typeof item === 'object' ? `[${item.priority}] ${item.action} — ${item.timeline}` : item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default function ReportGenerator() {
  const [query, setQuery] = useState('');
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const presets = [
    'Generate Q4 performance report',
    'Analyze revenue trends and forecast next quarter',
    'Identify top risks and growth opportunities',
    'Create executive summary with KPIs',
  ];

  const generate = async (q) => {
    const text = q || query;
    if (!text.trim()) return;
    setLoading(true);
    setReport(null);
    try {
      const res = await generateReport(text);
      setReport(res.data);
    } catch {
      setReport({ executive_summary: 'Error generating report. Please check backend connection.' });
    }
    setLoading(false);
  };

  return (
    <div>
      <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <FileText size={18} color="#6366f1" />
          <span style={{ fontWeight: 600 }}>Management Report Generator</span>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && generate()}
            placeholder="Describe the report you need..."
            style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
          />
          <button onClick={() => generate()} disabled={loading} style={{ background: '#6366f1', border: 'none', borderRadius: 8, padding: '10px 20px', color: 'white', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
            {loading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <FileText size={16} />}
            Generate
          </button>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {presets.map((p, i) => (
            <button key={i} onClick={() => { setQuery(p); generate(p); }} style={{ background: '#0f172a', border: '1px solid #334155', borderRadius: 20, padding: '4px 12px', color: '#94a3b8', fontSize: 12, cursor: 'pointer' }}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: '#64748b' }}>
          <Loader size={32} color="#6366f1" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
          <p>Generating report...</p>
        </div>
      )}

      {report && !loading && (
        <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155' }}>
          {report.executive_summary && (
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, marginBottom: 16, borderLeft: '3px solid #6366f1' }}>
              <div style={{ color: '#6366f1', fontWeight: 600, marginBottom: 8, fontSize: 14 }}>Executive Summary</div>
              <p style={{ color: '#cbd5e1', fontSize: 13, lineHeight: 1.6 }}>{report.executive_summary}</p>
            </div>
          )}
          <Section title="Key Findings" items={report.key_findings} color="#22c55e" />
          <Section title="Insights" items={report.insights} color="#6366f1" />
          <Section title="Trends" items={report.trends} color="#f59e0b" />
          <Section title="Predictions" items={report.predictions} color="#06b6d4" />
          <Section title="Risk Factors" items={report.risk_factors} color="#ef4444" />
          <Section title="Opportunities" items={report.opportunities} color="#22c55e" />
          <Section title="Recommendations" items={report.recommendations} color="#a855f7" />
          <Section title="Action Items" items={report.action_items} color="#f59e0b" />
          {report.kpis && (
            <div style={{ background: '#0f172a', borderRadius: 8, padding: 16, border: '1px solid #334155' }}>
              <div style={{ color: '#94a3b8', fontWeight: 600, marginBottom: 12, fontSize: 14 }}>KPIs</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 10 }}>
                {Object.entries(report.kpis).map(([k, v]) => (
                  <div key={k} style={{ background: '#1e293b', borderRadius: 6, padding: 10 }}>
                    <div style={{ color: '#64748b', fontSize: 11, textTransform: 'capitalize', marginBottom: 4 }}>{k.replace(/_/g, ' ')}</div>
                    <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 14 }}>{typeof v === 'object' ? JSON.stringify(v) : String(v)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
