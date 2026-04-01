import { supabase } from "./supabase";

/**
 * 전리품 아이템 추가
 */
export async function addLootItem(roomId, { name, itemType = "gear" }) {
  const { data, error } = await supabase
    .from("loot_items")
    .insert({
      room_id: roomId,
      name,
      item_type: itemType,
      status: "bidding",
    })
    .select()
    .single();

  return { item: data, error };
}

/**
 * 방의 전리품 목록 조회
 */
export async function getLootItems(roomId) {
  const { data, error } = await supabase
    .from("loot_items")
    .select(
      `
      *,
      winner:members!loot_items_winner_id_fkey(nickname)
    `,
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: true });

  return { items: data || [], error };
}

/**
 * 전리품 아이템 삭제
 */
export async function deleteLootItem(itemId) {
  const { error } = await supabase.from("loot_items").delete().eq("id", itemId);

  return { error };
}

/**
 * 입찰(Need/Greed) 또는 패스 등록
 */
export async function placeBid(lootItemId, memberId, bidType = "pass") {
  const { data, error } = await supabase
    .from("bids")
    .upsert(
      {
        loot_item_id: lootItemId,
        member_id: memberId,
        bid_type: bidType,
      },
      { onConflict: "loot_item_id,member_id" },
    )
    .select()
    .single();

  return { bid: data, error };
}

/**
 * 특정 아이템의 입찰 현황 조회
 */
export async function getBidsForItem(lootItemId) {
  const { data, error } = await supabase
    .from("bids")
    .select(
      `
      *,
      member:members!bids_member_id_fkey(nickname, dkp_points)
    `,
    )
    .eq("loot_item_id", lootItemId)
    .order("created_at", { ascending: true });

  return { bids: data || [], error };
}

/**
 * 분배 결과 기록
 */
export async function recordDistribution({
  roomId,
  lootItemId,
  winnerId,
  ruleUsed,
  reason,
  dkpSpent = 0,
}) {
  // 1) 로그 기록
  const { error: logError } = await supabase.from("distribution_log").insert({
    room_id: roomId,
    loot_item_id: lootItemId,
    winner_id: winnerId,
    rule_used: ruleUsed,
    reason,
    dkp_spent: dkpSpent,
  });

  if (logError) return { error: logError };

  // 2) 아이템 상태 업데이트
  const { error: itemError } = await supabase
    .from("loot_items")
    .update({ status: "distributed", winner_id: winnerId })
    .eq("id", lootItemId);

  return { error: itemError };
}

/**
 * 분배 히스토리 조회
 */
export async function getDistributionLog(roomId) {
  const { data, error } = await supabase
    .from("distribution_log")
    .select(
      `
      *,
      loot_item:loot_items!distribution_log_loot_item_id_fkey(name, item_type),
      winner:members!distribution_log_winner_id_fkey(nickname)
    `,
    )
    .eq("room_id", roomId)
    .order("created_at", { ascending: false });

  return { logs: data || [], error };
}
