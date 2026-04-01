import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h2 className="text-6xl mb-4">🔍</h2>
      <h1 className="text-2xl font-bold text-ff-gold mb-2">
        페이지를 찾을 수 없습니다
      </h1>
      <p className="text-ff-muted mb-6">
        존재하지 않는 방이거나 잘못된 경로입니다.
      </p>
      <Link
        to="/"
        className="px-6 py-2 bg-ff-blue text-white rounded-lg
                   hover:bg-ff-blue/80 transition-colors"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}
