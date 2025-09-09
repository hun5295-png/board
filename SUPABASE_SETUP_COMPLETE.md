# Supabase 완전 설정 가이드

## 🚀 1단계: Supabase 프로젝트 생성

### 1.1 Supabase 대시보드 접속
1. [https://supabase.com](https://supabase.com) 접속
2. "Start your project" 클릭
3. GitHub 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "New Project" 클릭
2. 프로젝트 정보 입력:
   - **Organization**: 개인 계정 또는 조직 선택
   - **Project name**: `employee-board`
   - **Database Password**: 강력한 비밀번호 설정 (기억해두세요!)
   - **Region**: `Northeast Asia (Seoul)` 선택
3. "Create new project" 클릭

### 1.3 프로젝트 설정 완료 대기
- 프로젝트 생성에 2-3분 소요
- "Project is ready" 메시지 확인

## 🔑 2단계: API 키 확인

### 2.1 API 키 복사
1. 프로젝트 대시보드 → **Settings** → **API**
2. 다음 정보 복사:
   - **Project URL**: `https://your-project-id.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🗄️ 3단계: 데이터베이스 스키마 적용

### 3.1 SQL Editor 열기
1. 프로젝트 대시보드 → **SQL Editor**
2. "New query" 클릭

### 3.2 스키마 실행
아래 SQL을 복사하여 실행:

```sql
-- 기존 테이블들 (이미 있다면 무시)
-- Categories 테이블
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Categories 기본 데이터
INSERT INTO categories (name, slug, description, is_anonymous) VALUES
('공지사항', 'notice', '회사 공지사항을 게시하는 게시판입니다.', FALSE),
('업무공유', 'work-share', '업무 관련 정보를 공유하는 게시판입니다.', FALSE),
('자유게시판', 'free-board', '자유롭게 소통하는 게시판입니다.', FALSE),
('익명게시판(느티나무)', 'anonymous', '익명으로 소통하는 게시판입니다.', TRUE)
ON CONFLICT (name) DO NOTHING;

-- Profiles 테이블
CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    department VARCHAR(100),
    position VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    notification_enabled BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Posts 테이블
CREATE TABLE IF NOT EXISTS posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Comments 테이블
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 직원 정보 테이블 (새로 추가)
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

-- 직원 데이터 삽입
INSERT INTO employees (employee_id, name, department, position, email, phone) VALUES
('2', '김상균', '외국', '팀장', 'kim@company.com', '010-1234-5678'),
('163', '서정에', '약지과', '대리', 'seo@company.com', '010-2345-6789'),
('267', '백두심', '임상병리실', '과장', 'baek@company.com', '010-3456-7890'),
('549', '차제우', '원무', '대리', 'cha@company.com', '010-4567-8901'),
('1237', '구선화', '건강증진센터', '부장', 'gu@company.com', '010-5678-9012'),
('1509', '김민혜', '5층상급', '과장', 'kimmin@company.com', '010-6789-0123'),
('1750', '박용주', 'SEROUM', '대리', 'park@company.com', '010-7890-1234'),
('1831', '최평택', '방사선실', '과장', 'choi@company.com', '010-8901-2345'),
('9347', '이다림', '임상병리실', '대리', 'lee@company.com', '010-9012-3456'),
('9440', '최다빈', '원무', '대리', 'choi2@company.com', '010-0123-4567'),
('9513', '류정은', '심사', '과장', 'ryu@company.com', '010-1234-5679'),
('9561', '공민지', '방사선실', '대리', 'gong@company.com', '010-2345-6780'),
('9580', '이경애', '진료협력센터', '부장', 'leek@company.com', '010-3456-7891')
ON CONFLICT (employee_id) DO NOTHING;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_employees_employee_id ON employees(employee_id);
CREATE INDEX IF NOT EXISTS idx_employees_name ON employees(name);
CREATE INDEX IF NOT EXISTS idx_employees_department ON employees(department);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON posts(category_id);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_post_id ON comments(post_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_id ON comments(author_id);

-- RLS 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- RLS 정책들
CREATE POLICY "프로필 조회는 모든 인증된 사용자 가능" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "프로필 수정은 본인만 가능" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "게시글 조회는 모든 인증된 사용자 가능" ON posts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "게시글 작성은 인증된 사용자 가능" ON posts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "게시글 수정은 본인 또는 관리자만 가능" ON posts
    FOR UPDATE USING (
        auth.uid() = author_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "게시글 삭제는 본인 또는 관리자만 가능" ON posts
    FOR DELETE USING (
        auth.uid() = author_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "댓글 조회는 모든 인증된 사용자 가능" ON comments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "댓글 작성은 인증된 사용자 가능" ON comments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "댓글 수정은 본인만 가능" ON comments
    FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "댓글 삭제는 본인 또는 관리자만 가능" ON comments
    FOR DELETE USING (
        auth.uid() = author_id OR 
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

CREATE POLICY "직원 정보 조회는 모든 인증된 사용자 가능" ON employees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "직원 정보 수정은 관리자만 가능" ON employees
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- 트리거 함수들
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## 🔧 4단계: 환경변수 설정

### 4.1 .env.local 파일 생성
프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Supabase 환경변수
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4.2 환경변수 적용
```bash
# 개발 서버 재시작
npm run dev
```

## ✅ 5단계: 테스트

### 5.1 로그인 테스트
1. 브라우저에서 `http://localhost:3000/login` 접속
2. 사번: `2`, 이름: `김상균`으로 로그인
3. 성공 시 메인 페이지로 이동

### 5.2 관리자 권한 설정
SQL Editor에서 실행:
```sql
-- 특정 사용자를 관리자로 설정 (user_id는 실제 사용자 ID로 교체)
UPDATE profiles 
SET is_admin = true, 
    full_name = '관리자',
    department = 'IT팀',
    position = '팀장'
WHERE id = 'your-user-id-here';
```

## 🎉 완료!

이제 실제 Supabase 데이터베이스를 사용하여 모든 기능이 작동합니다:
- ✅ 사번과 이름으로 로그인
- ✅ 직원 관리 시스템
- ✅ 게시판 기능
- ✅ 실시간 알림
- ✅ 파일 업로드




