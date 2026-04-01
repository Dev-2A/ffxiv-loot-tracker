import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="bg-ff-deeper border-b border-ff-blue/30">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🎮</span>
          <h1 className="text-lg font-bold text-ff-gold">전리품 분배 도우미</h1>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-ff-muted">
          <Link to="/" className="hover:text-ff-text transition-colors">
            홈
          </Link>
          <a
            href="https://github.com/Dev-2A/ffxiv-loot-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ff-text transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
