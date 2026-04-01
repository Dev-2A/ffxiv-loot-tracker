import { supabase } from "./supabase";

/**
 * 새 방 생성
 * @param {string} name - 방 이름
 * @param {string} hostName - 방장 닉네임
 * @param {string} ruleType - 분배 규칙 ('lotto' | 'dkp' | 'priority')
 * @param {number} maxMembers - 최대 인원 (기본 8)
 * @returns {{ room, host, error }}
 */
export async function createRoom({
  name,
  hostName,
  ruleType = "lotto",
  maxMembers = 8,
}) {
  // 1) 방 생성
  const { data: room, error: roomError } = await supabase
    .from("rooms")
    .insert({
      name,
      host_name: hostName,
      rule_type: ruleType,
      max_members: maxMembers,
      status: "waiting",
    })
    .select()
    .single();

  if (roomError) return { room: null, host: null, error: roomError };

  // 2) 방장을 멤버로 자동 등록
  const { data: host, error: memberError } = await supabase
    .from("members")
    .insert({
      room_id: room.id,
      nickname: hostName,
      is_host: true,
      dkp_points: 0,
    })
    .select()
    .single();

  if (memberError) return { room, host: null, error: memberError };

  return { room, host, error: null };
}

/**
 * 방 정보 조회
 * @param {string} roomId - 방 UUID
 * @returns {{ room, error }}
 */
export async function getRoom(roomId) {
  const { data: room, error } = await supabase
    .from("rooms")
    .select("*")
    .eq("id", roomId)
    .single();

  return { room, error };
}

/**
 * 방 참여 (닉네임으로 입장)
 * @param {string} roomId - 방 UUID
 * @param {string} nickname - 참여자 닉네임
 * @returns {{ member, error }}
 */
export async function joinRoom(roomId, nickname) {
  // 1) 방 존재 여부 + 상태 확인
  const { room, error: roomError } = await getRoom(roomId);
  if (roomError || !room) {
    return {
      member: null,
      error: roomError || new Error("방을 찾을 수 없습니다."),
    };
  }
  if (room.status === "finished") {
    return { member: null, error: new Error("이미 종료된 방입니다.") };
  }

  // 2) 현재 멤버 수 확인
  const { count, error: countError } = await supabase
    .from("members")
    .select("*", { count: "exact", head: true })
    .eq("room_id", roomId);

  if (countError) return { member: null, error: countError };
  if (count >= room.max_members) {
    return { member: null, error: new Error("방이 가득 찼습니다.") };
  }

  // 3) 닉네임 중복 체크 (이미 있으면 재접속 처리)
  const { data: existing } = await supabase
    .from("members")
    .select("*")
    .eq("room_id", roomId)
    .eq("nickname", nickname)
    .single();

  if (existing) {
    return { member: existing, error: null };
  }

  // 4) 새 멤버 등록
  const { data: member, error: memberError } = await supabase
    .from("members")
    .insert({
      room_id: roomId,
      nickname,
      is_host: false,
      dkp_points: 0,
    })
    .select()
    .single();

  return { member, error: memberError };
}

/**
 * 방 멤버 목록 조회
 * @param {string} roomId - 방 UUID
 * @returns {{ members, error }}
 */
export async function getRoomMembers(roomId) {
  const { data: members, error } = await supabase
    .from("members")
    .select("*")
    .eq("room_id", roomId)
    .order("joined_at", { ascending: true });

  return { members: members || [], error };
}

/**
 * 방 상태 변경
 * @param {string} roomId - 방 UUID
 * @param {string} status - 'waiting' | 'active' | 'finished'
 * @returns {{ room, error }}
 */
export async function updateRoomStatus(roomId, status) {
  const { data: room, error } = await supabase
    .from("rooms")
    .update({ status })
    .eq("id", roomId)
    .select()
    .single();

  return { room, error };
}
