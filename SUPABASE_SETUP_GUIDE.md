# Supabase 프로젝트 설정 가이드

## 1. Supabase 프로젝트 생성

1. [Supabase](https://supabase.com) 접속 후 로그인
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Project name: employee-board (또는 원하는 이름)
   - Database Password: 강력한 비밀번호 설정
   - Region: Northeast Asia (Seoul) 선택

## 2. 환경변수 설정

### Supabase Dashboard에서 키 확인
1. 프로젝트 대시보드 → Settings → API
2. 다음 정보 복사:
   - Project URL
   - anon public key
   - service_role key (비공개, 백엔드용)

### 프론트엔드 환경변수 설정
`my-app/.env.local` 파일 수정:
```
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key
```

### 백엔드 환경변수 설정
`my-nest-app/.env` 파일 수정:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your-service-role-key
```

## 3. 데이터베이스 스키마 적용

1. Supabase Dashboard → SQL Editor
2. New query 클릭
3. `sample/database/schema.sql` 파일 내용 전체 복사/붙여넣기
4. Run 클릭하여 실행

## 4. Storage 버킷 생성

1. Supabase Dashboard → Storage
2. "New bucket" 클릭
3. 버킷 이름: `post-files`
4. Public bucket: OFF (보안을 위해)
5. Create bucket

## 5. 인증 설정

1. Supabase Dashboard → Authentication → Providers
2. Email 인증 활성화 확인
3. (선택) 추가 OAuth 프로바이더 설정 가능

## 6. 테스트 사용자 생성

SQL Editor에서 실행:
```sql
-- 테스트 사용자 생성 (Supabase Auth UI 또는 SQL로)
-- 주의: 실제로는 회원가입 기능을 통해 생성해야 함

-- 관리자 권한 부여 (user_id는 실제 생성된 사용자 ID로 교체)
UPDATE profiles 
SET is_admin = true, 
    full_name = '관리자',
    department = 'IT팀',
    position = '팀장'
WHERE id = 'user-uuid-here';
```

## 7. 프로젝트 실행

### 프론트엔드 실행
```bash
cd my-app
npm start
```
http://localhost:3000 접속

### 백엔드 실행 (선택사항)
```bash
cd my-nest-app
npm run start:dev
```
http://localhost:3001 접속

## 8. 연결 테스트

1. 프론트엔드에서 SupabaseTest 컴포넌트로 이동
2. "연결 성공!" 메시지와 카테고리 목록 확인
3. 로그인 후 게시판 기능 테스트

## 주의사항

- service_role key는 절대 프론트엔드에 노출되면 안 됨
- Production 환경에서는 환경변수를 안전하게 관리
- RLS(Row Level Security) 정책이 제대로 적용되었는지 확인