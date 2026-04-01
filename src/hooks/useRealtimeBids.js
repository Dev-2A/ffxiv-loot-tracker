import { useEffect } from "react";
import { supabase } from "../lib/supabase";

/**
 * 특정 아이템의 입찰 변경을 실시간 구독
 */
export default function useRealtimeBids(lootItemId, onBidsChange) {
  useEffect(() => {
    if (!lootItemId) return;

    const channel = supabase
      .channel(`bids:${lootItemId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bids",
          filter: `loot_item_id=eq.${lootItemId}`,
        },
        () => {
          if (onBidsChange) onBidsChange();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [lootItemId, onBidsChange]);
}
