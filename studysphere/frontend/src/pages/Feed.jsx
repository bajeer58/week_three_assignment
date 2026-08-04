import { useEffect, useState } from 'react';
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Inbox, WifiOff } from 'lucide-react';
import api from '../api/axios';
import QuestionCard from '../components/QuestionCard';
import { SkeletonList } from '../components/Skeletons';
import { Input, Select, Button } from '../components/ui';

const TAGS = ['All', 'Math', 'CS', 'Physics', 'Chemistry', 'Other'];

export default function Feed() {
  const [questions, setQuestions] = useState([]);
  const [status, setStatus] = useState('loading');
  const [tag, setTag] = useState('All');
  const [sort, setSort] = useState('newest');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ total: 0, pages: 1 });

  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setStatus('loading');
    const params = { sort, page };
    if (tag !== 'All') params.tag = tag;
    if (search) params.search = search;

    api.get('/questions', { params })
      .then((res) => {
        setQuestions(res.data.questions || []);
        setMeta({ total: res.data.total ?? 0, pages: res.data.pages ?? 1 });
        setStatus('done');
      })
      .catch(() => setStatus('error'));
  }, [tag, sort, search, page]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Questions</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {status === 'done' ? `${meta.total} question${meta.total === 1 ? '' : 's'} from the community` : 'Browse what people are asking'}
        </p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Input
          icon={Search}
          placeholder="Search questions..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="sm:flex-1"
        />
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 shrink-0 text-gray-400" />
          <Select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="w-36">
            <option value="newest">Newest</option>
            <option value="popular">Popular</option>
          </Select>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => { setTag(t); setPage(1); }}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              tag === t
                ? 'bg-brand-600 text-white shadow-soft'
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {status === 'loading' && <SkeletonList />}

      {status === 'error' && (
        <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <WifiOff className="h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">Failed to load questions</p>
          <p className="text-sm text-gray-400">Check your connection and try again.</p>
        </div>
      )}

      {status === 'done' && questions.length === 0 && (
        <div className="flex flex-col items-center rounded-2xl border border-gray-100 bg-white py-16 text-center dark:border-gray-800 dark:bg-gray-900">
          <Inbox className="h-8 w-8 text-gray-300 dark:text-gray-600" />
          <p className="mt-3 font-medium text-gray-700 dark:text-gray-300">No questions found</p>
          <p className="text-sm text-gray-400">
            {search || tag !== 'All' ? 'Try a different search or filter.' : 'Be the first to ask!'}
          </p>
        </div>
      )}

      {status === 'done' && questions.length > 0 && (
        <>
          <div className="space-y-3">
            {questions.map((q) => <QuestionCard key={q._id} question={q} />)}
          </div>

          {meta.pages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </Button>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Page {page} of {meta.pages}
              </span>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= meta.pages}
                onClick={() => setPage((p) => Math.min(meta.pages, p + 1))}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
