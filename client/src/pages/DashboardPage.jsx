import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, ArrowRight, Clock, TrendingUp, Info } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getHistory } from '../api/interviews';

const scoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 60) return 'text-accent bg-accent-50';
  return 'text-amber-600 bg-amber-50';
};

export default function DashboardPage() {
  const { user, isGuest } = useAuth();
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(!isGuest);

  useEffect(() => {
    if (isGuest) return;
    getHistory()
      .then((data) => setRecent(data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isGuest]);

  const firstName = user?.name?.split(' ')[0] || 'there';

  return (
    <Layout>
      <div className="container-page py-12">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-ink-950">
            {isGuest ? 'Welcome' : `Welcome back, ${firstName}`}
          </h1>
          <p className="text-sm text-text-secondary">Ready to sharpen your interview skills today?</p>
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          <Link
            to="/interview/setup"
            className="card group flex flex-col justify-between p-6 transition-colors hover:border-accent/40 lg:col-span-2"
          >
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-white">
                <Plus size={18} />
              </div>
              <h2 className="text-[15px] font-semibold text-ink-950">Create new interview</h2>
              <p className="mt-1.5 max-w-md text-sm leading-relaxed text-text-secondary">
                Pick a role, difficulty, and format, then jump straight into a fresh mock interview.
              </p>
            </div>
            <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
              Start setup <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </span>
          </Link>

          <div className="card flex flex-col justify-between p-6">
            <div>
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-surface-muted text-text-secondary">
                <TrendingUp size={18} />
              </div>
              <h2 className="text-[15px] font-semibold text-ink-950">Your account</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
                {isGuest
                  ? 'You are browsing as a guest. Create an account to save every session.'
                  : `Signed in as ${user?.email}`}
              </p>
            </div>
            {isGuest && (
              <Link to="/register" className="btn-secondary mt-6 justify-center text-sm">
                Create an account
              </Link>
            )}
          </div>
        </div>

        <div className="mt-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-[15px] font-semibold text-ink-950">Recent interviews</h2>
            {!isGuest && (
              <Link to="/history" className="text-sm font-medium text-accent hover:text-accent-600">
                View all
              </Link>
            )}
          </div>

          {isGuest ? (
            <div className="card flex items-center gap-3 p-6 text-sm text-text-secondary">
              <Info size={18} className="shrink-0 text-text-tertiary" />
              History is available after creating an account.
            </div>
          ) : loading ? (
            <div className="card p-6 text-sm text-text-tertiary">Loading recent sessions…</div>
          ) : recent.length === 0 ? (
            <div className="card p-6 text-sm text-text-secondary">
              No interviews yet. Start your first one above.
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-3">
              {recent.map((item) => (
                <Link key={item._id} to={`/interview/${item._id}/result`} className="card p-5 hover:border-accent/40">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[15px] font-semibold text-ink-950">{item.role}</p>
                      <p className="mt-0.5 text-xs text-text-tertiary">{item.interviewType} · {item.difficulty}</p>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${scoreColor(item.result?.overallScore || 0)}`}>
                      {item.result?.overallScore ?? '-'}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center gap-1.5 text-xs text-text-tertiary">
                    <Clock size={12} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
