# 🚀 배포 가이드

## GitHub 저장소
- **저장소 URL**: https://github.com/hun5295-png/board.git
- **브랜치**: main

## Vercel 배포 방법

### 1. Vercel 계정 생성
1. [Vercel](https://vercel.com)에 접속하여 계정을 생성하세요.
2. GitHub 계정으로 로그인하세요.

### 2. 프로젝트 가져오기
1. Vercel 대시보드에서 "New Project" 클릭
2. "Import Git Repository" 선택
3. `hun5295-png/board` 저장소 선택
4. "Import" 클릭

### 3. 환경변수 설정
Vercel 대시보드의 프로젝트 설정에서 다음 환경변수를 추가하세요:

```
NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key
```

### 4. 배포 설정
- **Framework Preset**: Next.js
- **Root Directory**: ./
- **Build Command**: `npm run build`
- **Output Directory**: .next

### 5. 배포 실행
1. "Deploy" 버튼 클릭
2. 배포 완료 후 제공되는 URL로 접속

## Supabase 설정

### 1. Supabase 프로젝트 생성
1. [Supabase](https://supabase.com)에 접속
2. 새 프로젝트 생성
3. 프로젝트 URL과 API 키 복사

### 2. 데이터베이스 설정
Supabase SQL Editor에서 다음 SQL을 실행하세요:

```sql
-- 직원 정보 테이블 생성
CREATE TABLE IF NOT EXISTS employees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    employee_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    department VARCHAR(100),
    position VARCHAR(100),
    email VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 카테고리 테이블 생성
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 프로필 테이블 생성
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    employee_id VARCHAR(20),
    name VARCHAR(100),
    department VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);

-- RLS 활성화
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS 정책
CREATE POLICY "직원 정보 조회는 모든 인증된 사용자 가능" ON employees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "직원 정보 수정은 관리자만 가능" ON employees
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "카테고리 조회는 모든 사용자 가능" ON categories
    FOR SELECT USING (true);

CREATE POLICY "프로필 조회는 본인만 가능" ON profiles
    FOR SELECT USING (auth.uid() = id);

-- 업데이트 시간 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 샘플 데이터 삽입
INSERT INTO categories (name, slug, description, is_anonymous) VALUES
('공지사항', 'notice', '회사 공지사항을 게시하는 게시판입니다.', false),
('업무공유', 'work-share', '업무 관련 정보를 공유하는 게시판입니다.', false),
('자유게시판', 'free-board', '자유롭게 소통하는 게시판입니다.', false),
('익명게시판(느티나무)', 'anonymous', '익명으로 소통하는 게시판입니다.', true);

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

## 로컬 개발 환경 설정

### 1. 의존성 설치
```bash
npm install
```

### 2. 환경변수 설정
`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행
```bash
npm run dev
```

## 기능 설명

### 🔐 로그인 시스템
- **사번 로그인**: 사번과 이름으로 간편 로그인
- **데모 모드**: Supabase 연결 없이도 로컬에서 테스트 가능

### 📋 게시판 기능
- **공지사항**: 회사 공지사항 게시
- **업무공유**: 업무 관련 정보 공유
- **자유게시판**: 자유로운 소통
- **익명게시판**: 익명으로 소통하는 공간

### 👥 관리자 기능
- **직원 관리**: 직원 정보 추가, 수정, 삭제
- **권한 관리**: 관리자 권한 설정

### 🎨 UI/UX
- **반응형 디자인**: 모바일 친화적
- **글래스모피즘**: 현대적인 디자인
- **애니메이션**: 부드러운 전환 효과

## 문제 해결

### 1. 빌드 오류
- Node.js 버전 확인 (18.x 이상 권장)
- 의존성 재설치: `rm -rf node_modules package-lock.json && npm install`

### 2. Supabase 연결 오류
- 환경변수 확인
- Supabase 프로젝트 상태 확인
- RLS 정책 확인

### 3. 배포 오류
- Vercel 로그 확인
- 환경변수 설정 확인
- 빌드 명령어 확인

## 지원

문제가 발생하면 다음을 확인하세요:
1. GitHub Issues에 문제 보고
2. Supabase 문서 참조
3. Vercel 문서 참조
