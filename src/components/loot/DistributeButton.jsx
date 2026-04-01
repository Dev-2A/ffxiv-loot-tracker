import { useState } from "react";
import { distribute } from "../../utils/distributor";
import {
  getBidsForItem,
  recordDistribution,
  deductDKP,
  discardLootItem,
} from "../../lib/loot";

export default function DistributeButton({
  item,
  members,
  ruleType,
  roomId,
  onDistributed,
}) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  const handleDistribute = async () => {
    if (isProcessing) return;

    // 입찰 현황 최신 조회
    const { bids } = await getBidsForItem(item.id);

    if (bids.length === 0) {
      alert("아직 아무도 입찰하지 않았습니다.");
      return;
    }

    const allPass = bids.every((b) => b.bid_type === "pass");
    if (allPass) {
      const doDiscard = confirm("모두 패스했습니다. 이 아이템을 폐기할까요?");
      if (doDiscard) {
        await discardLootItem(item.id);
        if (onDistributed) onDistributed();
      }
      return;
    }

    setIsProcessing(true);

    // 분배 엔진 실행
    const { winnerId, reason, dkpSpent } = distribute(ruleType, bids, members);

    if (!winnerId) {
      setResult({ winner: null, reason });
      setIsProcessing(false);
      return;
    }

    // DB에 분배 결과 기록
    const { error } = await recordDistribution({
      roomId,
      lootItemId: item.id,
      winnerId,
      ruleUsed: ruleType,
      reason,
      dkpSpent: dkpSpent || 0,
    });

    if (error) {
      alert("분배 기록 실패: " + error.message);
      setIsProcessing(false);
      return;
    }

    // DKP 모드면 포인트 차감
    if (ruleType === "dkp" && dkpSpent > 0) {
      await deductDKP(winnerId, dkpSpent);
    }

    const winnerMember = members.find((m) => m.id === winnerId);
    setResult({
      winner: winnerMember,
      reason,
      dkpSpent: dkpSpent || 0,
    });

    if (onDistributed) onDistributed();
    setIsProcessing(false);
  };

  return (
    <div className="mt-4">
      {/* 분배 결과 */}
      {result && (
        <div
          className={`mb-3 p-3 rounded-lg border ${
            result.winner
              ? "bg-green-900/20 border-green-500/30"
              : "bg-gray-900/20 border-gray-500/30"
          }`}
        >
          {result.winner ? (
            <div className="text-center">
              <p className="text-2xl mb-1">🎉</p>
              <p className="text-green-300 font-bold text-lg">
                {result.winner.nickname} 획득!
              </p>
              <p className="text-ff-muted text-xs mt-1">{result.reason}</p>
              {result.dkpSpent > 0 && (
                <p className="text-ff-gold text-xs mt-1">
                  💰 DKP {result.dkpSpent} 소비
                </p>
              )}
            </div>
          ) : (
            <p className="text-gray-300 text-center text-sm">{result.reason}</p>
          )}
        </div>
      )}

      {/* 분배 실행 버튼 */}
      {item.status === "bidding" && (
        <button
          onClick={handleDistribute}
          disabled={isProcessing}
          className="w-full py-2.5 bg-ff-gold text-ff-dark font-bold rounded-lg
                     hover:bg-ff-gold/80 transition-colors text-sm
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isProcessing
            ? "⏳ 분배 중..."
            : `⚖️ 분배 실행 (${
                ruleType === "lotto"
                  ? "로또"
                  : ruleType === "dkp"
                    ? "DKP"
                    : "우선권"
              })`}
        </button>
      )}
    </div>
  );
}
