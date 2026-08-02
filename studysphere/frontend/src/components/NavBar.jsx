import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      <Link to="/" className="text-xl font-bold text-indigo-600">StudySphere</Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link to="/ask" className="bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700">
              Ask a Question
            </Link>
            <span className="text-gray-600">{user.name}</span>
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="text-gray-500 hover:text-gray-800"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-600 hover:text-indigo-600">Login</Link>
            <Link to="/signup" className="bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}