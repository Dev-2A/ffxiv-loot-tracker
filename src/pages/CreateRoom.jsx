import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom } from "../lib/rooms";
import { useRoom } from "../contexts/RoomContext";

const RULE_OPTIONS = [
  {
    value: "lotto",
    label: "🎲 로또 (랜덤)",
    description: "Need를 선택한 사람 중 랜덤으로 당첨자 결정",
  },
  {
    value: "dkp",
    label: "💰 DKP (포인트)",
    description: "DKP 포인트를 소비하여 입찰, 최고 입찰자가 획득",
  },
  {
    value: "priority",
    label: "👑 우선권 (순번)",
    description: "미리 정한 우선순위에 따라 순서대로 분배",
  },
];

const MEMBER_OPTIONS = [2, 4, 8, 16, 24];

export default function CreateRoom() {
  const navigate = useNavigate();
  const { setRoom, setCurrentUser, setIsHost } = useRoom();

  const [roomName, setRoomName] = useState("");
  const [hostName, setHostName] = useState("");
  const [ruleType, setRuleType] = useState("lotto");
  const [maxMembers, setMaxMembers] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!roomName.trim()) {
      setError("방 이름을 입력해주세요.");
      return;
    }
    if (!hostName.trim()) {
      setError("닉네임을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    const {
      room,
      host,
      error: createError,
    } = await createRoom({
      name: roomName.trim(),
      hostName: hostName.trim(),
      ruleType,
      maxMembers,
    });

    if (createError) {
      setError("방 생성에 실패했습니다: " + createError.message);
      setIsLoading(false);
      return;
    }

    // Context에 방 정보 저장
    setRoom(room);
    setCurrentUser(host);
    setIsHost(true);

    // localStorage에도 저장 (새로고침 대비)
    localStorage.setItem(`member_${room.id}`, JSON.stringify(host));

    // 방 페이지로 이동
    navigate(`/room/${room.id}`);
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-ff-gold mb-6 text-center">
        🏠 새 방 만들기
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 방 이름 */}
        <div>
          <label className="block text-sm font-medium text-ff-text mb-2">
            방 이름
          </label>
          <input
            type="text"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            placeholder="예: 아르카디아 영웅 4층"
            maxLength={50}
            className="w-full px-4 py-3 bg-ff-surface border border-ff-blue/30 rounded-lg
                       text-ff-text placeholder-ff-muted
                       focus:outline-none focus:border-ff-accent transition-colors"
          />
        </div>

        {/* 방장 닉네임 */}
        <div>
          <label className="block text-sm font-medium text-ff-text mb-2">
            내 닉네임
          </label>
          <input
            type="text"
            value={hostName}
            onChange={(e) => setHostName(e.target.value)}
            placeholder="예: 빛의전사"
            maxLength={20}
            className="w-full px-4 py-3 bg-ff-surface border border-ff-blue/30 rounded-lg
                       text-ff-text placeholder-ff-muted
                       focus:outline-none focus:border-ff-accent transition-colors"
          />
        </div>

        {/* 분배 규칙 */}
        <div>
          <label className="block text-sm font-medium text-ff-text mb-2">
            분배 규칙
          </label>
          <div className="space-y-2">
            {RULE_OPTIONS.map((option) => (
              <label
                key={option.value}
                className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  ruleType === option.value
                    ? "border-ff-accent bg-ff-accent/10"
                    : "border-ff-blue/30 bg-ff-surface hover:border-ff-blue/50"
                }`}
              >
                <input
                  type="radio"
                  name="ruleType"
                  value={option.value}
                  checked={ruleType === option.value}
                  onChange={(e) => setRuleType(e.target.value)}
                  className="mt-1 accent-ff-accent"
                />
                <div>
                  <div className="font-medium text-ff-text">{option.label}</div>
                  <div className="text-sm text-ff-muted">
                    {option.description}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* 최대 인원 */}
        <div>
          <label className="block text-sm font-medium text-ff-text mb-2">
            최대 인원
          </label>
          <div className="flex gap-2">
            {MEMBER_OPTIONS.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setMaxMembers(num)}
                className={`flex-1 py-2 rounded-lg font-medium text-sm transition-colors ${
                  maxMembers === num
                    ? "bg-ff-accent text-white"
                    : "bg-ff-surface text-ff-muted border border-ff-blue/30 hover:border-ff-blue/50"
                }`}
              >
                {num}명
              </button>
            ))}
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="p-3 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 text-sm">
            ❌ {error}
          </div>
        )}

        {/* 생성 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-ff-accent text-white font-bold rounded-lg text-lg
                     hover:bg-ff-accent/80 transition-colors
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "생성 중..." : "🎮 방 만들기"}
        </button>
      </form>
    </div>
  );
}
