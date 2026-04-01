import { useEffect } from "react";
import { supabase } from "../lib/supabase";

/**
 * Supabase Realtime 구독 훅
 * 방에 관련된 모든 테이블 변경을 실시간 수신
 */
export default function useRealtimeRoom(
  roomId,
  { onMembersChange, onLootChange, onBidsChange },
) {
  useEffect(() => {
    if (!roomId) return;

    const channel = supabase
      .channel(`room:${roomId}`)
      // 멤버 변경 감지
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "members",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (onMembersChange) onMembersChange(payload);
        },
      )
      // 전리품 변경 감지
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "loot_items",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          if (onLootChange) onLootChange(payload);
        },
      )
      // 입찰 변경 감지 (room_id 필터 없으므로 클라이언트에서 필터링)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
        },
        (payload) => {
          if (onBidsChange) onBidsChange(payload);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId, onMembersChange, onLootChange, onBidsChange]);
}
