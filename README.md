# 🎮 FFXIV 전리품 분배 도우미

[![Deploy](https://img.shields.io/badge/Vercel-Deployed-brightgreen?logo=vercel)](https://ffxiv-loot-tracker.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

레이드 파티원이 접속해 전리품 입찰/패스를 **실시간**으로 진행하고,  
**DKP·로또·우선권** 등 분배 규칙을 자동 적용하는 웹 도구입니다.

방장이 방을 만들면 **URL 공유만으로 참여 가능**!

> 🔗 **라이브 데모**: [ffxiv-loot-tracker.vercel.app](https://ffxiv-loot-tracker.vercel.app)

---

## 주요 기능

### 🏠 방 생성 & 참여

- 방을 만들면 고유 URL이 생성됩니다.
- 참여자는 URL만 열면 닉네임 입력 후 바로 입장합니다.
- 같은 닉네임으로 재접속하면 기존 상태가 복원됩니다.

### ⚔️ 전리품 관리

- 방장이 아이템을 등록합니다 (무기 / 방어구 / 장신구 / 재료 / 기타).
- 아이템별로 입찰 상태를 관리합니다 (입찰중 → 분배완료 / 폐기).

### 🎯 입찰 시스템

- **Need**: 이 아이템이 필요합니다.
- **Greed**: 있으면 좋겠습니다.
- **Pass**: 패스합니다.
- 모든 입찰은 Supabase Realtime으로 **실시간 동기화**됩니다.

### ⚖️ 분배 규칙

| 규칙 | 설명 |
| --- | --- |
| 🎲 **로또** | Need > Greed 우선, 같은 등급 내 랜덤 당첨 |
| 💰 **DKP** | Need > Greed 우선, 같은 등급 내 DKP 최고점자 획득 (동점 시 랜덤) |
| 👑 **우선권** | Need > Greed 우선, 사전 설정 순번에 따라 분배 |

### 💰 DKP 포인트 (DKP 모드)

- 방장이 전체 일괄 지급 / 초기화 가능
- 개별 멤버 포인트 인라인 편집
- 분배 시 잗종 차감
- 랭킹 + 미니 바 시각화

### 📜 분배 히스토리

- 모든 분배 결과가 자동으로 기록됩니다.
- 아이템명, 당첨자, 사용 규칙, 사유, 기간을 확인할 수 있습니다.

---

## 기술 스택

| 영역 | 기술 |
| --- | --- |
| **Frontend** | React 18 + Vite |
| **Styling** | Tailwind CSS 3 |
| **Backend / DB** | Supabase (PostgreSQL + Realtime) |
| **Deploy** | Vercel |
| **Font** | Pretendard Variable |

---

## 프로젝트 구조

```text
src/
├── components/
│   ├── common/          # Header, Footer, Layout, Toast, CopyButton
│   ├── room/            # DKPManager
│   └── loot/            # LootItemForm, LootItemCard, LootList,
│                        # BidPanel, DistributeButton,
│                        # DistributionResult, DistributionHistory
├── contexts/
│   ├── RoomContext.jsx   # Context + useRoom 훅
│   └── RoomProvider.jsx  # Provider 컴포넌트
├── hooks/
│   ├── useRealtimeRoom.js   # 방 전체 Realtime 구독
│   └── useRealtimeBids.js   # 아이템별 입찰 Realtime 구독
├── lib/
│   ├── supabase.js       # Supabase 클라이언트
│   ├── rooms.js          # 방 CRUD
│   ├── loot.js           # 전리품 + 입찰 + 분배기록
│   └── dkp.js            # DKP 포인트 관리
├── pages/
│   ├── Home.jsx          # 홈 (방 만들기 / 참여하기)
│   ├── CreateRoom.jsx    # 방 생성
│   ├── JoinDirect.jsx    # 코드로 참여
│   ├── JoinRoom.jsx      # URL로 참여
│   ├── Room.jsx          # 방 메인 (입찰 + 분배)
│   └── NotFound.jsx      # 404
├── utils/
│   └── distributor.js    # 분배 규칙 엔진 (순수 함수)
├── App.jsx
├── main.jsx
└── index.css
```

---

## 설치 및 실행

### 사전 준비

- [Node.js](https://nodejs.org/) 18+
- [Supabase](https://supabase.com) 프로젝트 (무료 티어 OK)

### 로컬 실행

```bash
# 1. 클론
git clone https://github.com/Dev-2A/ffxiv-loot-tracker.git
cd ffxiv-loot-tracker

# 2. 의존성 설치
npm install

# 3. 환경변수 설정
cp .env.example .env.local
# .env.local에 Supabase URL + anon key 입력

# 4. 개발 서버 실행
npm run dev
```

### Supabase DB 설정

SQL Editor에서 아래 순서로 실행:

1. 테이블 생성 (rooms, members, loot_items, bids, distribution_log)
2. RLS 정책 설정
3. Realtime 활성화

> 상세 SQL은 프로젝트 설정 시 사용한 스키마를 참고하세요.

---

## DB 스키마

```textrooms ─── 1:N ─── members
  │                  │
  └── 1:N ── loot_items
                │       │
                └─ 1:N ─ bids
                │
  └── 1:N ── distribution_log
```

| 테이블 | 역할 |
| --- | --- |
| `rooms` | 방 정보 (이름, 방장, 분배규칙, 상태) |
| `members` | 참여자 (닉네임, DKP 포인트, 방장 여부) |
| `loot_items` | 전리품 아이템 (이름, 종류, 분배 상태) |
| `bids` | 입찰 기록 (Need / Greed / Pass) |
| `distribution_log` | 분배 결과 히스토리 |

---

## 관련 프로젝트

- [gravity-raid-hub](https://github.com/Dev-2A/gravity-raid-hub) — FFXIV 과중력 공대 관리 포털

---

## 라이선스

[MIT License](LICENSE)

---

## 만든 사람

**Dev-2A** · [GitHub](https://github.com/Dev-2A) · [Portfolio](https://dev-2a.github.io/dev-2a-portfolio)
