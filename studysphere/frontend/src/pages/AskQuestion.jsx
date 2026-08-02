import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TAGS = ['Math', 'CS', 'Physics', 'Chemistry', 'Other'];

export default function AskQuestion() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', body: '', tag: 'CS' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title.trim() || !form.body.trim()) return setError('Title and body are required');
    setLoading(true);
    try {
      const res = await api.post('/questions', form);
      navigate(`/questions/${res.data._id}`);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to post question');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Ask a Question</h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          placeholder="Title" value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <textarea
          placeholder="Describe your question..." value={form.body} rows={6}
          onChange={(e) => setForm({ ...form, body: e.target.value })}
          className="w-full border rounded px-3 py-2"
        />
        <select
          value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="w-full border rounded px-3 py-2"
        >
          {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <button
          disabled={loading}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
        >
          {loading ? 'Posting...' : 'Post Question'}
        </button>
      </form>
    </div>
  );
}