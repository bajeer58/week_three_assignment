import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Award, ArrowBigUp } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Avatar, Badge } from './ui';

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
    <div
      className={`rounded-2xl border bg-white p-5 shadow-soft transition-shadow duration-150 hover:shadow-elevated dark:bg-gray-900 ${
        isBest ? 'border-emerald-300 dark:border-emerald-800' : 'border-gray-100 dark:border-gray-800'
      }`}
    >
      {isBest && (
        <Badge color="green" className="mb-3">
          <Award className="h-3.5 w-3.5" />
          Best Answer
        </Badge>
      )}
      <div className="prose prose-sm max-w-none text-gray-800 dark:prose-invert dark:text-gray-200">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{answer.body}</ReactMarkdown>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
          <Avatar name={answer.author?.name || 'Unknown'} size="sm" />
          <span>{answer.author?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleUpvote}
            disabled={!user || voting || isOwnAnswer}
            title={isOwnAnswer ? "You can't upvote your own answer" : undefined}
            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 font-medium transition-colors ${
              hasVoted
                ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:bg-brand-950 dark:text-brand-300'
                : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <ArrowBigUp className={`h-4 w-4 ${hasVoted ? 'fill-brand-600 dark:fill-brand-300' : ''}`} />
            {upvotes.length}
          </button>
          {isQuestionAuthor && !isBest && (
            <button
              onClick={() => onMarkBest(answer._id)}
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              Mark as Best
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
