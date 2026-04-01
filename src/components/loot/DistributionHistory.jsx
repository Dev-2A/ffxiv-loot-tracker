import { useState, useEffect, useCallback } from "react";
import { getDistributionLog } from "../../lib/loot";

const TYPE_ICONS = {
  weapon: "🗡️",
  gear: "🛡️",
  accessory: "💍",
  material: "🧱",
  other: "📦",
};

const RULE_LABELS = {
  lotto: "🎲 로또",
  dkp: "💰 DKP",
  priority: "👑 우선권",
};

export default function DistributionHistory({ roomId, refreshKey }) {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const loadLogs = useCallback(async () => {
    const { logs: logList } = await getDistributionLog(roomId);
    setLogs(logList);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs, refreshKey]);

  // 시간 포맷
  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <div className="bg-ff-surface rounded-lg border border-ff-blue/30">
      {/* 토글 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-ff-blue/10
                   transition-colors rounded-lg"
      >
        <h2 className="text-lg font-bold text-ff-text">
          📜 분배 히스토리
          {logs.length > 0 && (
            <span className="ml-2 text-sm font-normal text-ff-muted">
              ({logs.length}건)
            </span>
          )}
        </h2>
        <span className="text-ff-muted text-lg">{isOpen ? "▲" : "▼"}</span>
      </button>

      {/* 히스토리 목록 */}
      {isOpen && (
        <div className="px-4 pb-4">
          {loading ? (
            <p className="text-ff-muted text-sm py-4 text-center">
              ⏳ 로딩 중...
            </p>
          ) : logs.length === 0 ? (
            <p className="text-ff-muted text-sm py-4 text-center">
              아직 분배된 아이템이 없습니다.
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center gap-3 p-3 bg-ff-dark rounded-lg border border-ff-blue/20"
                >
                  {/* 아이템 아이콘 */}
                  <span className="text-xl">
                    {TYPE_ICONS[log.loot_item?.item_type] || "📦"}
                  </span>

                  {/* 분배 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-ff-text text-sm truncate">
                        {log.loot_item?.name || "알 수 없는 아이템"}
                      </span>
                      <span className="text-xs text-ff-muted">→</span>
                      <span className="text-ff-gold text-sm font-medium">
                        🏆 {log.winner?.nickname || "알 수 없음"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-ff-muted flex-wrap">
                      <span>{RULE_LABELS[log.rule_used] || log.rule_used}</span>
                      {log.reason && (
                        <>
                          <span>·</span>
                          <span>{log.reason}</span>
                        </>
                      )}
                      {log.dkp_spent > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-ff-gold">
                            -{log.dkp_spent} DKP
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 시간 */}
                  <span className="text-xs text-ff-muted whitespace-nowrap">
                    {formatTime(log.created_at)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
