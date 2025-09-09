-- 1131 김창훈을 관리자로 설정하는 SQL
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. 먼저 1131 김창훈 직원 정보 확인
SELECT * FROM employees WHERE employee_id = '1131' AND name = '김창훈';

-- 2. 임시 이메일로 사용자 생성 (이미 존재할 수 있음)
-- 이 부분은 Supabase Auth에서 수동으로 처리하거나
-- 다음 단계에서 profiles 테이블에 직접 삽입

-- 3. profiles 테이블에 관리자 권한으로 삽입
-- (실제 사용자 ID는 Supabase Auth에서 생성된 UUID를 사용해야 함)
-- 임시로 UUID를 생성하여 사용

INSERT INTO profiles (id, email, full_name, department, is_admin)
VALUES (
    gen_random_uuid(),
    '1131@company.local',
    '김창훈',
    '방사선실',
    true
) ON CONFLICT (id) 
DO UPDATE SET 
    is_admin = true,
    full_name = '김창훈',
    department = '방사선실',
    updated_at = NOW();

-- 4. 관리자 설정 확인
SELECT * FROM profiles WHERE email = '1131@company.local';




