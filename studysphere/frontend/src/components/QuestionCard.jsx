import { Link } from 'react-router-dom';
import { MessageSquare, Eye, Clock } from 'lucide-react';
import TagChip from './TagChip';
import { Avatar } from './ui';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const units = [['y', 31536000], ['mo', 2592000], ['d', 86400], ['h', 3600], ['m', 60]];
  for (const [label, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return 'just now';
}

export default function QuestionCard({ question }) {
  return (
    <Link
      to={`/questions/${question._id}`}
      className="group block rounded-2xl border border-gray-100 bg-white p-5 shadow-soft transition-all duration-150 hover:-translate-y-0.5 hover:shadow-elevated dark:border-gray-800 dark:bg-gray-900"
    >
      <div className="flex items-center gap-2">
        <TagChip tag={question.tag} />
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          {timeAgo(question.createdAt)}
        </span>
      </div>
      <h3 className="mt-2.5 font-semibold text-gray-900 transition-colors group-hover:text-brand-600 dark:text-gray-100">
        {question.title}
      </h3>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <Avatar name={question.author?.name || 'Unknown'} size="sm" />
          <span>{question.author?.name || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <MessageSquare className="h-3.5 w-3.5" />
            {question.answerCount}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {question.views ?? 0}
          </span>
        </div>
      </div>
    </Link>
  );
}
