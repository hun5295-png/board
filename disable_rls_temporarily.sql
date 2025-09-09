-- 임시로 RLS 비활성화 (로그인 문제 해결용)
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. employees 테이블의 RLS 비활성화
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;

-- 2. 테스트 쿼리
SELECT * FROM employees WHERE employee_id = '1131' AND name = '김창훈';

-- 3. RLS 상태 확인
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'employees';

-- 4. 로그인 테스트 후 다시 RLS 활성화하려면:
-- ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
