import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, AlertCircle } from 'lucide-react';
import api from '../api/axios';
import { Button, Input, Textarea, Select, Card } from '../components/ui';

const TAGS = ['Math', 'CS', 'Physics', 'Chemistry', 'Other'];
const TITLE_MAX = 150;
const BODY_MAX = 3000;

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
    <div className="mx-auto max-w-xl px-4 py-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950">
          <HelpCircle className="h-5 w-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ask a question</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Be specific — good questions get better answers.</p>
        </div>
      </div>

      <Card className="animate-slide-up p-6">
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700 dark:bg-red-950/40 dark:text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input
              placeholder="e.g. How does gradient descent converge?"
              value={form.title}
              maxLength={TITLE_MAX}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <p className="mt-1 text-right text-xs text-gray-400">{form.title.length}/{TITLE_MAX}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Details</label>
            <Textarea
              placeholder="Describe your question... markdown supported: **bold**, *italic*, `code`, links"
              value={form.body}
              rows={7}
              maxLength={BODY_MAX}
              onChange={(e) => setForm({ ...form, body: e.target.value })}
            />
            <p className="mt-1 text-right text-xs text-gray-400">{form.body.length}/{BODY_MAX}</p>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">Tag</label>
            <Select value={form.tag} onChange={(e) => setForm({ ...form, tag: e.target.value })}>
              {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
          </div>

          <Button type="submit" loading={loading} className="w-full">
            {loading ? 'Posting...' : 'Post Question'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
