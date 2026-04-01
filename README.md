# 🎮 FFXIV 전리품 분배 도우미

레이드 파티원이 접속해 전리품 입찰/패스를 실시간으로 진행하고,  
DKP·로또·우선권 등 분배 규칙을 자동 적용하는 웹 도구입니다.

방장이 방을 만들면 URL 공유만으로 참여 가능!

## 기술 스택

- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Backend/DB**: Supabase (Realtime + PostgreSQL)
- **Deploy**: Vercel

## 주요 기능

- 🏠 방 생성 → URL 공유로 간편 참여
- ⚔️ 전리품 아이템 등록 및 관리
- 🎯 입찰(Need) / 패스(Pass) 실시간 투표
- ⚖️ 분배 규칙 자동 적용 (DKP / 로또 / 우선권)
- 📊 분배 결과 히스토리 로그
- 🔄 Supabase Realtime 멀티유저 실시간 동기화

## 설치 및 실행

```bash
git clone https://github.com/Dev-2A/ffxiv-loot-tracker.git
cd ffxiv-loot-tracker
npm install
cp .env.example .env.local
# .env.local에 Supabase 키 입력
npm run dev
```

## 관련 프로젝트

- [gravity-raid-hub](https://github.com/Dev-2A/gravity-raid-hub) — FFXIV 공대 관리 포털

## 라이선스

MIT License
