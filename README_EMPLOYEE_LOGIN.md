# 직원 전용 게시판 - 사번 로그인 시스템

## 🚀 새로운 기능

### 1. 사번과 이름으로 로그인
- 기존 이메일 로그인과 함께 사번/이름 로그인 기능 추가
- 첨부된 직원 목록의 사번과 이름으로 간편 로그인 가능

### 2. 직원 관리 시스템
- 관리자 전용 직원 관리 페이지 (`/admin/employees`)
- 직원 추가, 수정, 삭제 기능
- 부서별 검색 및 필터링

## 📋 설정 방법

### 1. 데이터베이스 설정

Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
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

-- RLS 정책
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
```

### 2. 관리자 권한 설정

기존 사용자를 관리자로 설정하려면:

```sql
-- 특정 사용자를 관리자로 설정 (user_id는 실제 사용자 ID로 교체)
UPDATE profiles 
SET is_admin = true 
WHERE id = 'your-user-id-here';
```

## 🎯 사용 방법

### 로그인 방법

1. **사번 로그인** (기본)
   - 사번: `2`
   - 이름: `김상균`
   - 또는 첨부된 목록의 다른 사번/이름 조합

2. **이메일 로그인**
   - 기존 이메일과 비밀번호로 로그인

### 관리자 기능

1. 메인 페이지에서 "직원관리" 버튼 클릭
2. 직원 추가, 수정, 삭제 가능
3. 부서별 검색 및 필터링

## 🔧 기술적 구현

### 로그인 시스템
- 사번과 이름으로 직원 테이블에서 인증
- 임시 이메일(`사번@company.local`)로 Supabase Auth 연동
- 자동 프로필 생성 및 업데이트

### 보안
- Row Level Security (RLS) 적용
- 관리자만 직원 정보 수정 가능
- 일반 사용자는 조회만 가능

### UI/UX
- 로그인 타입 선택 탭
- 반응형 디자인
- 직관적인 관리자 인터페이스

## 📁 파일 구조

```
pages/
├── login.tsx              # 로그인 페이지 (사번/이메일 통합)
├── index.tsx              # 메인 페이지 (관리자 메뉴 추가)
└── admin/
    └── employees.tsx      # 직원 관리 페이지

database/
└── employees_data.sql     # 직원 데이터 SQL
```

## 🚨 주의사항

1. **데이터베이스 설정**: 위의 SQL을 Supabase에서 실행해야 합니다.
2. **관리자 권한**: 최소 한 명의 사용자를 관리자로 설정해야 합니다.
3. **보안**: 사번 로그인은 기본 비밀번호(`default123`)를 사용하므로, 필요시 추가 보안 조치를 고려하세요.

## 🎉 완료된 기능

- ✅ 사번과 이름으로 로그인
- ✅ 직원 관리 페이지
- ✅ 관리자 권한 시스템
- ✅ 기존 이메일 로그인과 통합
- ✅ 반응형 UI/UX
- ✅ Supabase 연동










