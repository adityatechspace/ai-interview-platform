import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, Lightbulb, Loader2, RotateCcw, Info, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { getInterview } from '../api/interviews';

function ScoreRing({ score }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#3E63DD' : '#D97706';

  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="mx-auto">
      <circle cx="70" cy="70" r={radius} fill="none" stroke="#F4F4F5" strokeWidth="12" />
      <circle
        cx="70"
        cy="70"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        transform="rotate(-90 70 70)"
      />
      <text x="70" y="76" textAnchor="middle" fontSize="30" fontWeight="700" fill="#18181B">
        {score}
      </text>
    </svg>
  );
}

function ListCard({ icon: Icon, title, items, tone }) {
  return (
    <div className="card p-5">
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className={tone} />
        <h3 className="text-[14px] font-semibold text-ink-950">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items?.length ? (
          items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-text-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-tertiary" />
              {item}
            </li>
          ))
        ) : (
          <li className="text-sm text-text-tertiary">Nothing noted.</li>
        )}
      </ul>
    </div>
  );
}

export default function ResultPage() {
  const { id } = useParams();
  const location = useLocation();
  const { isGuest } = useAuth();
  const [interview, setInterview] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!location.state?.result);
  const [showTranscript, setShowTranscript] = useState(false);

  useEffect(() => {
    if (interview) return;
    getInterview(id)
      .then(setInterview)
      .finally(() => setLoading(false));
  }, [id, interview]);

  if (loading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="animate-spin text-text-tertiary" size={22} />
        </div>
      </Layout>
    );
  }

  if (!interview) {
    return (
      <Layout>
        <div className="container-page py-16 text-center text-text-secondary">Result not found.</div>
      </Layout>
    );
  }

  const { result, role, difficulty, interviewType } = interview;

  return (
    <Layout>
      <div className="container-page max-w-3xl py-12">
        <div className="text-center">
          <span className="eyebrow">Interview complete</span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950">
            {role} · {interviewType} · {difficulty}
          </h1>
        </div>

        <div className="card mt-8 p-8 text-center">
          <ScoreRing score={result?.overallScore ?? 0} />
          <p className="mt-4 text-sm leading-relaxed text-text-secondary">{result?.feedback}</p>
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          <ListCard icon={CheckCircle2} title="Strengths" items={result?.strengths} tone="text-emerald-600" />
          <ListCard icon={AlertTriangle} title="Weaknesses" items={result?.weaknesses} tone="text-amber-600" />
          <ListCard icon={Lightbulb} title="Suggestions" items={result?.suggestions} tone="text-accent" />
        </div>

        {interview.conversation?.length ? (
          <div className="card mt-6 overflow-hidden">
            <button
              onClick={() => setShowTranscript((v) => !v)}
              className="flex w-full items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-[14px] font-semibold text-ink-950">Full transcript</span>
              <ChevronDown
                size={16}
                className={`text-text-tertiary transition-transform ${showTranscript ? 'rotate-180' : ''}`}
              />
            </button>
            {showTranscript && (
              <div className="space-y-3 border-t border-line px-5 py-5">
                {interview.conversation.map((msg, idx) => (
                  <div key={idx}>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">
                      {msg.role === 'ai' ? 'Interviewer' : 'You'}
                    </p>
                    <p className="mt-1 text-sm leading-relaxed text-text-secondary">{msg.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {isGuest ? (
          <div className="card mt-6 flex items-center gap-3 p-5 text-sm text-text-secondary">
            <Info size={18} className="shrink-0 text-text-tertiary" />
            Create an account to save your interview history.
          </div>
        ) : null}

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/interview/setup" className="btn-accent px-6 py-2.5">
            <RotateCcw size={15} /> Practice again
          </Link>
          <Link to="/dashboard" className="btn-secondary px-6 py-2.5">
            Back to dashboard
          </Link>
          {isGuest && (
            <Link to="/register" className="btn-primary px-6 py-2.5">
              Create an account
            </Link>
          )}
        </div>
      </div>
    </Layout>
  );
}
