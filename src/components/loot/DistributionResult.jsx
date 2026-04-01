import { useEffect, useState } from "react";

export default function DistributionResult({ result, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 등장 애니메이션
    const timer = setTimeout(() => setVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 200);
  };

  if (!result) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
                  transition-all duration-200 ${
                    visible ? "bg-black/60 opacity-100" : "bg-black/0 opacity-0"
                  }`}
      onClick={handleClose}
    >
      <div
        className={`bg-ff-surface border border-ff-blue/30 rounded-xl p-6 max-w-sm w-full
                    shadow-2xl transition-all duration-200 ${
                      visible
                        ? "scale-100 translate-y-0"
                        : "scale-95 translate-y-4"
                    }`}
        onClick={(e) => e.stopPropagation()}
      >
        {result.winner ? (
          <div className="text-center">
            {/* 축하 이모지 */}
            <div className="text-6xl mb-4 animate-bounce">🎉</div>

            {/* 아이템 이름 */}
            <p className="text-ff-muted text-sm mb-1">{result.itemName}</p>

            {/* 당첨자 */}
            <h2 className="text-2xl font-bold text-ff-gold mb-2">
              {result.winner.nickname}
            </h2>
            <p className="text-green-300 font-medium mb-4">
              획득 축하합니다! 🏆
            </p>

            {/* 분배 사유 */}
            <div className="bg-ff-dark rounded-lg p-3 mb-4">
              <p className="text-ff-muted text-xs">{result.reason}</p>
              {result.dkpSpent > 0 && (
                <p className="text-ff-gold text-xs mt-1">
                  💰 DKP {result.dkpSpent} 소비
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-5xl mb-4">🗑️</div>
            <p className="text-ff-muted text-sm mb-1">{result.itemName}</p>
            <h2 className="text-xl font-bold text-gray-300 mb-2">폐기 처리</h2>
            <div className="bg-ff-dark rounded-lg p-3 mb-4">
              <p className="text-ff-muted text-xs">{result.reason}</p>
            </div>
          </div>
        )}

        <button
          onClick={handleClose}
          className="w-full py-2.5 bg-ff-blue text-white rounded-lg font-medium
                     hover:bg-ff-blue/80 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}
