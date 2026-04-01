import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function JoinDirect() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const trimmed = roomCode.trim();

    if (!trimmed) {
      setError("방 코드 또는 초대 링크를 입력해주세요.");
      return;
    }

    // URL에서 roomId 추출 시도
    let roomId = trimmed;

    // 전체 URL이 입력된 경우
    if (trimmed.includes("/join/")) {
      roomId = trimmed.split("/join/").pop();
    } else if (trimmed.includes("/room/")) {
      roomId = trimmed.split("/room/").pop();
    }

    // UUID 형식 간단 검증 (8-4-4-4-12)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(roomId)) {
      setError("올바른 방 코드 형식이 아닙니다.");
      return;
    }

    navigate(`/join/${roomId}`);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-ff-gold mb-6 text-center">
        🚪 방 참여하기
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-ff-text mb-2">
            방 코드 또는 초대 링크
          </label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            placeholder="초대 링크 또는 방 코드(UUID)를 붙여넣기"
            autoFocus
            className="w-full px-4 py-3 bg-ff-surface border border-ff-blue/30 rounded-lg
                       text-ff-text placeholder-ff-muted
                       focus:outline-none focus:border-ff-accent transition-colors"
          />
          <p className="mt-1 text-xs text-ff-muted">
            방장에게 받은 초대 링크를 그대로 붙여넣으면 됩니다.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
            ❌ {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 bg-ff-blue text-white font-bold rounded-lg text-lg
                     hover:bg-ff-blue/80 transition-colors
                     border border-ff-blue/50"
        >
          🔍 방 찾기
        </button>
      </form>
    </div>
  );
}
