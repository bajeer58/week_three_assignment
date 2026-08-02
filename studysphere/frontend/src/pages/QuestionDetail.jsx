import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TagChip from '../components/TagChip';
import AnswerCard from '../components/AnswerCard';
import { CardSkeleton } from '../components/Skeletons';

export default function QuestionDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');
  const [answerBody, setAnswerBody] = useState('');
  const [posting, setPosting] = useState(false);

  const fetchData = useCallback(() => {
    setStatus('loading');
    api.get(`/questions/${id}`)
      .then((res) => { setData(res.data); setStatus('done'); })
      .catch(() => setStatus('error'));
  }, [id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!answerBody.trim() || posting) return;
    setPosting(true);
    try {
      await api.post(`/questions/${id}/answers`, { body: answerBody });
      setAnswerBody('');
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to post answer');
    } finally {
      setPosting(false);
    }
  };

  const handleMarkBest = async (answerId) => {
    try {
      await api.patch(`/questions/${id}/best-answer`, { answerId });
      fetchData();
    } catch (err) {
      showToast(err.response?.data?.error || 'Failed to mark best answer');
    }
  };

  if (status === 'loading') {
    return <div className="max-w-3xl mx-auto mt-8 px-4"><CardSkeleton /></div>;
  }
  if (status === 'error') {
    return <p className="max-w-3xl mx-auto mt-8 px-4 text-red-600">Failed to load this question.</p>;
  }

  const { question, answers } = data;
  const isQuestionAuthor = user && String(question.author._id) === user.id;

  return (
    <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
      <div className="bg-white p-5 rounded-lg shadow">
        <TagChip tag={question.tag} />
        <h1 className="text-2xl font-bold mt-2">{question.title}</h1>
        <p className="text-gray-700 mt-3 whitespace-pre-wrap">{question.body}</p>
        <p className="text-sm text-gray-400 mt-3">by {question.author.name}</p>
      </div>

      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700">{answers.length} Answers</h2>
        {answers.map((a) => (
          <AnswerCard
            key={a._id}
            answer={a}
            isBest={question.bestAnswer === a._id}
            isQuestionAuthor={isQuestionAuthor}
            onMarkBest={handleMarkBest}
            onVoteChange={fetchData}
          />
        ))}
      </div>

      {user ? (
        <form onSubmit={handlePostAnswer} className="bg-white p-4 rounded-lg shadow space-y-2">
          <textarea
            value={answerBody} onChange={(e) => setAnswerBody(e.target.value)}
            placeholder="Write your answer..." rows={4}
            className="w-full border rounded px-3 py-2"
          />
          <button
            disabled={posting}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            {posting ? 'Posting...' : 'Post Answer'}
          </button>
        </form>
      ) : (
        <p className="text-gray-500 text-sm">Log in to post an answer.</p>
      )}
    </div>
  );
}