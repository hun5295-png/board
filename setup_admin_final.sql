-- 1131 김창훈을 관리자로 설정하는 최종 SQL
-- 이 파일을 Supabase SQL Editor에서 실행하세요

-- 1. 1131 김창훈 직원 정보 확인
SELECT * FROM employees WHERE employee_id = '1131' AND name = '김창훈';

-- 2. profiles 테이블에 관리자 권한으로 삽입
INSERT INTO profiles (id, email, full_name, department, is_admin)
VALUES (
    gen_random_uuid(),
    '1131@company.local',
    '김창훈',
    '방사선실',
    true
);

-- 3. 관리자 설정 확인
SELECT * FROM profiles WHERE email = '1131@company.local';

-- 4. 추가 테스트용 직원들도 설정 (선택사항)
-- 2번 김징균도 관리자로 설정
INSERT INTO profiles (id, email, full_name, department, is_admin)
VALUES (
    gen_random_uuid(),
    '2@company.local',
    '김징균',
    '의국',
    true
);

-- 3번 김징현도 관리자로 설정
INSERT INTO profiles (id, email, full_name, department, is_admin)
VALUES (
    gen_random_uuid(),
    '3@company.local',
    '김징현',
    '의국',
    true
);

-- 5. 모든 관리자 확인
SELECT * FROM profiles WHERE is_admin = true;
