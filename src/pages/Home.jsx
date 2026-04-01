import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    icon: "🏠",
    title: "URL 공유로 간편 참여",
    desc: "방을 만들고 링크만 보내면 끝",
  },
  { icon: "🎯", title: "Need / Greed / Pass", desc: "실시간 입찰 투표 시스템" },
  { icon: "⚖️", title: "자동 분배 규칙", desc: "DKP · 로또 · 우선권 지원" },
  { icon: "🔄", title: "실시간 동기화", desc: "Supabase Realtime 멀티유저" },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center animate-fade-in">
      <h2 className="text-6xl mb-6">🎮</h2>
      <h1 className="text-3xl sm:text-4xl font-bold text-ff-gold mb-3">
        FFXIV 전리품 분배 도우미
      </h1>
      <p className="text-ff-muted mb-8 max-w-md text-sm sm:text-base leading-relaxed">
        레이드 전리품을 실시간으로 입찰하고 공정하게 분배하세요.
        <br />
        방을 만들고 URL만 공유하면 끝!
      </p>

      {/* CTA 버튼 */}
      <div className="flex flex-col sm:flex-row gap-3 mb-12 w-full max-w-sm">
        <button
          onClick={() => navigate("/create")}
          className="flex-1 px-6 py-3.5 bg-ff-accent text-white font-bold rounded-lg
                     hover:bg-ff-accent/80 transition-all text-lg
                     hover:shadow-lg hover:shadow-ff-accent/20
                     active:scale-[0.98]"
        >
          🏠 방 만들기
        </button>
        <button
          onClick={() => navigate("/join")}
          className="flex-1 px-6 py-3.5 bg-ff-blue text-white font-bold rounded-lg
                     hover:bg-ff-blue/80 transition-all text-lg
                     border border-ff-blue/50
                     active:scale-[0.98]"
        >
          🚪 참여하기
        </button>
      </div>

      {/* 기능 카드 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl">
        {FEATURES.map((f, i) => (
          <div
            key={i}
            className="bg-ff-surface border border-ff-blue/20 rounded-lg p-4
                       hover:border-ff-blue/40 transition-colors"
          >
            <span className="text-2xl">{f.icon}</span>
            <h3 className="text-sm font-medium text-ff-text mt-2">{f.title}</h3>
            <p className="text-xs text-ff-muted mt-1">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
