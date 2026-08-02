const TAG_COLORS = {
  Math: 'bg-blue-100 text-blue-700',
  CS: 'bg-purple-100 text-purple-700',
  Physics: 'bg-green-100 text-green-700',
  Chemistry: 'bg-orange-100 text-orange-700',
  Other: 'bg-gray-100 text-gray-700'
};

export default function TagChip({ tag }) {
  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${TAG_COLORS[tag] || TAG_COLORS.Other}`}>
      {tag}
    </span>
  );
}