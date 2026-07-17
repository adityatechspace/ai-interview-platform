import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ChevronRight, PlusCircle } from 'lucide-react';
import Layout from '../components/Layout';
import { getHistory } from '../api/interviews';

const scoreColor = (score) => {
  if (score >= 80) return 'text-emerald-600 bg-emerald-50';
  if (score >= 60) return 'text-accent bg-accent-50';
  return 'text-amber-600 bg-amber-50';
};

export default function HistoryPage() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory()
      .then(setInterviews)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="container-page py-12">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow">Your progress</span>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950">Interview history</h1>
          </div>
          <Link to="/interview/setup" className="btn-accent hidden sm:inline-flex">
            <PlusCircle size={16} /> New interview
          </Link>
        </div>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="animate-spin text-text-tertiary" size={22} />
            </div>
          ) : interviews.length === 0 ? (
            <div className="card p-8 text-center text-sm text-text-secondary">
              You haven't completed an interview yet.
              <div className="mt-4">
                <Link to="/interview/setup" className="btn-accent inline-flex px-5 py-2.5">
                  Start your first interview
                </Link>
              </div>
            </div>
          ) : (
            <div className="card divide-y divide-line overflow-hidden">
              {interviews.map((item) => (
                <Link
                  key={item._id}
                  to={`/interview/${item._id}/result`}
                  className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-surface-soft"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-medium text-ink-950">{item.role}</p>
                    <p className="mt-0.5 text-xs text-text-tertiary">
                      {item.interviewType} · {item.difficulty} · {item.duration} min ·{' '}
                      {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${scoreColor(item.result?.overallScore || 0)}`}>
                      {item.result?.overallScore ?? '-'}
                    </span>
                    <ChevronRight size={16} className="text-text-tertiary" />
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
