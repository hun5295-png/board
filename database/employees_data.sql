-- 직원 정보 테이블 생성
CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE, -- 사번
    name VARCHAR(100) NOT NULL, -- 이름
    department VARCHAR(100), -- 부서/소속
    position VARCHAR(100), -- 직급
    email VARCHAR(255), -- 이메일 (선택사항)
    phone VARCHAR(20), -- 전화번호 (선택사항)
    is_active BOOLEAN DEFAULT TRUE, -- 활성 상태
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);

-- RLS 활성화
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- RLS 정책 (관리자만 모든 작업 가능, 일반 사용자는 조회만)
CREATE POLICY "직원 정보 조회는 모든 인증된 사용자 가능" ON employees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "직원 정보 수정은 관리자만 가능" ON employees
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- 업데이트 시간 트리거
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 첨부파일에서 추출한 직원 데이터 삽입
INSERT INTO employees (employee_id, name, department) VALUES
('2', '김상균', '외국'),
('163', '서정에', '약지과'),
('267', '백두심', '임상병리실'),
('549', '차제우', '원무'),
('1237', '구선화', '건강증진센터'),
('1509', '김민혜', '5층상급'),
('1750', '박용주', 'SEROUM'),
('1831', '최평택', '방사선실'),
('9347', '이다림', '임상병리실'),
('9440', '최다빈', '원무'),
('9513', '류정은', '심사'),
('9561', '공민지', '방사선실'),
('9580', '이경애', '진료협력센터');



