import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { ArrowRight, Loader2 } from 'lucide-react';
import Layout from '../components/Layout';
import Logo from '../components/Logo';
import { useAuth } from '../context/AuthContext';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Enter your password'),
});

export default function LoginPage() {
  const { login, loginAsGuest } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [guestLoading, setGuestLoading] = useState(false);
  const redirectTo = location.state?.from?.pathname || '/dashboard';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success('Welcome back');
      navigate(redirectTo);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleGuest = async () => {
    setGuestLoading(true);
    try {
      await loginAsGuest();
      toast.success('Continuing as guest');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo className="mb-6" />
            <h1 className="text-xl font-semibold tracking-tight text-ink-950">Welcome back</h1>
            <p className="mt-1.5 text-sm text-text-secondary">Log in to continue your practice.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="card space-y-4 p-6">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input id="email" type="email" className="input" placeholder="you@example.com" {...register('email')} />
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <input id="password" type="password" className="input" placeholder="••••••••" {...register('password')} />
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting} className="btn-accent w-full py-2.5">
              {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <>Log in <ArrowRight size={15} /></>}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 text-xs text-text-tertiary">
            <span className="h-px flex-1 bg-line" />
            or
            <span className="h-px flex-1 bg-line" />
          </div>

          <button onClick={handleGuest} disabled={guestLoading} className="btn-secondary w-full py-2.5">
            {guestLoading ? <Loader2 size={16} className="animate-spin" /> : 'Continue as guest'}
          </button>

          <p className="mt-6 text-center text-sm text-text-secondary">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-accent hover:text-accent-600">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
