import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoom, getRoomMembers, updateRoomStatus } from "../lib/rooms";
import { getLootItems, addLootItem, deleteLootItem } from "../lib/loot";
import { useRoom } from "../contexts/RoomContext";
import useRealtimeRoom from "../hooks/useRealtimeRoom";
import LootItemForm from "../components/loot/LootItemForm";
import LootList from "../components/loot/LootList";
import BidPanel from "../components/loot/BidPanel";
import DistributionHistory from "../components/loot/DistributionHistory";
import DKPManager from "../components/room/DKPManager";
import CopyButton from "../components/common/CopyButton";

export default function Room() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {
    room,
    setRoom,
    members,
    setMembers,
    currentUser,
    setCurrentUser,
    isHost,
    setIsHost,
  } = useRoom();

  const [lootItems, setLootItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [historyKey, setHistoryKey] = useState(0);

  // 데이터 로드 함수
  const loadMembers = useCallback(async () => {
    const { members: list } = await getRoomMembers(roomId);
    setMembers(list);
  }, [roomId, setMembers]);

  const loadLootItems = useCallback(async () => {
    const { items } = await getLootItems(roomId);
    setLootItems(items);
  }, [roomId]);

  // 초기 로드
  useEffect(() => {
    async function loadRoom() {
      const { room: roomData, error } = await getRoom(roomId);
      if (error || !roomData) {
        navigate("/not-found");
        return;
      }
      setRoom(roomData);

      await loadMembers();
      await loadLootItems();

      // localStorage에서 현재 유저 복원
      const saved = localStorage.getItem(`member_${roomId}`);
      if (saved) {
        const savedMember = JSON.parse(saved);
        const { members: memberList } = await getRoomMembers(roomId);
        const found = memberList.find((m) => m.id === savedMember.id);
        if (found) {
          setCurrentUser(found);
          setIsHost(found.is_host);
        } else {
          // 유저가 DB에서 삭제된 경우
          localStorage.removeItem(`member_${roomId}`);
          navigate(`/join/${roomId}`);
          return;
        }
      } else {
        navigate(`/join/${roomId}`);
        return;
      }

      setLoading(false);
    }
    loadRoom();
  }, [
    roomId,
    navigate,
    setRoom,
    setMembers,
    setCurrentUser,
    setIsHost,
    loadMembers,
    loadLootItems,
  ]);

  // Realtime 구독
  useRealtimeRoom(roomId, {
    onMembersChange: useCallback(() => {
      loadMembers();
    }, [loadMembers]),
    onLootChange: useCallback(() => {
      loadLootItems();
    }, [loadLootItems]),
    onBidsChange: useCallback(() => {
      loadLootItems();
    }, [loadLootItems]),
  });

  // 아이템 추가 핸들러
  const handleAddItem = async ({ name, itemType }) => {
    const { error } = await addLootItem(roomId, { name, itemType });
    if (error) {
      alert("아이템 추가 실패: " + error.message);
      return;
    }
    await loadLootItems();
  };

  // 아이템 삭제 핸들러
  const handleDeleteItem = async (itemId) => {
    if (!confirm("이 아이템을 삭제하시겠습니까?")) return;
    const { error } = await deleteLootItem(itemId);
    if (error) {
      alert("삭제 실패: " + error.message);
      return;
    }
    if (selectedItem?.id === itemId) setSelectedItem(null);
    await loadLootItems();
  };

  // 방 상태 변경 핸들러
  const handleStatusChange = async (newStatus) => {
    const { error } = await updateRoomStatus(roomId, newStatus);
    if (error) {
      alert("상태 변경 실패: " + error.message);
      return;
    }
    setRoom((prev) => ({ ...prev, status: newStatus }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-ff-muted text-lg">⏳ 방 정보를 불러오는 중...</div>
      </div>
    );
  }

  return (
    <div>
      {/* 방 헤더 */}
      <div className="bg-ff-surface rounded-lg p-4 mb-6 border border-ff-blue/30">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-xl font-bold text-ff-gold">{room?.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-ff-muted flex-wrap">
              <span>👑 방장: {room?.host_name}</span>
              <span>
                📋{" "}
                {room?.rule_type === "lotto"
                  ? "로또"
                  : room?.rule_type === "dkp"
                    ? "DKP"
                    : "우선권"}
              </span>
              <span>
                👥 {members.length}/{room?.max_members}명
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 방 상태 뱃지 */}
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                room?.status === "waiting"
                  ? "bg-yellow-900/30 text-yellow-300"
                  : room?.status === "active"
                    ? "bg-green-900/30 text-green-300"
                    : "bg-gray-900/30 text-gray-300"
              }`}
            >
              {room?.status === "waiting"
                ? "⏳ 대기중"
                : room?.status === "active"
                  ? "🎮 진행중"
                  : "✅ 종료"}
            </span>
            {/* 방장 전용 상태 변경 버튼 */}
            {isHost && room?.status === "waiting" && (
              <button
                onClick={() => handleStatusChange("active")}
                className="px-3 py-1 bg-green-700 text-white rounded-full text-xs font-medium
                           hover:bg-green-600 transition-colors"
              >
                ▶️ 시작
              </button>
            )}
            {isHost && room?.status === "active" && (
              <button
                onClick={() => handleStatusChange("finished")}
                className="px-3 py-1 bg-gray-600 text-white rounded-full text-xs font-medium
                           hover:bg-gray-500 transition-colors"
              >
                ⏹️ 종료
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 좌측: 멤버 + 초대링크 */}
        <div className="lg:col-span-1 space-y-4">
          {/* 멤버 목록 */}
          <div className="bg-ff-surface rounded-lg p-4 border border-ff-blue/30">
            <h2 className="text-sm font-bold text-ff-text mb-3">
              👥 참여 멤버
            </h2>
            <div className="space-y-1.5">
              {members.map((member) => (
                <div
                  key={member.id}
                  className={`px-3 py-2 rounded-lg text-sm flex items-center justify-between ${
                    member.id === currentUser?.id
                      ? "bg-ff-accent/20 border border-ff-accent/50 text-ff-accent"
                      : "bg-ff-dark border border-ff-blue/20 text-ff-text"
                  }`}
                >
                  <span>
                    {member.is_host && "👑 "}
                    {member.nickname}
                    {member.id === currentUser?.id && " (나)"}
                  </span>
                  {room?.rule_type === "dkp" && (
                    <span className="text-ff-gold text-xs font-medium">
                      {member.dkp_points} DKP
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* DKP 관리 (DKP 모드일 때만) */}
          {room?.rule_type === "dkp" && (
            <DKPManager
              roomId={roomId}
              members={members}
              isHost={isHost}
              currentUser={currentUser}
              onUpdate={async () => {
                await loadMembers();
              }}
            />
          )}

          {/* 초대 링크 */}
          <div className="bg-ff-surface rounded-lg p-4 border border-ff-blue/30">
            <h2 className="text-sm font-bold text-ff-text mb-2">🔗 초대 링크</h2>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={`${window.location.origin}/join/${roomId}`}
                className="flex-1 px-2 py-1.5 bg-ff-dark border border-ff-blue/20 rounded
                           text-ff-muted text-xs"
              />
              <CopyButton text={`${window.location.origin}/join/${roomId}`} />
            </div>
          </div>
        </div>

        {/* 우측: 전리품 관리 */}
        <div className="lg:col-span-2">
          <div className="bg-ff-surface rounded-lg p-4 border border-ff-blue/30">
            <h2 className="text-lg font-bold text-ff-text mb-4">
              ⚔️ 전리품 목록
            </h2>

            {/* 아이템 추가 폼 (방장만) */}
            {isHost && room?.status !== "finished" && (
              <div className="mb-4 pb-4 border-b border-ff-blue/20">
                <LootItemForm onAdd={handleAddItem} disabled={false} />
              </div>
            )}

            {/* 아이템 목록 */}
            <LootList
              items={lootItems}
              isHost={isHost}
              selectedItemId={selectedItem?.id}
              onSelect={(item) =>
                setSelectedItem(selectedItem?.id === item.id ? null : item)
              }
              onDelete={handleDeleteItem}
            />

            {/* 선택된 아이템 입찰 패널 */}
            {selectedItem && selectedItem.status === "bidding" && (
              <BidPanel
                item={selectedItem}
                currentUser={currentUser}
                members={members}
                ruleType={room?.rule_type}
                roomId={roomId}
                isHost={isHost}
                onBidsUpdate={() => {}}
                onDistributed={async () => {
                  await loadLootItems();
                  await loadMembers();
                  setSelectedItem(null);
                  setHistoryKey((prev) => prev + 1);
                }}
              />
            )}

            {/* 분배 완료된 아이템 선택 시 */}
            {selectedItem && selectedItem.status === "distributed" && (
              <div className="mt-4 p-4 bg-ff-dark rounded-lg border border-green-500/30">
                <h3 className="text-sm font-bold text-green-300 mb-1">
                  ✅ {selectedItem.name}
                </h3>
                <p className="text-ff-muted text-sm">
                  🏆 획득자: {selectedItem.winner?.nickname || "알 수 없음"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* 하단: 분배 히스토리 (전체 너비) */}
        <div className="lg:col-span-3">
          <DistributionHistory roomId={roomId} refreshKey={historyKey} />
        </div>
      </div>
    </div>
  );
}
