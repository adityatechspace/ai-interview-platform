import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAuthenticated, isGuest, logout, user } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/80 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="btn-ghost">
                Dashboard
              </Link>
              {!isGuest && (
                <Link to="/history" className="btn-ghost">
                  History
                </Link>
              )}
              <span className="mx-2 h-5 w-px bg-line" />
              <span className="px-2 text-sm text-text-secondary">
                {user?.name}
                {isGuest && <span className="ml-1.5 rounded-full bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-tertiary">Guest</span>}
              </span>
              <button onClick={handleLogout} className="btn-ghost" aria-label="Log out">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">
                Log in
              </Link>
              <Link to="/register" className="btn-primary">
                Get started
              </Link>
            </>
          )}
        </nav>

        <button
          className="btn-ghost md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-surface md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn-ghost justify-start" onClick={() => setOpen(false)}>
                  Dashboard
                </Link>
                {!isGuest && (
                  <Link to="/history" className="btn-ghost justify-start" onClick={() => setOpen(false)}>
                    History
                  </Link>
                )}
                <button onClick={handleLogout} className="btn-ghost justify-start">
                  <LogOut size={16} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost justify-start" onClick={() => setOpen(false)}>
                  Log in
                </Link>
                <Link to="/register" className="btn-primary justify-center" onClick={() => setOpen(false)}>
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
