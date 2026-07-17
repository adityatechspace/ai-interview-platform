import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <div className="container-page flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <Logo />
        <p className="text-sm text-text-tertiary">© {new Date().getFullYear()} Prepwise. Practice makes prepared.</p>
      </div>
    </footer>
  );
}
