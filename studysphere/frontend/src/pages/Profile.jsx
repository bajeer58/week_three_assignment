import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, MessageSquare, ArrowBigUp, WifiOff } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { Avatar, Card } from '../components/ui';
import { SkeletonList } from '../components/Skeletons';
import TagChip from '../components/TagChip';

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="flex items-center gap-3 p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-950">
        <Icon className="h-5 w-5 text-brand-600" />
      </div>
      <div>
        <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      </div>
    </Card>
  );
}

export default function Profile() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    api.get('/users/me')
      .then((res) => { setData(res.data); setStatus('done'); })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6 flex items-center gap-3">
        <Avatar name={user?.name || '?'} size="lg" />
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user?.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Your activity on StudySphere</p>
        </div>
      </div>

      {status === 'loading' && <SkeletonList count={3} />}

      {status === 'error' && (
        <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <WifiOff className="h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">Failed to load your activity</p>
        </div>
      )}

      {status === 'done' && data && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <StatCard icon={HelpCircle} label="Questions asked" value={data.questionsCount} />
            <StatCard icon={MessageSquare} label="Answers given" value={data.answersCount} />
            <StatCard icon={ArrowBigUp} label="Upvotes received" value={data.upvotesReceived} />
          </div>

          <div>
            <h2 className="mb-3 font-semibold text-gray-700 dark:text-gray-300">Your questions</h2>
            {data.questions.length === 0 ? (
              <p className="text-sm text-gray-400">You haven't asked anything yet.</p>
            ) : (
              <div className="space-y-2">
                {data.questions.map((q) => (
                  <Link
                    key={q._id}
                    to={`/questions/${q._id}`}
                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-soft transition-shadow hover:shadow-elevated dark:border-gray-800 dark:bg-gray-900"
                  >
                    <span className="truncate pr-4 text-sm font-medium text-gray-800 dark:text-gray-200">{q.title}</span>
                    <TagChip tag={q.tag} />
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-3 font-semibold text-gray-700 dark:text-gray-300">Your answers</h2>
            {data.answers.length === 0 ? (
              <p className="text-sm text-gray-400">You haven't answered anything yet.</p>
            ) : (
              <div className="space-y-2">
                {data.answers.map((a) => (
                  <Link
                    key={a._id}
                    to={`/questions/${a.question?._id}`}
                    className="block rounded-xl border border-gray-100 bg-white px-4 py-3 shadow-soft transition-shadow hover:shadow-elevated dark:border-gray-800 dark:bg-gray-900"
                  >
                    <p className="truncate text-sm text-gray-500 dark:text-gray-400">on {a.question?.title || 'a deleted question'}</p>
                    <p className="mt-1 truncate text-sm font-medium text-gray-800 dark:text-gray-200">{a.body}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
