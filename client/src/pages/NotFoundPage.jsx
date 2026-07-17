import { Link } from 'react-router-dom';
import Layout from '../components/Layout';

export default function NotFoundPage() {
  return (
    <Layout>
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
        <span className="eyebrow">404</span>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-ink-950">Page not found</h1>
        <p className="mt-2 text-sm text-text-secondary">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-accent mt-6 px-5 py-2.5">
          Back home
        </Link>
      </div>
    </Layout>
  );
}
