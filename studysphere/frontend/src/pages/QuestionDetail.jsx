import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Eye, MessageSquare, WifiOff, ArrowLeft } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TagChip from '../components/TagChip';
import AnswerCard from '../components/AnswerCard';
import { CardSkeleton } from '../components/Skeletons';
import { Avatar, Card, Textarea, Button } from '../components/ui';

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
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <CardSkeleton />
      </div>
    );
  }
  if (status === 'error') {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-16 text-center">
        <WifiOff className="h-8 w-8 text-gray-300 dark:text-gray-600" />
        <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">Failed to load this question</p>
      </div>
    );
  }

  const { question, answers } = data;
  const isQuestionAuthor = user && String(question.author._id) === user.id;

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8">
      <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to questions
      </Link>

      <Card className="animate-slide-up p-6">
        <div className="flex items-center gap-2">
          <TagChip tag={question.tag} />
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <Eye className="h-3.5 w-3.5" />
            {question.views ?? 0} views
          </span>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <MessageSquare className="h-3.5 w-3.5" />
            {answers.length} answers
          </span>
        </div>
        <h1 className="mt-3 text-2xl font-bold text-gray-900 dark:text-gray-100">{question.title}</h1>
        <div className="prose prose-sm mt-3 max-w-none text-gray-700 dark:prose-invert dark:text-gray-300">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{question.body}</ReactMarkdown>
        </div>
        <div className="mt-4 flex items-center gap-2 border-t border-gray-100 pt-4 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
          <Avatar name={question.author.name} size="sm" />
          asked by {question.author.name}
        </div>
      </Card>

      <div className="space-y-3">
        <h2 className="font-semibold text-gray-700 dark:text-gray-300">
          {answers.length} {answers.length === 1 ? 'Answer' : 'Answers'}
        </h2>
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
        <Card className="space-y-3 p-5">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Your answer</h3>
          <form onSubmit={handlePostAnswer} className="space-y-3">
            <Textarea
              value={answerBody}
              onChange={(e) => setAnswerBody(e.target.value)}
              placeholder="Write your answer... markdown supported"
              rows={4}
            />
            <Button type="submit" loading={posting}>
              {posting ? 'Posting...' : 'Post Answer'}
            </Button>
          </form>
        </Card>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          <Link to="/login" className="font-medium text-brand-600 hover:underline">Log in</Link> to post an answer.
        </p>
      )}
    </div>
  );
}
