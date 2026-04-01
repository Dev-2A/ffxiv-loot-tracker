import { Link, useLocation } from "react-router-dom";
import { useRoom } from "../../contexts/RoomContext";

export default function Header() {
  const location = useLocation();
  const { room } = useRoom();

  const isInRoom = location.pathname.startsWith("/room/");

  return (
    <header className="bg-ff-deeper border-b border-ff-blue/30 sticky top-0 z-40 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-2xl">🎮</span>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-ff-gold leading-tight">
              전리품 분배 도우미
            </h1>
            {isInRoom && room?.name && (
              <p className="text-xs text-ff-muted leading-tight hidden sm:block">
                {room.name}
              </p>
            )}
          </div>
        </Link>
        <nav className="flex items-center gap-3 sm:gap-4 text-sm text-ff-muted">
          {isInRoom && (
            <Link
              to="/"
              className="hover:text-ff-text transition-colors text-xs sm:text-sm"
            >
              🏠 홈
            </Link>
          )}
          <a
            href="https://github.com/Dev-2A/ffxiv-loot-tracker"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ff-text transition-colors text-xs sm:text-sm"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
