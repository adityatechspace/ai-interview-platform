import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Send, Loader2, Bot, User as UserIcon } from 'lucide-react';
import Layout from '../components/Layout';
import { getInterview, submitAnswer } from '../api/interviews';

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, '0');
  return `${m}:${s}`;
}

export default function InterviewPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [answer, setAnswer] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [secondsLeft, setSecondsLeft] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    getInterview(id)
      .then((data) => {
        setInterview(data);
        setConversation(data.conversation);
        setSecondsLeft(data.duration * 60);
      })
      .catch((err) => {
        toast.error(err.message);
        navigate('/dashboard');
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (secondsLeft === null || secondsLeft <= 0) return;
    const timer = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [secondsLeft]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const currentQuestionNumber = conversation.filter((m) => m.role === 'ai').length;
  const totalQuestions = interview?.totalQuestions || 8;

  const handleSend = async () => {
    if (!answer.trim() || sending) return;
    const trimmed = answer.trim();
    setSending(true);
    setAnswer('');

    setConversation((prev) => [...prev, { role: 'user', content: trimmed, questionNumber: currentQuestionNumber }]);

    try {
      const { done, interview: updated } = await submitAnswer(id, trimmed);
      if (done) {
        navigate(`/interview/${id}/result`, { state: { result: updated } });
        return;
      }
      setConversation(updated.conversation);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <Layout showFooter={false}>
        <div className="flex min-h-[70vh] items-center justify-center">
          <Loader2 className="animate-spin text-text-tertiary" size={22} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout showFooter={false}>
      <div className="container-page grid gap-6 py-8 lg:grid-cols-[1fr_260px]">
        {/* Conversation */}
        <div className="flex h-[calc(100vh-8rem)] flex-col rounded-2xl border border-line bg-surface shadow-card">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div>
              <p className="text-[15px] font-semibold text-ink-950">{interview.role} interview</p>
              <p className="text-xs text-text-tertiary">
                {interview.interviewType} · {interview.difficulty}
              </p>
            </div>
            <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-medium text-text-secondary">
              Question {Math.min(currentQuestionNumber, totalQuestions)} of {totalQuestions}
            </span>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
            {conversation.map((msg, idx) => (
              <div key={idx} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    msg.role === 'ai' ? 'bg-ink-950 text-white' : 'bg-accent text-white'
                  }`}
                >
                  {msg.role === 'ai' ? <Bot size={14} /> : <UserIcon size={14} />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'ai'
                      ? 'rounded-tl-sm bg-surface-muted text-text-primary'
                      : 'rounded-tr-sm bg-ink-950 text-white'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {sending && (
              <div className="flex gap-2.5">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink-950 text-white">
                  <Bot size={14} />
                </div>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface-muted px-4 py-3">
                  <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-text-tertiary" />
                  <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-text-tertiary [animation-delay:0.2s]" />
                  <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-text-tertiary [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-line p-4">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your answer…"
                className="input max-h-32 flex-1 resize-none"
                disabled={sending}
              />
              <button
                onClick={handleSend}
                disabled={sending || !answer.trim()}
                className="btn-accent h-[42px] w-[42px] shrink-0 p-0"
                aria-label="Send answer"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Progress panel */}
        <aside className="space-y-4">
          <div className="card p-5">
            <p className="eyebrow">Progress</p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-muted">
              <div
                className="h-full rounded-full bg-accent transition-all duration-500"
                style={{ width: `${(Math.min(currentQuestionNumber, totalQuestions) / totalQuestions) * 100}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-text-tertiary">
              {Math.max(totalQuestions - currentQuestionNumber, 0)} questions remaining
            </p>
          </div>

          <div className="card p-5">
            <p className="eyebrow">Time remaining</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-ink-950">
              {secondsLeft !== null ? formatTime(secondsLeft) : '--:--'}
            </p>
            <p className="mt-1 text-xs text-text-tertiary">Take your time — this is a soft guide.</p>
          </div>
        </aside>
      </div>
    </Layout>
  );
}
