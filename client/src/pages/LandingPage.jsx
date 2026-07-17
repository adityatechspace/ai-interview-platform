import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, MessagesSquare, Gauge, FileText, ShieldCheck } from 'lucide-react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const features = [
  {
    icon: MessagesSquare,
    title: 'Realistic AI conversation',
    description:
      'The interviewer asks follow-through questions across a full session, the way a real hiring panel would.',
  },
  {
    icon: Gauge,
    title: 'Choose your difficulty',
    description: 'Dial in the role, difficulty, and interview type — technical, behavioral, or mixed.',
  },
  {
    icon: FileText,
    title: 'Structured feedback',
    description: 'Walk away with a score, clear strengths and weaknesses, and specific next steps.',
  },
  {
    icon: ShieldCheck,
    title: 'Track your progress',
    description: 'Create an account to keep a history of every session and watch your score improve.',
  },
];

const steps = [
  { label: 'Set up', text: 'Pick a role, difficulty, and how long you want to practice.' },
  { label: 'Answer', text: 'Work through eight questions in a focused chat interview.' },
  { label: 'Improve', text: 'Get a scored breakdown with concrete ways to get better.' },
];

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <Layout>
      {/* Hero */}
      <section className="container-page pb-20 pt-16 sm:pt-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="eyebrow inline-flex items-center gap-1.5 rounded-full border border-line bg-surface-soft px-3 py-1">
            AI-powered mock interviews
          </span>
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-ink-950 sm:text-5xl">
            Walk into your next interview already having done it once.
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-text-secondary sm:text-lg">
            Prepwise runs a full mock interview tailored to your role and difficulty, then gives you a
            structured score and feedback — in minutes, not days.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to={isAuthenticated ? '/interview/setup' : '/register'} className="btn-accent px-6 py-3 text-[15px]">
              Start Interview <ArrowRight size={16} />
            </Link>
            {!isAuthenticated && (
              <Link to="/login" className="btn-secondary px-6 py-3 text-[15px]">
                I already have an account
              </Link>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mx-auto mt-16 max-w-3xl"
        >
          <div className="card overflow-hidden">
            <div className="flex items-center gap-1.5 border-b border-line bg-surface-soft px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="h-2.5 w-2.5 rounded-full bg-line" />
              <span className="ml-3 text-xs text-text-tertiary">Full Stack · Medium · Question 3 of 8</span>
            </div>
            <div className="space-y-4 p-6">
              <div className="max-w-md rounded-2xl rounded-tl-sm bg-surface-muted px-4 py-3 text-sm text-text-primary">
                Walk me through how you'd design a rate limiter for a public API.
              </div>
              <div className="ml-auto max-w-md rounded-2xl rounded-tr-sm bg-ink-950 px-4 py-3 text-sm text-white">
                I'd start with a token bucket per client key, backed by Redis so it works across instances...
              </div>
              <div className="flex items-center gap-1 pl-1 text-text-tertiary">
                <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-text-tertiary" />
                <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-text-tertiary [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-text-tertiary [animation-delay:0.4s]" />
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="border-t border-line bg-surface-soft py-20">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow">Why Prepwise</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
              Everything you need to walk in prepared
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {features.map(({ icon: Icon, title, description }) => (
              <div key={title} className="card p-6">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-50 text-accent">
                  <Icon size={18} />
                </div>
                <h3 className="text-[15px] font-semibold text-ink-950">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="container-page">
          <div className="mx-auto max-w-xl text-center">
            <span className="eyebrow">The flow</span>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950 sm:text-3xl">
              Three steps, one session
            </h2>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div key={step.label} className="relative">
                <span className="text-sm font-semibold text-accent">0{i + 1}</span>
                <h3 className="mt-2 text-[15px] font-semibold text-ink-950">{step.label}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-14 flex justify-center">
            <Link to={isAuthenticated ? '/interview/setup' : '/register'} className="btn-primary px-6 py-3 text-[15px]">
              Start Interview <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
