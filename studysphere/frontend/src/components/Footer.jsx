import { GraduationCap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-gray-100 bg-white dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-2 px-4 py-8 text-sm text-gray-500 sm:flex-row sm:justify-between dark:text-gray-400">
        <div className="flex items-center gap-1.5 font-semibold text-gray-700 dark:text-gray-200">
          <GraduationCap className="h-4 w-4 text-brand-600" />
          StudySphere
        </div>
        <p>Ask questions, share answers, learn together.</p>
        <p>&copy; {new Date().getFullYear()} StudySphere</p>
      </div>
    </footer>
  );
}
