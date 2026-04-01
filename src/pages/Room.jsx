import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, getRoomMembers } from "../lib/rooms";
import { useRoom } from "../contexts/RoomContext";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {
    room,
    setRoom,
    members,
    setMembers,
    currentUser,
    setCurrentUser,
    setIsHost,
  } = useRoom();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      // 1) 방 정보 로드
      const { room: roomData, error } = await getRoom(roomId);
      if (error || !roomData) {
        navigate("/not-found");
        return;
      }
      setRoom(roomData);

      // 2) 멤버 목록 로드
      const { members: memberList } = await getRoomMembers(roomId);
      setMembers(memberList);

      // 3) localStorage에서 현재 유저 복원
      const saved = localStorage.getItem(`member_${roomId}`);
      if (saved) {
        const savedMember = JSON.parse(saved);
        // DB에 아직 존재하는지 확인
        const found = memberList.find((m) => m.id === savedMember.id);
        if (found) {
          setCurrentUser(found);
          setIsHost(found.is_host);
        }
      }

      setLoading(false);
    }
    loadRoom();
  }, [roomId, navigate, setRoom, setMembers, setCurrentUser, setIsHost]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-ff-muted text-lg">⏳ 방 정보를 불러오는 중...</div>
      </div>
    );
  }

  if (!currentUser) {
    // 아직 입장하지 않은 유저 → 참여 페이지로
    navigate(`/join/${roomId}`);
    return null;
  }

  return (
    <div>
      {/* 방 헤더 */}
      <div className="bg-ff-surface rounded-lg p-4 mb-6 border border-ff-blue/30">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-ff-gold">{room?.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-ff-muted">
              <span>👑 방장: {room?.host_name}</span>
              <span>
                📋 규칙:{" "}
                {room?.rule_type === "lotto"
                  ? "로또"
                  : room?.rule_type === "dkp"
                    ? "DKP"
                    : "우선권"}
              </span>
              <span>
                👥 {members.length}/{room?.max_members}명
              </span>
            </div>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              room?.status === "waiting"
                ? "bg-yellow-900/30 text-yellow-300"
                : room?.status === "active"
                  ? "bg-green-900/30 text-green-300"
                  : "bg-gray-900/30 text-gray-300"
            }`}
          >
            {room?.status === "waiting"
              ? "⏳ 대기중"
              : room?.status === "active"
                ? "🎮 진행중"
                : "✅ 종료"}
          </div>
        </div>
      </div>

      {/* 멤버 목록 */}
      <div className="bg-ff-surface rounded-lg p-4 mb-6 border border-ff-blue/30">
        <h2 className="text-lg font-bold text-ff-text mb-3">👥 참여 멤버</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {members.map((member) => (
            <div
              key={member.id}
              className={`px-3 py-2 rounded-lg text-sm text-center ${
                member.id === currentUser?.id
                  ? "bg-ff-accent/20 border border-ff-accent/50 text-ff-accent"
                  : "bg-ff-dark border border-ff-blue/20 text-ff-text"
              }`}
            >
              {member.is_host && "👑 "}
              {member.nickname}
              {member.id === currentUser?.id && " (나)"}
            </div>
          ))}
        </div>
      </div>

      {/* URL 공유 */}
      <div className="bg-ff-surface rounded-lg p-4 mb-6 border border-ff-blue/30">
        <h2 className="text-lg font-bold text-ff-text mb-3">🔗 초대 링크</h2>
        <div className="flex gap-2">
          <input
            type="text"
            readOnly
            value={`${window.location.origin}/join/${roomId}`}
            className="flex-1 px-3 py-2 bg-ff-dark border border-ff-blue/20 rounded-lg
                       text-ff-muted text-sm"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/join/${roomId}`,
              );
              alert("링크가 복사되었습니다!");
            }}
            className="px-4 py-2 bg-ff-blue text-white rounded-lg text-sm font-medium
                       hover:bg-ff-blue/80 transition-colors"
          >
            복사
          </button>
        </div>
      </div>

      {/* 전리품 영역 (다음 단계에서 구현) */}
      <div className="bg-ff-surface rounded-lg p-8 border border-ff-blue/30 text-center text-ff-muted">
        ⚔️ 전리품 관리 영역 (Step 7에서 구현)
      </div>
    </div>
  );
}
