import { supabase } from "./supabase";

/**
 * 멤버의 DKP 포인트 설정 (방장용)
 */
export async function setDKP(memberId, points) {
  const { data, error } = await supabase
    .from("members")
    .update({ dkp_points: Math.max(0, points) })
    .eq("id", memberId)
    .select()
    .single();

  return { member: data, error };
}

/**
 * 멤버의 DKP 포인트 증가
 */
export async function addDKP(memberId, amount) {
  const { data: member, error: fetchError } = await supabase
    .from("members")
    .select("dkp_points")
    .eq("id", memberId)
    .single();

  if (fetchError) return { error: fetchError };

  const newPoints = member.dkp_points + amount;

  const { data, error } = await supabase
    .from("members")
    .update({ dkp_points: newPoints })
    .eq("id", memberId)
    .select()
    .single();

  return { member: data, error };
}

/**
 * 방 전체 멤버에게 DKP 일괄 지급
 */
export async function grantDKPToAll(roomId, amount) {
  // 멤버 목록 조회
  const { data: members, error: fetchError } = await supabase
    .from("members")
    .select("id, dkp_points")
    .eq("room_id", roomId);

  if (fetchError) return { error: fetchError };

  // 각 멤버를 개별 update
  for (const m of members) {
    const { error } = await supabase
      .from('members')
      .update({ dkp_points: m.dkp_points + amount })
      .eq('id', m.id);
    
    if (error) return { error };
  }

  return { error: null };
}

/**
 * 방 전체 멤버 DKP 초기화
 */
export async function resetDKPAll(roomId, initialPoints = 100) {
  const { error } = await supabase
    .from("members")
    .update({ dkp_points: initialPoints })
    .eq("room_id", roomId);

  return { error };
}
