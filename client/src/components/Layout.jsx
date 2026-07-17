import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ children, showFooter = true }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Navbar />
      <main className="flex-1">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}
