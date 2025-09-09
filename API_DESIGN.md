# API 엔드포인트 설계

## 인증 (Supabase Auth 사용)
- `POST /auth/signup` - 회원가입
- `POST /auth/signin` - 로그인
- `POST /auth/signout` - 로그아웃
- `POST /auth/reset-password` - 비밀번호 재설정
- `GET /auth/user` - 현재 사용자 정보

## 게시글 (Posts)
- `GET /api/posts` - 게시글 목록 조회
  - Query: `?category={category_id}&page={page}&limit={limit}&search={keyword}`
- `GET /api/posts/:id` - 게시글 상세 조회
- `POST /api/posts` - 게시글 작성
- `PUT /api/posts/:id` - 게시글 수정
- `DELETE /api/posts/:id` - 게시글 삭제
- `POST /api/posts/:id/like` - 게시글 좋아요
- `DELETE /api/posts/:id/like` - 게시글 좋아요 취소
- `POST /api/posts/:id/bookmark` - 게시글 북마크
- `DELETE /api/posts/:id/bookmark` - 게시글 북마크 취소

## 댓글 (Comments)
- `GET /api/posts/:postId/comments` - 댓글 목록 조회
- `POST /api/posts/:postId/comments` - 댓글 작성
- `PUT /api/comments/:id` - 댓글 수정
- `DELETE /api/comments/:id` - 댓글 삭제

## 카테고리 (Categories)
- `GET /api/categories` - 카테고리 목록 조회

## 파일 업로드 (Files)
- `POST /api/upload` - 파일 업로드 (Supabase Storage)
- `DELETE /api/files/:id` - 파일 삭제

## 알림 (Notifications)
- `GET /api/notifications` - 알림 목록 조회
- `PUT /api/notifications/:id/read` - 알림 읽음 처리
- `PUT /api/notifications/read-all` - 모든 알림 읽음 처리
- `DELETE /api/notifications/:id` - 알림 삭제

## 사용자 프로필 (Profile)
- `GET /api/profile` - 내 프로필 조회
- `PUT /api/profile` - 내 프로필 수정
- `GET /api/users/:id` - 다른 사용자 프로필 조회

## 관리자 (Admin)
- `GET /api/admin/stats` - 통계 조회
- `GET /api/admin/users` - 사용자 목록 조회
- `PUT /api/admin/users/:id` - 사용자 정보 수정
- `DELETE /api/admin/posts/:id` - 게시글 강제 삭제
- `POST /api/admin/posts/:id/pin` - 게시글 고정
- `DELETE /api/admin/posts/:id/pin` - 게시글 고정 해제

## WebSocket (Supabase Realtime)
- 실시간 알림
- 실시간 댓글 업데이트
- 실시간 좋아요 카운트 업데이트