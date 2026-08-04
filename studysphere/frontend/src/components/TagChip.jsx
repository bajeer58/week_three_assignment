import { Badge } from './ui';

const TAG_COLORS = {
  Math: 'blue',
  CS: 'purple',
  Physics: 'green',
  Chemistry: 'orange',
  Other: 'gray'
};

export default function TagChip({ tag }) {
  return <Badge color={TAG_COLORS[tag] || 'gray'}>{tag}</Badge>;
}
