import { useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AnswerCard({ answer, isBest, isQuestionAuthor, onMarkBest, onVoteChange }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [upvotes, setUpvotes] = useState(answer.upvotes);
  const [voting, setVoting] = useState(false);

  const hasVoted = user && upvotes.includes(user.id);
  const isOwnAnswer = user && String(answer.author?._id || answer.author) === user.id;

  const handleUpvote = async () => {
    if (!user || voting) return;
    setVoting(true);
    const prev = upvotes;
    const optimistic = hasVoted
      ? upvotes.filter((id) => id !== user.id)
      : [...upvotes, user.id];
    setUpvotes(optimistic);
    try {
      const res = await api.patch(`/answers/${answer._id}/upvote`);
      setUpvotes(res.data.upvotes);
      onVoteChange?.();
    } catch (err) {
      setUpvotes(prev);
      showToast(err.response?.data?.error || 'Vote failed');
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-150">
      {isBest && (
        <div className="flex items-center gap-1 text-green-700 text-sm font-medium mb-2">
          ✓ Best Answer
        </div>
      )}
      <p className="text-gray-800">{answer.body}</p>
      <div className="mt-3 flex items-center justify-between text-sm text-gray-500">
        <span>by {answer.author?.name || 'Unknown'}</span>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            disabled={!user || voting || isOwnAnswer}
            className={`px-2 py-1 rounded border ${
              hasVoted ? 'bg-indigo-50 border-indigo-400 text-indigo-600' : 'border-gray-300'
            } disabled:opacity-50`}
          >
            ▲ {upvotes.length}
          </button>
          {isQuestionAuthor && !isBest && (
            <button
              onClick={() => onMarkBest(answer._id)}
              className="text-xs text-indigo-600 hover:underline"
            >
              Mark as Best
            </button>
          )}
        </div>
      </div>
    </div>
  );
}