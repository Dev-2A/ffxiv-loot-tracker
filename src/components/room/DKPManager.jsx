import { useState } from "react";
import { setDKP, grantDKPToAll, resetDKPAll } from "../../lib/dkp";

export default function DKPManager({
  roomId,
  members,
  isHost,
  currentUser,
  onUpdate,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState(0);
  const [grantAmount, setGrantAmount] = useState(10);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // 개별 DKP 수정
  const handleSave = async (memberId) => {
    setIsProcessing(true);
    const { error } = await setDKP(memberId, editValue);
    if (error) {
      alert("DKP 수정 실패: " + error.message);
    } else {
      setEditingId(null);
      if (onUpdate) await onUpdate();
    }
    setIsProcessing(false);
  };

  // 전체 일괄 지급
  const handleGrantAll = async () => {
    if (grantAmount <= 0) return;
    setIsProcessing(true);
    const { error } = await grantDKPToAll(roomId, grantAmount);
    if (error) {
      alert("일괄 지급 실패: " + error.message);
    } else {
      if (onUpdate) await onUpdate();
    }
    setIsProcessing(false);
  };

  // 전체 초기화
  const handleResetAll = async () => {
    const points = prompt("초기 DKP 값을 입력하세요 (기본: 100)", "100");
    if (points === null) return;

    const num = parseInt(points, 10);
    if (isNaN(num) || num < 0) {
      alert("올바른 숫자를 입력해주세요.");
      return;
    }

    setIsProcessing(true);
    const { error } = await resetDKPAll(roomId, num);
    if (error) {
      alert("초기화 실패: " + error.message);
    } else {
      if (onUpdate) await onUpdate();
    }
    setIsProcessing(false);
  };

  // DKP 랭킹 순 정렬
  const sorted = [...members].sort((a, b) => b.dkp_points - a.dkp_points);
  const maxDKP = sorted.length > 0 ? sorted[0].dkp_points : 1;

  return (
    <div className="bg-ff-surface rounded-lg border border-ff-blue/30">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 pb-2">
        <h2 className="text-sm font-bold text-ff-text">💰 DKP 포인트</h2>
        {isHost && (
          <button
            onClick={() => setShowControls(!showControls)}
            className="text-xs text-ff-muted hover:text-ff-text transition-colors"
          >
            {showControls ? "▲ 관리 닫기" : "⚙️ 관리"}
          </button>
        )}
      </div>

      {/* 방장 관리 컨트롤 */}
      {isHost && showControls && (
        <div className="px-4 pb-3 space-y-2 border-b border-ff-blue/20">
          {/* 일괄 지급 */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={grantAmount}
              onChange={(e) => setGrantAmount(Number(e.target.value))}
              className="w-20 px-2 py-1 bg-ff-dark border border-ff-blue/30 rounded
                         text-ff-text text-xs text-center
                         focus:outline-none focus:border-ff-accent"
            />
            <button
              onClick={handleGrantAll}
              disabled={isProcessing}
              className="flex-1 px-3 py-1 bg-green-700 text-white rounded text-xs font-medium
                         hover:bg-green-600 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              전체 지급
            </button>
          </div>

          {/* 초기화 */}
          <button
            onClick={handleResetAll}
            disabled={isProcessing}
            className="w-full px-3 py-1 bg-gray-600 text-white rounded text-xs font-medium
                       hover:bg-gray-500 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            🔄 전체 초기화
          </button>
        </div>
      )}

      {/* DKP 랭킹 */}
      <div className="p-4 pt-3 space-y-1.5">
        {sorted.map((member, index) => (
          <div
            key={member.id}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
              member.id === currentUser?.id
                ? "bg-ff-accent/20 border border-ff-accent/50"
                : "bg-ff-dark border border-ff-blue/20"
            }`}
          >
            {/* 순위 */}
            <span className="text-xs text-ff-muted w-5 text-center">
              {index === 0
                ? "🥇"
                : index === 1
                  ? "🥈"
                  : index === 2
                    ? "🥉"
                    : `${index + 1}`}
            </span>

            {/* 닉네임 */}
            <span className="flex-1 text-ff-text truncate">
              {member.is_host && "👑 "}
              {member.nickname}
              {member.id === currentUser?.id && " (나)"}
            </span>

            {/* DKP 바 + 포인트 */}
            {editingId === member.id ? (
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  min={0}
                  value={editValue}
                  onChange={(e) => setEditValue(Number(e.target.value))}
                  className="w-16 px-2 py-0.5 bg-ff-surface border border-ff-accent rounded
                             text-ff-text text-xs text-center focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => handleSave(member.id)}
                  disabled={isProcessing}
                  className="px-2 py-0.5 bg-ff-accent text-white rounded text-xs
                             disabled:opacity-50"
                >
                  ✓
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-2 py-0.5 bg-gray-600 text-white rounded text-xs"
                >
                  ✗
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* 미니 바 */}
                <div className="w-16 h-1.5 bg-ff-blue/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-ff-gold rounded-full transition-all duration-300"
                    style={{
                      width: `${maxDKP > 0 ? (member.dkp_points / maxDKP) * 100 : 0}%`,
                    }}
                  />
                </div>
                {/* 숫자 */}
                <span
                  className={`text-ff-gold text-xs font-medium w-10 text-right ${
                    isHost ? "cursor-pointer hover:underline" : ""
                  }`}
                  onClick={() => {
                    if (isHost) {
                      setEditingId(member.id);
                      setEditValue(member.dkp_points);
                    }
                  }}
                >
                  {member.dkp_points}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
