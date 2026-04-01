import { useState, useEffect, useCallback } from "react";
import { placeBid, getBidsForItem } from "../../lib/loot";
import useRealtimeBids from "../../hooks/useRealtimeBids";
import DistributeButton from "./DistributeButton";

const BID_OPTIONS = [
  {
    value: "need",
    label: "🙋 Need",
    color: "bg-ff-accent hover:bg-ff-accent/80",
    description: "이 아이템이 필요합니다",
  },
  {
    value: "greed",
    label: "🤑 Greed",
    color: "bg-ff-gold/80 hover:bg-ff-gold/60 text-ff-dark",
    description: "있으면 좋겠습니다",
  },
  {
    value: "pass",
    label: "🚫 Pass",
    color: "bg-gray-600 hover:bg-gray-500",
    description: "패스합니다",
  },
];

export default function BidPanel({
  item,
  currentUser,
  members,
  ruleType,
  roomId,
  isHost,
  onBidsUpdate,
  onDistributed,
}) {
  const [bids, setBids] = useState([]);
  const [myBid, setMyBid] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dkpAmount, setDkpAmount] = useState(0);

  // 입찰 현황 로드
  const loadBids = useCallback(async () => {
    const { bids: bidList } = await getBidsForItem(item.id);
    setBids(bidList);

    const mine = bidList.find((b) => b.member_id === currentUser?.id);
    setMyBid(mine || null);

    if (onBidsUpdate) onBidsUpdate(bidList);
  }, [item.id, currentUser?.id, onBidsUpdate]);

  useEffect(() => {
    loadBids();
  }, [loadBids]);

  useRealtimeBids(
    item.id,
    useCallback(() => {
      loadBids();
    }, [loadBids]),
  );

  // 입찰 제출
  const handleBid = async (bidType) => {
    if (!currentUser || isSubmitting) return;
    setIsSubmitting(true);

    const { error } = await placeBid(item.id, currentUser.id, bidType);
    if (error) {
      alert("입찰 실패: " + error.message);
      setIsSubmitting(false);
      return;
    }

    await loadBids();
    setIsSubmitting(false);
  };

  // 입찰 현황에서 멤버별 상태 계산
  const getBidStatus = (memberId) => {
    const bid = bids.find((b) => b.member_id === memberId);
    if (!bid) return { label: "⏳ 미응답", color: "text-ff-muted" };
    switch (bid.bid_type) {
      case "need":
        return { label: "🙋 Need", color: "text-ff-accent" };
      case "greed":
        return { label: "🤑 Greed", color: "text-ff-gold" };
      case "pass":
        return { label: "🚫 Pass", color: "text-gray-400" };
      default:
        return { label: "⏳ 미응답", color: "text-ff-muted" };
    }
  };

  const needCount = bids.filter((b) => b.bid_type === "need").length;
  const greedCount = bids.filter((b) => b.bid_type === "greed").length;
  const passCount = bids.filter((b) => b.bid_type === "pass").length;
  const respondedCount = bids.length;
  const totalMembers = members.length;

  return (
    <div className="mt-4 p-4 bg-ff-dark rounded-lg border border-ff-accent/30">
      {/* 아이템 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-ff-accent">🎯 {item.name}</h3>
        <span className="text-xs text-ff-muted">
          {respondedCount}/{totalMembers}명 응답
        </span>
      </div>

      {/* 입찰 요약 바 */}
      <div className="flex gap-3 mb-4 text-xs">
        <span className="text-ff-accent font-medium">🙋 Need: {needCount}</span>
        <span className="text-ff-gold font-medium">🤑 Greed: {greedCount}</span>
        <span className="text-gray-400 font-medium">🚫 Pass: {passCount}</span>
      </div>

      {/* 내 입찰 상태 + 버튼 */}
      {item.status === "bidding" && (
        <div className="mb-4">
          {myBid ? (
            <div className="mb-3 p-2 bg-ff-surface rounded-lg text-sm">
              <span className="text-ff-muted">내 선택: </span>
              <span
                className={getBidStatus(currentUser.id).color + " font-medium"}
              >
                {getBidStatus(currentUser.id).label}
              </span>
              <span className="text-ff-muted text-xs ml-2">
                (다시 클릭하면 변경)
              </span>
            </div>
          ) : (
            <p className="text-ff-muted text-sm mb-3">
              아래에서 입찰 또는 패스를 선택하세요.
            </p>
          )}

          {/* DKP 입찰 금액 (DKP 모드일 때만) */}
          {ruleType === "dkp" && (
            <div className="mb-3">
              <label className="block text-xs text-ff-muted mb-1">
                DKP 입찰 금액 (보유:{" "}
                {members.find((m) => m.id === currentUser.id)?.dkp_points ?? 0}{" "}
                DKP)
              </label>
              <input
                type="number"
                min={0}
                max={
                  members.find((m) => m.id === currentUser.id)?.dkp_points ?? 0
                }
                value={dkpAmount}
                onChange={(e) => setDkpAmount(Number(e.target.value))}
                className="w-full px-3 py-2 bg-ff-surface border border-ff-blue/30 rounded-lg
                           text-ff-text text-sm focus:outline-none focus:border-ff-accent"
              />
            </div>
          )}

          {/* 입찰 버튼들 */}
          <div className="flex gap-2">
            {BID_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleBid(option.value)}
                disabled={isSubmitting}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium text-white
                           transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                           ${option.color} ${
                             myBid?.bid_type === option.value
                               ? "ring-2 ring-white ring-offset-2 ring-offset-ff-dark"
                               : ""
                           }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 멤버별 입찰 현황 */}
      <div>
        <h4 className="text-xs font-medium text-ff-muted mb-2">
          📋 멤버별 현황
        </h4>
        <div className="space-y-1">
          {members.map((member) => {
            const status = getBidStatus(member.id);
            return (
              <div
                key={member.id}
                className="flex items-center justify-between px-3 py-1.5 bg-ff-surface rounded text-sm"
              >
                <span className="text-ff-text">
                  {member.is_host && "👑 "}
                  {member.nickname}
                  {member.id === currentUser?.id && " (나)"}
                </span>
                <span className={`text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 분배 버튼 (방장만) */}
      {isHost && item.status === "bidding" && (
        <DistributeButton
          item={item}
          members={members}
          ruleType={ruleType}
          roomId={roomId}
          onDistributed={onDistributed}
        />
      )}
    </div>
  );
}
