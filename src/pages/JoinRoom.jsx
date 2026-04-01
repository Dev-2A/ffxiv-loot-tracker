import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, joinRoom } from "../lib/rooms";
import { useRoom } from "../contexts/RoomContext";

export default function JoinRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { setRoom, setCurrentUser, setIsHost } = useRoom();

  const [roomInfo, setRoomInfo] = useState(null);
  const [nickname, setNickname] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");

  // 방 정보 미리 로드
  useEffect(() => {
    async function loadRoomInfo() {
      if (!roomId) {
        navigate("/");
        return;
      }

      const { room, error: roomError } = await getRoom(roomId);
      if (roomError || !room) {
        setError("존재하지 않는 방입니다.");
        setPageLoading(false);
        return;
      }

      // 이미 입장한 유저인지 localStorage 확인
      const saved = localStorage.getItem(`member_${roomId}`);
      if (saved) {
        const savedMember = JSON.parse(saved);
        setRoom(room);
        setCurrentUser(savedMember);
        setIsHost(savedMember.is_host);
        navigate(`/room/${roomId}`, { replace: true });
        return;
      }

      setRoomInfo(room);
      setPageLoading(false);
    }
    loadRoomInfo();
  }, [roomId, navigate, setRoom, setCurrentUser, setIsHost]);

  const handleJoin = async (e) => {
    e.preventDefault();
    setError("");

    if (!nickname.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const { member, error: joinError } = await joinRoom(
      roomId,
      nickname.trim(),
    );

    if (joinError) {
      setError(joinError.message || "입장에 실패했습니다.");
      setIsLoading(false);
      return;
    }

    // Context에 저장
    setRoom(roomInfo);
    setCurrentUser(member);
    setIsHost(member.is_host);

    // localStorage에 저장 (새로고침 대비)
    localStorage.setItem(`member_${roomId}`, JSON.stringify(member));

    // 방 페이지로 이동
    navigate(`/room/${roomId}`, { replace: true });
  };

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-ff-muted text-lg">⏳ 방 정보를 확인하는 중...</div>
      </div>
    );
  }

  if (!roomInfo) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <h2 className="text-6xl mb-4">😢</h2>
        <h1 className="text-2xl font-bold text-ff-gold mb-2">
          방을 찾을 수 없습니다
        </h1>
        <p className="text-ff-muted mb-6">
          링크가 잘못되었거나 이미 삭제된 방입니다.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-ff-blue text-white rounded-lg
                     hover:bg-ff-blue/80 transition-colors"
        >
          홈으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-ff-gold mb-6 text-center">
        🚪 방 참여하기
      </h1>

      {/* 방 정보 카드 */}
      <div className="bg-ff-surface rounded-lg p-4 mb-6 border border-ff-blue/30">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-ff-muted text-sm">방 이름</span>
            <span className="text-ff-text font-medium">{roomInfo.name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ff-muted text-sm">방장</span>
            <span className="text-ff-text">👑 {roomInfo.host_name}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ff-muted text-sm">분배 규칙</span>
            <span className="text-ff-text">
              {roomInfo.rule_type === "lotto"
                ? "🎲 로또"
                : roomInfo.rule_type === "dkp"
                  ? "💰 DKP"
                  : "👑 우선권"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ff-muted text-sm">최대 인원</span>
            <span className="text-ff-text">{roomInfo.max_members}명</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ff-muted text-sm">상태</span>
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                roomInfo.status === "waiting"
                  ? "bg-yellow-900/30 text-yellow-300"
                  : roomInfo.status === "active"
                    ? "bg-green-900/30 text-green-300"
                    : "bg-gray-900/30 text-gray-300"
              }`}
            >
              {roomInfo.status === "waiting"
                ? "⏳ 대기중"
                : roomInfo.status === "active"
                  ? "🎮 진행중"
                  : "✅ 종료"}
            </span>
          </div>
        </div>
      </div>

      {/* 닉네임 입력 폼 */}
      {roomInfo.status === "finished" ? (
        <div className="p-4 bg-gray-900/30 border border-gray-500/50 rounded-lg text-center text-gray-300">
          이미 종료된 방입니다. 새로운 방을 만들어주세요.
        </div>
      ) : (
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-ff-text mb-2">
              닉네임 입력
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="예: 빛의전사"
              maxLength={20}
              autoFocus
              className="w-full px-4 py-3 bg-ff-surface border border-ff-blue/30 rounded-lg
                         text-ff-text placeholder-ff-muted
                         focus:outline-none focus:border-ff-accent transition-colors"
            />
            <p className="mt-1 text-xs text-ff-muted">
              같은 닉네임으로 재접속하면 기존 상태가 복원됩니다.
            </p>
          </div>

          {error && (
            <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
              ❌ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-ff-accent text-white font-bold rounded-lg text-lg
                       hover:bg-ff-accent/80 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "입장 중..." : "🎮 입장하기"}
          </button>
        </form>
      )}
    </div>
  );
}
