import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import { createInterview } from '../api/interviews';

const roles = ['Frontend', 'Backend', 'Full Stack', 'Software Engineer', 'Machine Learning', 'HR', 'Behavioral'];
const difficulties = ['Easy', 'Medium', 'Hard'];
const interviewTypes = ['Technical', 'Behavioral', 'Mixed'];
const durations = [10, 20, 30];

function OptionGrid({ label, options, value, onChange, renderLabel }) {
  return (
    <div>
      <label className="label">{label}</label>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              type="button"
              key={opt}
              onClick={() => onChange(opt)}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? 'border-accent bg-accent-50 text-accent'
                  : 'border-line bg-surface text-text-secondary hover:border-ink-950/20 hover:text-text-primary'
              }`}
            >
              {renderLabel ? renderLabel(opt) : opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function InterviewSetupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    role: 'Full Stack',
    difficulty: 'Medium',
    interviewType: 'Technical',
    duration: 20,
    language: 'English',
  });
  const [loading, setLoading] = useState(false);

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  const handleStart = async () => {
    setLoading(true);
    try {
      const interview = await createInterview(form);
      navigate(`/interview/${interview.id}`);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container-page max-w-2xl py-12">
        <div className="mb-8">
          <span className="eyebrow">Interview setup</span>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink-950">Configure your session</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Choose the format that matches what you're preparing for.
          </p>
        </div>

        <div className="card space-y-7 p-6">
          <OptionGrid label="Role" options={roles} value={form.role} onChange={update('role')} />
          <OptionGrid label="Difficulty" options={difficulties} value={form.difficulty} onChange={update('difficulty')} />
          <OptionGrid label="Interview type" options={interviewTypes} value={form.interviewType} onChange={update('interviewType')} />
          <OptionGrid
            label="Duration"
            options={durations}
            value={form.duration}
            onChange={update('duration')}
            renderLabel={(d) => `${d} min`}
          />

          <div>
            <label className="label">Language</label>
            <select
              className="input"
              value={form.language}
              onChange={(e) => update('language')(e.target.value)}
            >
              <option>English</option>
              <option>Spanish</option>
              <option>French</option>
              <option>German</option>
              <option>Hindi</option>
              <option>Portuguese</option>
            </select>
          </div>

          <button onClick={handleStart} disabled={loading} className="btn-accent w-full py-3 text-[15px]">
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Preparing your interview…
              </>
            ) : (
              <>
                Start Interview <ArrowRight size={16} />
              </>
            )}
          </button>
        </div>
      </div>
    </Layout>
  );
}
