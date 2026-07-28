import React, { useState } from 'react';
import { uploadFile, getSampleData } from '../api';
import { Upload, Database, CheckCircle } from 'lucide-react';

export default function DataUpload({ onDataLoaded }) {
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const res = await uploadFile(file);
      setStatus(`✓ Loaded ${res.data.rows} rows, ${res.data.columns.length} columns`);
      onDataLoaded && onDataLoaded(res.data);
    } catch {
      setStatus('Error uploading file');
    }
    setLoading(false);
  };

  const loadSample = async () => {
    setLoading(true);
    try {
      const res = await getSampleData();
      setStatus(`✓ Sample data loaded: ${res.data.data.length} rows`);
      onDataLoaded && onDataLoaded(res.data);
    } catch {
      setStatus('Error loading sample data');
    }
    setLoading(false);
  };

  return (
    <div style={{ background: '#1e293b', borderRadius: 12, padding: 20, border: '1px solid #334155', marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <Database size={18} color="#6366f1" />
        <span style={{ fontWeight: 600 }}>Data Source</span>
        {status && <span style={{ marginLeft: 'auto', fontSize: 12, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 4 }}><CheckCircle size={12} />{status}</span>}
      </div>
      <div style={{ display: 'flex', gap: 12 }}>
        <label style={{ flex: 1, border: '2px dashed #334155', borderRadius: 8, padding: '14px', textAlign: 'center', cursor: 'pointer', color: '#64748b', fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Upload size={16} />
          {loading ? 'Loading...' : 'Upload CSV / Excel'}
          <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} style={{ display: 'none' }} />
        </label>
        <button onClick={loadSample} disabled={loading} style={{ flex: 1, background: '#6366f1', border: 'none', borderRadius: 8, padding: 14, color: 'white', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
          Load Sample Data
        </button>
      </div>
    </div>
  );
}
