import { useState } from "react";
import { distribute } from "../../utils/distributor";
import {
  getBidsForItem,
  recordDistribution,
  deductDKP,
  discardLootItem,
} from "../../lib/loot";
import DistributionResult from "./DistributionResult";

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
        setResult({
          winner: null,
          itemName: item.name,
          reason: "모두 패스하여 폐기되었습니다.",
        });
        if (onDistributed) onDistributed();
      }
      return;
    }

    setIsProcessing(true);

    const { winnerId, reason, dkpSpent } = distribute(ruleType, bids, members);

    if (!winnerId) {
      setResult({
        winner: null,
        itemName: item.name,
        reason,
      });
      setIsProcessing(false);
      return;
    }

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

    if (ruleType === "dkp" && dkpSpent > 0) {
      await deductDKP(winnerId, dkpSpent);
    }

    const winnerMember = members.find((m) => m.id === winnerId);
    setResult({
      winner: winnerMember,
      itemName: item.name,
      reason,
      dkpSpent: dkpSpent || 0,
    });

    if (onDistributed) onDistributed();
    setIsProcessing(false);
  };

  return (
    <div className="mt-4">
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

      {/* 결과 모달 */}
      {result && (
        <DistributionResult result={result} onClose={() => setResult(null)} />
      )}
    </div>
  );
}
