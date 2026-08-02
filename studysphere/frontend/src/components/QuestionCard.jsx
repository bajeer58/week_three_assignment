import { Link } from 'react-router-dom';
import TagChip from './TagChip';

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  const units = [['year', 31536000], ['month', 2592000], ['day', 86400], ['hour', 3600], ['minute', 60]];
  for (const [name, secs] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${name[0]}${val > 1 ? '' : ''} ago`;
  }
  return 'just now';
}

export default function QuestionCard({ question }) {
  return (
    <Link
      to={`/questions/${question._id}`}
      className="block bg-white rounded-lg p-4 shadow hover:shadow-md transition-shadow duration-150"
    >
      <div className="flex items-center gap-2 mb-2">
        <TagChip tag={question.tag} />
        <span className="text-xs text-gray-400">{timeAgo(question.createdAt)}</span>
      </div>
      <h3 className="font-semibold text-gray-800">{question.title}</h3>
      <div className="mt-2 text-sm text-gray-500 flex justify-between">
        <span>by {question.author?.name || 'Unknown'}</span>
        <span>{question.answerCount} answers</span>
      </div>
    </Link>
  );
}