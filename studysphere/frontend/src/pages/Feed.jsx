import { useEffect, useState } from 'react';
import api from '../api/axios';
import QuestionCard from '../components/QuestionCard';
import { SkeletonList } from '../components/Skeletons';

const TAGS = ['All', 'Math', 'CS', 'Physics', 'Chemistry', 'Other'];

export default function Feed() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('loading');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    setStatus('loading');
    const params = {};
    if (tag !== 'All') params.tag = tag;
    if (sort) params.sort = sort;

    api.get('/questions', { params })
  .then((res) => {
    console.log('API response:', res.data);
    setQuestions(Array.isArray(res.data) ? res.data : []);
    setStatus('done');
  })
  .catch((err) => {
    console.log('API error:', err.response?.data || err.message);
    setStatus('error');
  });
  }, [tag, sort]);

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Questions</h1>
        <div className="flex gap-2">
          <select value={tag} onChange={(e) => setTag(e.target.value)} className="border rounded px-2 py-1">
            {TAGS.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border rounded px-2 py-1">
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>

      {status === 'loading' && <SkeletonList />}
      {status === 'error' && <p className="text-red-600">Failed to load questions. Try again later.</p>}
      {status === 'done' && questions.length === 0 && (
        <p className="text-gray-500">No questions yet — be the first to ask!</p>
      )}
      {status === 'done' && (
        <div className="space-y-3">
          {questions.map((q) => <QuestionCard key={q._id} question={q} />)}
        </div>
      )}
    </div>
  );
}