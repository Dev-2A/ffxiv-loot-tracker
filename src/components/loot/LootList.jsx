import LootItemCard from "./LootItemCard";

export default function LootList({
  items,
  isHost,
  selectedItemId,
  onSelect,
  onDelete,
}) {
  const biddingItems = items.filter((i) => i.status === "bidding");
  const distributedItems = items.filter((i) => i.status === "distributed");
  const discardedItems = items.filter((i) => i.status === "discarded");

  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-ff-muted">
        <p className="text-4xl mb-2">⚔️</p>
        <p>등록된 전리품이 없습니다.</p>
        {isHost && (
          <p className="text-sm mt-1">위에서 아이템을 추가해주세요!</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 입찰중 아이템 */}
      {biddingItems.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-yellow-300 mb-2">
            🎯 입찰중 ({biddingItems.length})
          </h3>
          <div className="space-y-2">
            {biddingItems.map((item) => (
              <LootItemCard
                key={item.id}
                item={item}
                isHost={isHost}
                isSelected={selectedItemId === item.id}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 분배완료 아이템 */}
      {distributedItems.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-green-300 mb-2">
            ✅ 분배완료 ({distributedItems.length})
          </h3>
          <div className="space-y-2">
            {distributedItems.map((item) => (
              <LootItemCard
                key={item.id}
                item={item}
                isHost={isHost}
                isSelected={selectedItemId === item.id}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}

      {/* 폐기 아이템 */}
      {discardedItems.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-400 mb-2">
            🗑️ 폐기 ({discardedItems.length})
          </h3>
          <div className="space-y-2">
            {discardedItems.map((item) => (
              <LootItemCard
                key={item.id}
                item={item}
                isHost={isHost}
                isSelected={selectedItemId === item.id}
                onSelect={onSelect}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
