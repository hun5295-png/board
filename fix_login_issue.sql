-- 로그인 문제 해결을 위한 RLS 정책 수정
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. 기존 RLS 정책 삭제
DROP POLICY IF EXISTS "직원 정보 조회는 인증된 사용자 가능" ON employees;

-- 2. 새로운 RLS 정책 생성 (모든 사용자가 직원 정보 조회 가능)
CREATE POLICY "직원 정보 조회는 모든 사용자 가능" ON employees
    FOR SELECT USING (true);

-- 3. 정책 확인
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'employees';

-- 4. 테스트 쿼리 (인증 없이도 실행되어야 함)
SELECT * FROM employees WHERE employee_id = '1131' AND name = '김창훈';

-- 5. 추가 테스트용 직원들도 확인
SELECT employee_id, name, department FROM employees 
WHERE employee_id IN ('2', '3', '163', '1131') 
ORDER BY employee_id;
