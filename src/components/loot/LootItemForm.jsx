import { useState } from "react";

const ITEM_TYPES = [
  { value: "weapon", label: "🗡️ 무기" },
  { value: "gear", label: "🛡️ 방어구" },
  { value: "accessory", label: "💍 장신구" },
  { value: "material", label: "🧱 재료" },
  { value: "other", label: "📦 기타" },
];

export default function LootItemForm({ onAdd, disabled }) {
  const [name, setName] = useState("");
  const [itemType, setItemType] = useState("gear");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || disabled) return;

    setIsAdding(true);
    await onAdd({ name: name.trim(), itemType });
    setName("");
    setIsAdding(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
      {/* 아이템 종류 선택 */}
      <select
        value={itemType}
        onChange={(e) => setItemType(e.target.value)}
        className="px-3 py-2 bg-ff-dark border border-ff-blue/30 rounded-lg
                   text-ff-text text-sm focus:outline-none focus:border-ff-accent
                   cursor-pointer"
      >
        {ITEM_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </select>

      {/* 아이템 이름 입력 */}
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="아이템 이름 (예: 아르카디아 도끼)"
        maxLength={50}
        className="flex-1 px-3 py-2 bg-ff-dark border border-ff-blue/30 rounded-lg
                   text-ff-text placeholder-ff-muted text-sm
                   focus:outline-none focus:border-ff-accent transition-colors"
      />

      {/* 추가 버튼 */}
      <button
        type="submit"
        disabled={!name.trim() || isAdding || disabled}
        className="px-4 py-2 bg-ff-accent text-white rounded-lg text-sm font-medium
                   hover:bg-ff-accent/80 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        {isAdding ? "추가 중..." : "➕ 추가"}
      </button>
    </form>
  );
}
