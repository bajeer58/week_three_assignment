import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Menu, X, Sun, Moon, PlusCircle, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Avatar, Button } from './ui';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function onClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-1.5 text-lg font-bold text-gray-900 dark:text-gray-100">
          <GraduationCap className="h-6 w-6 text-brand-600" />
          StudySphere
        </Link>

        <div className="hidden items-center gap-3 sm:flex">
          <button
            onClick={toggleTheme}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          {user ? (
            <>
              <Link to="/ask">
                <Button size="sm" className="gap-1.5">
                  <PlusCircle className="h-4 w-4" />
                  Ask a Question
                </Button>
              </Link>
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Avatar name={user.name} size="sm" />
                  <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                </button>
                {menuOpen && (
                  <div className="animate-fade-in absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-gray-100 bg-white py-1 shadow-elevated dark:border-gray-800 dark:bg-gray-900">
                    <div className="border-b border-gray-100 px-3.5 py-2.5 dark:border-gray-800">
                      <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</p>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <UserIcon className="h-4 w-4" />
                      My activity
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-brand-600 dark:text-gray-300">
                Login
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 sm:hidden dark:text-gray-300 dark:hover:bg-gray-800"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="animate-slide-up flex flex-col gap-1 border-t border-gray-100 px-4 py-3 sm:hidden dark:border-gray-800">
          <button
            onClick={toggleTheme}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          {user ? (
            <>
              <Link to="/ask" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-sm font-medium text-brand-600">
                Ask a Question
              </Link>
              <Link to="/profile" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-sm text-gray-600 dark:text-gray-300">
                My activity ({user.name})
              </Link>
              <button onClick={handleLogout} className="rounded-lg px-2 py-2 text-left text-sm text-red-600">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-sm text-gray-600 dark:text-gray-300">
                Login
              </Link>
              <Link to="/signup" onClick={() => setMobileOpen(false)} className="rounded-lg px-2 py-2 text-sm font-medium text-brand-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
