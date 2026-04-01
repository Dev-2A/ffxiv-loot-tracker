export default function Footer() {
  return (
    <footer className="bg-ff-deeper border-t border-ff-blue/30 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-ff-muted">
        <p>
          🎮 FFXIV 전리품 분배 도우미 — Made by{" "}
          <a
            href="https://github.com/Dev-2A"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ff-gold hover:underline"
          >
            Dev-2A
          </a>
        </p>
        <p className="mt-1 text-xs">
          FINAL FANTASY XIV © SQUARE ENIX CO., LTD. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
