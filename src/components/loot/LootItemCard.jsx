const TYPE_ICONS = {
  weapon: "🗡️",
  gear: "🛡️",
  accessory: "💍",
  material: "🧱",
  other: "📦",
};

const STATUS_STYLES = {
  bidding: { label: "입찰중", color: "bg-yellow-900/30 text-yellow-300" },
  distributed: { label: "분배완료", color: "bg-green-900/30 text-green-300" },
  discarded: { label: "폐기", color: "bg-gray-900/30 text-gray-300" },
};

export default function LootItemCard({
  item,
  isHost,
  isSelected,
  onSelect,
  onDelete,
}) {
  const icon = TYPE_ICONS[item.item_type] || "📦";
  const status = STATUS_STYLES[item.status] || STATUS_STYLES.bidding;

  return (
    <div
      onClick={() => onSelect(item)}
      className={`relative flex items-center gap-3 p-3 rounded-lg border cursor-pointer
                  transition-all hover:border-ff-accent/50 ${
                    isSelected
                      ? "border-ff-accent bg-ff-accent/10"
                      : "border-ff-blue/30 bg-ff-surface"
                  }`}
    >
      {/* 아이콘 */}
      <span className="text-2xl">{icon}</span>

      {/* 아이템 정보 */}
      <div className="flex-1 min-w-0">
        <div className="font-medium text-ff-text truncate">{item.name}</div>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-medium ${status.color}`}
          >
            {status.label}
          </span>
          {item.winner?.nickname && (
            <span className="text-xs text-ff-gold">
              🏆 {item.winner.nickname}
            </span>
          )}
        </div>
      </div>

      {/* 삭제 버튼 (방장 + 입찰중 아이템만) */}
      {isHost && item.status === "bidding" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
          className="p-1.5 text-ff-muted hover:text-red-400 hover:bg-red-900/20
                     rounded transition-colors"
          title="아이템 삭제"
        >
          🗑️
        </button>
      )}
    </div>
  );
}
