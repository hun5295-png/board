# 직원 전용 게시판 PRD (Product Requirements Document)

## 1. 프로젝트 개요

### 1.1 프로젝트 명
직원 전용 게시판 시스템

### 1.2 목적
- 사내 직원들 간의 원활한 소통과 정보 공유
- 공지사항, 업무 관련 논의, 지식 공유를 위한 플랫폼 제공

### 1.3 대상 사용자
- 회사 내 모든 직원
- 관리자/일반 직원 권한 구분

## 2. 핵심 기능 요구사항

### 2.1 인증 및 권한 관리
- [ ] 직원 로그인/로그아웃
- [ ] 권한 레벨 (관리자/일반직원)
- [ ] 비밀번호 재설정

### 2.2 게시판 기능
- [ ] 게시글 작성/수정/삭제
- [ ] 게시글 목록 조회 (페이지네이션)
- [ ] 게시글 상세 조회
- [ ] 게시글 검색 (제목/내용/작성자)
- [ ] 카테고리 분류 (공지사항, 업무공유, 자유게시판, 익명게시판)
- [ ] 파일 첨부 기능 (이미지, 문서 등)
- [ ] 익명 게시판(느티나무) 기능 - 익명 작성 및 익명 댓글

### 2.3 댓글 기능
- [ ] 댓글 작성/수정/삭제
- [ ] 대댓글 기능

### 2.4 알림 기능
- [ ] 실시간 알림 (Supabase Realtime 활용)
- [ ] 내 글에 댓글이 달렸을 때 알림
- [ ] 공지사항 등록 시 전체 알림
- [ ] 알림 읽음/안읽음 표시
- [ ] 알림 설정 (on/off)

### 2.5 파일 업로드 (Supabase Storage)
- [ ] 드래그 앤 드롭 파일 업로드
- [ ] 다중 파일 업로드
- [ ] 업로드 진행률 표시
- [ ] 이미지 미리보기
- [ ] 파일 다운로드

### 2.6 추가 기능 (논의 필요)
- [ ] 좋아요/추천 기능
- [ ] 북마크 기능
- [ ] 조회수 통계
- [ ] 공지사항 고정

## 3. 기술 스택 (제안)

### 3.1 Frontend
- React + TypeScript
- Tailwind CSS (모바일 반응형 디자인)
- 상태관리: Redux Toolkit 또는 Zustand
- 모바일 우선 반응형 디자인 구현

### 3.2 Backend
- NestJS
- Supabase (PostgreSQL 기반)
  - MCP로 연결되어 있음
  - Supabase Auth 활용
  - Supabase Storage for 파일 업로드
  - Row Level Security (RLS) 적용

### 3.3 인증
- Supabase Auth 활용
  - JWT 자동 관리
  - 세션 관리
  - 소셜 로그인 확장 가능

## 4. 화면 구성

### 4.1 주요 페이지
1. 로그인 페이지
2. 게시글 목록 페이지
3. 게시글 상세 페이지
4. 게시글 작성/수정 페이지
5. 마이페이지

## 5. 데이터베이스 설계 (Supabase)

### 5.1 주요 테이블
- profiles (사용자 프로필)
  - Supabase Auth와 연동
  - 부서, 직급 등 추가 정보
- posts (게시글)
  - is_anonymous (익명 여부)
  - category_id
  - author_id (FK to auth.users)
  - created_at, updated_at
- comments (댓글)
  - is_anonymous (익명 여부)
  - post_id (FK)
  - parent_id (대댓글용)
  - author_id (FK to auth.users)
- categories (카테고리)
  - 공지사항, 업무공유, 자유게시판, 익명게시판(느티나무)
- post_files (첨부파일)
  - Supabase Storage 경로 참조
- notifications (알림)
  - user_id (수신자)
  - type (댓글, 공지 등)
  - is_read (읽음 여부)
  - related_post_id
  
### 5.2 Supabase 특화 기능
- Row Level Security (RLS) 정책
  - 익명게시판 외 본인 글만 수정/삭제
  - 관리자 권한 분리
- Realtime 구독 (실시간 알림)
- Storage Bucket 설정 (파일 관리)

## 6. 보안 요구사항
- [ ] HTTPS 통신
- [ ] SQL Injection 방지
- [ ] XSS 방지
- [ ] 파일 업로드 보안
  - 허용 파일 형식: 이미지(jpg, png, gif), 문서(pdf, doc, docx, xls, xlsx)
  - 파일 크기 제한: 개별 파일 10MB, 총 50MB
- [ ] 익명게시판 IP 해싱 처리

## 7. 성능 요구사항
- 동시 접속자 100명 이상 지원
- 페이지 로드 시간 3초 이내
- 파일 업로드 제한 (10MB)

## 8. 일정 계획
- 1주차: 요구사항 분석 및 설계
- 2-3주차: 백엔드 개발
- 4-5주차: 프론트엔드 개발
- 6주차: 통합 테스트 및 배포

---

## 확정 사항
- ✅ 카테고리: 공지사항, 업무공유, 자유게시판, 익명게시판(느티나무)
- ✅ 익명게시판 기능 포함
- ✅ 모바일 반응형 디자인
- ✅ 파일 첨부: 이미지 및 문서 파일
- ✅ 실시간 알림 기능 (댓글, 공지사항)
- ✅ 드래그 앤 드롭 파일 업로드
- ✅ Supabase 활용 (DB, Auth, Storage, Realtime)

## 추가 논의 사항
1. 기존 사내 시스템과의 연동이 필요한가요?
   - SSO(Single Sign-On)?
   - 사내 메신저 연동?
   - Supabase Auth는 다양한 OAuth 프로바이더 지원
2. 검색 기능 고도화 필요한가요?
   - 태그 기능
   - 상세 검색 필터
   - Supabase의 Full-text Search 활용 가능
3. 관리자 기능 범위는?
   - 통계/대시보드
   - 사용자 관리
   - 게시글 일괄 관리
   - Supabase Dashboard 활용 고려
4. 추가 기능 우선순위는?
   - 좋아요/추천
   - 북마크
   - 조회수
   - 공지사항 고정