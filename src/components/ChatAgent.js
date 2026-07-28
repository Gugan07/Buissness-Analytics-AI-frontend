import React, { useState, useRef, useEffect } from 'react';
import { chatWithAgent } from '../api';
import { Send, Bot, User, Loader } from 'lucide-react';

export default function ChatAgent() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: { summary: 'Hello! I am your Business Analytics AI Agent. Ask me anything about your sales data, trends, predictions, or request a performance analysis.' } }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const history = messages
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({
        role: m.role,
        content: typeof m.content === 'string'
          ? m.content
          : (m.content?.summary || JSON.stringify(m.content))
      }))
      .filter(m => m.content.trim());
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await chatWithAgent(input, history);
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: { summary: 'Error connecting to the AI agent. Please check the backend.' } }]);
    }
    setLoading(false);
  };

  const renderContent = (content) => {
    if (typeof content === 'string') return <p style={{ lineHeight: 1.6 }}>{content}</p>;
    return (
      <div>
        {content.summary && <p style={{ marginBottom: 10, lineHeight: 1.6 }}>{content.summary}</p>}
        {content.insights?.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: '#6366f1' }}>Insights:</strong>
            <ul style={{ paddingLeft: 16, marginTop: 4 }}>{content.insights.map((i, x) => <li key={x} style={{ fontSize: 13, marginBottom: 3 }}>{i}</li>)}</ul>
          </div>
        )}
        {content.trends?.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: '#22c55e' }}>Trends:</strong>
            <ul style={{ paddingLeft: 16, marginTop: 4 }}>{content.trends.map((t, x) => <li key={x} style={{ fontSize: 13, marginBottom: 3 }}>{t}</li>)}</ul>
          </div>
        )}
        {content.predictions?.length > 0 && (
          <div style={{ marginBottom: 8 }}>
            <strong style={{ color: '#f59e0b' }}>Predictions:</strong>
            <ul style={{ paddingLeft: 16, marginTop: 4 }}>{content.predictions.map((p, x) => <li key={x} style={{ fontSize: 13, marginBottom: 3 }}>{p}</li>)}</ul>
          </div>
        )}
        {content.recommendations?.length > 0 && (
          <div>
            <strong style={{ color: '#ef4444' }}>Recommendations:</strong>
            <ul style={{ paddingLeft: 16, marginTop: 4 }}>{content.recommendations.map((r, x) => <li key={x} style={{ fontSize: 13, marginBottom: 3 }}>{r}</li>)}</ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: '#1e293b', borderRadius: 12, border: '1px solid #334155', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 10 }}>
        <Bot size={20} color="#6366f1" />
        <span style={{ fontWeight: 600 }}>AI Analytics Agent</span>
        <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22c55e', background: '#052e16', padding: '2px 8px', borderRadius: 20 }}>● Online</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: 20, display: 'flex', flexDirection: 'column', gap: 16 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: 'flex', gap: 10, flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: m.role === 'user' ? '#6366f1' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {m.role === 'user' ? <User size={16} /> : <Bot size={16} color="#6366f1" />}
            </div>
            <div style={{ maxWidth: '75%', background: m.role === 'user' ? '#6366f1' : '#0f172a', padding: '12px 16px', borderRadius: m.role === 'user' ? '12px 4px 12px 12px' : '4px 12px 12px 12px', fontSize: 14, border: '1px solid #334155' }}>
              {renderContent(m.content)}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#6366f1" />
            </div>
            <div style={{ background: '#0f172a', padding: '12px 16px', borderRadius: '4px 12px 12px 12px', border: '1px solid #334155' }}>
              <Loader size={16} color="#6366f1" style={{ animation: 'spin 1s linear infinite' }} />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ padding: 16, borderTop: '1px solid #334155', display: 'flex', gap: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Ask about trends, predictions, performance..."
          style={{ flex: 1, background: '#0f172a', border: '1px solid #334155', borderRadius: 8, padding: '10px 14px', color: '#e2e8f0', fontSize: 14, outline: 'none' }}
        />
        <button onClick={send} disabled={loading} style={{ background: '#6366f1', border: 'none', borderRadius: 8, padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <Send size={16} color="white" />
        </button>
      </div>
    </div>
  );
}
