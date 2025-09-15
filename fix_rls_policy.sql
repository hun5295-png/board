-- RLS 정책 수정으로 로그인 문제 해결
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "직원 정보 조회는 인증된 사용자 가능" ON employees;

-- 2. 새로운 RLS 정책 생성 (모든 사용자가 직원 정보 조회 가능)
CREATE POLICY "직원 정보 조회는 모든 사용자 가능" ON employees
    FOR SELECT USING (true);

-- 3. 관리자만 수정/삭제 가능한 정책은 유지
-- (이미 존재하는 정책이므로 그대로 유지)

-- 4. 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'employees';

-- 5. 테스트 쿼리
SELECT * FROM employees WHERE employee_id = '1131' AND name = '김창훈';










