import React, { useState } from 'react';
import { BarChart2, MessageSquare, FileText, Menu, X } from 'lucide-react';
import KPICards from './components/KPICards';
import Charts from './components/Charts';
import ChatAgent from './components/ChatAgent';
import ReportGenerator from './components/ReportGenerator';
import DataUpload from './components/DataUpload';
import './App.css';

const tabs = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
  { id: 'chat', label: 'AI Agent', icon: MessageSquare },
  { id: 'reports', label: 'Reports', icon: FileText },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 220 : 60, background: '#0f172a', borderRight: '1px solid #1e293b', transition: 'width 0.2s', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart2 size={22} color="#6366f1" />
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>BizAnalytics AI</span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>
        <nav style={{ padding: '12px 8px', flex: 1 }}>
          {tabs.map(t => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 8, border: 'none', background: active ? '#1e293b' : 'transparent', color: active ? '#6366f1' : '#64748b', cursor: 'pointer', marginBottom: 4, textAlign: 'left' }}>
                <Icon size={18} />
                {sidebarOpen && <span style={{ fontSize: 14, fontWeight: active ? 600 : 400, whiteSpace: 'nowrap' }}>{t.label}</span>}
              </button>
            );
          })}
        </nav>
        {sidebarOpen && (
          <div style={{ padding: 16, borderTop: '1px solid #1e293b' }}>
            <div style={{ fontSize: 11, color: '#475569', marginBottom: 4 }}>Powered by</div>
            <div style={{ fontSize: 12, color: '#6366f1', fontWeight: 600 }}>OpenAI GPT-4o-mini</div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <header style={{ padding: '16px 24px', borderBottom: '1px solid #1e293b', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700 }}>{tabs.find(t => t.id === activeTab)?.label}</h1>
            <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Business Analytics AI Agent</p>
          </div>
          <div style={{ fontSize: 12, color: '#64748b' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
        </header>

        <main style={{ flex: 1, overflowY: 'auto', padding: 24 }}>
          {activeTab === 'dashboard' && (
            <div>
              <DataUpload />
              <KPICards />
              <Charts />
            </div>
          )}
          {activeTab === 'chat' && (
            <div style={{ height: 'calc(100vh - 130px)' }}>
              <ChatAgent />
            </div>
          )}
          {activeTab === 'reports' && <ReportGenerator />}
        </main>
      </div>
    </div>
  );
}
