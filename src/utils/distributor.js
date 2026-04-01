/**
 * 분배 규칙 엔진
 * 입찰 목록을 받아서 당첨자를 결정하는 순수 함수 모듈
 */

/**
 * 로또 분배: Need > Greed 우선, 같은 등급 내 랜덤
 * @param {Array} bids - 입찰 목록 [{ member_id, bid_type, member: { nickname, dkp_points } }]
 * @returns {{ winnerId, reason }}
 */
export function distributeLotto(bids) {
  const needBids = bids.filter((b) => b.bid_type === "need");
  const greedBids = bids.filter((b) => b.bid_type === "greed");

  // Need가 있으면 Need 중 랜덤
  if (needBids.length > 0) {
    const winner = needBids[Math.floor(Math.random() * needBids.length)];
    return {
      winnerId: winner.member_id,
      reason: `Need ${needBids.length}명 중 랜덤 당첨 🎲`,
    };
  }

  // Need가 없으면 Greed 중 랜덤
  if (greedBids.length > 0) {
    const winner = greedBids[Math.floor(Math.random() * greedBids.length)];
    return {
      winnerId: winner.member_id,
      reason: `Greed ${greedBids.length}명 중 랜덤 당첨 🎲`,
    };
  }

  // 모두 Pass
  return { winnerId: null, reason: "모두 패스하여 분배되지 않았습니다." };
}

/**
 * DKP 분배: Need > Greed 우선, 같은 등급 내 DKP 높은 사람
 * 동점이면 랜덤
 * @param {Array} bids - 입찰 목록
 * @returns {{ winnerId, reason, dkpSpent }}
 */
export function distributeDKP(bids) {
  const needBids = bids.filter((b) => b.bid_type === "need");
  const greedBids = bids.filter((b) => b.bid_type === "greed");

  const pool = needBids.length > 0 ? needBids : greedBids;
  const poolLabel = needBids.length > 0 ? "Need" : "Greed";

  if (pool.length === 0) {
    return {
      winnerId: null,
      reason: "모두 패스하여 분배되지 않았습니다.",
      dkpSpent: 0,
    };
  }

  // DKP 내림차순 정렬
  const sorted = [...pool].sort(
    (a, b) => (b.member?.dkp_points ?? 0) - (a.member?.dkp_points ?? 0),
  );

  const maxDKP = sorted[0].member?.dkp_points ?? 0;
  const topTied = sorted.filter((b) => (b.member?.dkp_points ?? 0) === maxDKP);

  // 동점이면 랜덤
  const winner = topTied[Math.floor(Math.random() * topTied.length)];
  const dkpSpent = Math.max(1, Math.floor(maxDKP * 0.1)); // DKP 10% 소비 (최소 1)

  let reason = `${poolLabel} ${pool.length}명 중 DKP 최고(${maxDKP}) 💰`;
  if (topTied.length > 1) {
    reason += ` (동점 ${topTied.length}명 중 랜덤)`;
  }

  return {
    winnerId: winner.member_id,
    reason,
    dkpSpent,
  };
}

/**
 * 우선권 분배: Need > Greed 우선, 같은 등급 내 priority_rank 낮은 사람 (1이 최우선)
 * priority_rank가 null이면 가입 순서(joined_at)로 폴백
 * @param {Array} bids - 입찰 목록
 * @param {Array} members = 멤버 목록 (joined_at 순서 참고)
 * @returns {{ winnerId, reason }}
 */
export function distributePriority(bids, members) {
  const needBids = bids.filter((b) => b.bid_type === "need");
  const greedBids = bids.filter((b) => b.bid_type === "greed");

  const pool = needBids.length > 0 ? needBids : greedBids;
  const poolLabel = needBids.length > 0 ? "Need" : "Greed";

  if (pool.length === 0) {
    return { winnerId: null, reason: "모두 패스하여 분배되지 않았습니다." };
  }

  // priority_rank로 정렬 (없으면 멤버 가입 순서로 폴백)
  const memberOrder = members.map((m) => m.id);

  const sorted = [...pool].sort((a, b) => {
    const rankA = a.priority_rank ?? 999;
    const rankB = b.priority_rank ?? 999;

    if (rankA !== rankB) return rankA - rankB;

    // 동점이면 가입 순서
    const orderA = memberOrder.indexOf(a.member_id);
    const orderB = memberOrder.indexOf(b.member_id);
    return orderA - orderB;
  });

  const winner = sorted[0];
  const rank =
    winner.priority_rank ?? memberOrder.indexOf(winner.member_id) + 1;

  return {
    winnerId: winner.member_id,
    reason: `${poolLabel} ${pool.length}명 중 우선순위 ${rank}번 👑`,
  };
}

/**
 * 통합 분배 함수: ruleType에 따라 적절한 분배 로직 호출
 * @param {string} ruleType - 'lotto' | 'dkp' | 'priority'
 * @param {Array} bids - 입찰 목록
 * @param {Array} members - 멤버 목록
 * @returns {{ winnerId, reason, dkpSpent? }}
 */
export function distribute(ruleType, bids, members) {
  switch (ruleType) {
    case "lotto":
      return distributeLotto(bids);
    case "dkp":
      return distributeDKP(bids);
    case "priority":
      return distributePriority(bids, members);
    default:
      return distributeLotto(bids);
  }
}
