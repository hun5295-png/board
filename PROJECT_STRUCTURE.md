# 프로젝트 구조

## 전체 구조
```
프로젝트 루트/
├── my-app/ (React 프론트엔드)
├── my-nest-app/ (NestJS 백엔드)
├── sample/
│   ├── PRD.md (제품 요구사항 문서)
│   ├── API_DESIGN.md (API 설계 문서)
│   ├── PROJECT_STRUCTURE.md (이 문서)
│   └── database/
│       └── schema.sql (Supabase 데이터베이스 스키마)
```

## 프론트엔드 (my-app)
```
my-app/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   └── Layout.tsx
│   │   └── SupabaseTest.tsx
│   ├── pages/
│   │   ├── Login.tsx
│   │   └── PostList.tsx
│   ├── store/
│   │   ├── authStore.ts (Zustand 인증 상태)
│   │   └── notificationStore.ts (알림 상태)
│   ├── lib/
│   │   └── supabase.ts (Supabase 클라이언트)
│   ├── types/
│   │   └── index.ts (TypeScript 타입 정의)
│   ├── App.tsx
│   └── index.css (Tailwind CSS)
├── .env.local (환경변수)
└── tailwind.config.js
```

## 백엔드 (my-nest-app)
```
my-nest-app/
├── src/
│   ├── supabase/
│   │   ├── supabase.module.ts
│   │   └── supabase.service.ts
│   ├── app.module.ts
│   └── main.ts
├── .env (환경변수)
└── tsconfig.json
```

## 주요 기술 스택
- **프론트엔드**: React, TypeScript, Tailwind CSS, Zustand, React Router
- **백엔드**: NestJS, TypeScript
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **파일 저장소**: Supabase Storage
- **실시간 기능**: Supabase Realtime

## 환경 설정
1. Supabase 프로젝트 생성
2. `database/schema.sql` 실행하여 테이블 생성
3. 환경변수 설정:
   - `my-app/.env.local`: REACT_APP_SUPABASE_URL, REACT_APP_SUPABASE_ANON_KEY
   - `my-nest-app/.env`: SUPABASE_URL, SUPABASE_SERVICE_KEY

## 실행 방법
```bash
# 프론트엔드
cd my-app
npm start

# 백엔드
cd my-nest-app
npm run start:dev
```