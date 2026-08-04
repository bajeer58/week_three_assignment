import { Link } from 'react-router-dom';
import { CompassIcon } from 'lucide-react';
import { Button } from '../components/ui';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 dark:bg-brand-950">
        <CompassIcon className="h-8 w-8 text-brand-600" />
      </div>
      <h1 className="mt-6 text-3xl font-bold text-gray-900 dark:text-gray-100">Page not found</h1>
      <p className="mt-2 text-gray-500 dark:text-gray-400">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link to="/" className="mt-6">
        <Button>Back to the feed</Button>
      </Link>
    </div>
  );
}
