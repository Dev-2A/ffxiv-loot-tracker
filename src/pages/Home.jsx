import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-5xl mb-4">🎮</h2>
      <h1 className="text-3xl font-bold text-ff-gold mb-2">
        FFXIV 전리품 분배 도우미
      </h1>
      <p className="text-ff-muted mb-8 max-w-md">
        레이드 전리품을 실시간으로 입찰·분배하세요.
        <br />
        방을 만들고 URL만 공유하면 끝!
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate("/create")}
          className="px-8 py-3 bg-ff-accent text-white font-bold rounded-lg
                     hover:bg-ff-accent/80 transition-colors text-lg"
        >
          🏠 방 만들기
        </button>
        <button
          onClick={() => navigate("/join")}
          className="px-8 py-3 bg-ff-blue text-white font-bold rounded-lg
                     hover:bg-ff-blue/80 transition-colors text-lg
                     border border-ff-blue/50"
        >
          🚪 방 참여하기
        </button>
      </div>
    </div>
  );
}
