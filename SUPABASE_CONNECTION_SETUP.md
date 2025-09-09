# Supabase 연결 설정 가이드

## 🔗 Supabase 프로젝트 정보

현재 연결된 Supabase 프로젝트 정보:
- **프로젝트 URL**: `https://yohabzjiqyhmuowgkcep.supabase.co`
- **Anon Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGFiemppcXlobXVvd2drY2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDgwMDEsImV4cCI6MjA2MjA4NDAwMX0.neKxFyiUbjSwPUUpjimMHXKLCE5Ds5OKcF2JJnBR3dg`

## 📝 환경변수 설정

`.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yohabzjiqyhmuowgkcep.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGFiemppcXlobXVvd2drY2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDgwMDEsImV4cCI6MjA2MjA4NDAwMX0.neKxFyiUbjSwPUUpjimMHXKLCE5Ds5OKcF2JJnBR3dg
```

## 🗄️ 데이터베이스 스키마 생성

Supabase 대시보드의 SQL Editor에서 다음 스키마를 실행하세요:

### 1. 기본 테이블 생성

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Categories 테이블 (카테고리)
CREATE TABLE categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Employees 테이블 (직원 정보)
CREATE TABLE employees (
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

-- Profiles 테이블 (사용자 프로필)
CREATE TABLE profiles (
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

-- Posts 테이블 (게시글)
CREATE TABLE posts (
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

-- Comments 테이블 (댓글)
CREATE TABLE comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    content TEXT NOT NULL,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    author_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_anonymous BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Post_files 테이블 (첨부파일)
CREATE TABLE post_files (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Notifications 테이블 (알림)
CREATE TABLE notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    type VARCHAR(50) NOT NULL, -- 'comment', 'notice', 'mention' 등
    title VARCHAR(200) NOT NULL,
    message TEXT,
    related_post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    related_comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Post_likes 테이블 (좋아요)
CREATE TABLE post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (post_id, user_id)
);

-- Bookmarks 테이블 (북마크)
CREATE TABLE bookmarks (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    PRIMARY KEY (post_id, user_id)
);
```

### 2. 인덱스 생성

```sql
-- 인덱스 생성
CREATE INDEX idx_posts_category_id ON posts(category_id);
CREATE INDEX idx_posts_author_id ON posts(author_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_author_id ON comments(author_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_employees_employee_id ON employees(employee_id);
```

### 3. RLS 정책 설정

```sql
-- Row Level Security (RLS) 활성화
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- RLS 정책들
-- Profiles 정책
CREATE POLICY "프로필 조회는 모든 인증된 사용자 가능" ON profiles
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "프로필 수정은 본인만 가능" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Employees 정책 (관리자만 조회/수정 가능)
CREATE POLICY "직원 정보 조회는 인증된 사용자 가능" ON employees
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "직원 정보 수정은 관리자만 가능" ON employees
    FOR ALL USING (
        EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND is_admin = TRUE)
    );

-- Posts 정책
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

-- Comments 정책
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

-- Notifications 정책
CREATE POLICY "알림은 본인것만 조회 가능" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "알림 읽음 처리는 본인만 가능" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);
```

### 4. 트리거 함수 생성

```sql
-- 프로필 자동 생성 트리거
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

-- 게시글/댓글 수정 시간 업데이트 트리거
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

-- 댓글 작성 시 알림 생성 트리거
CREATE OR REPLACE FUNCTION create_comment_notification()
RETURNS TRIGGER AS $$
DECLARE
    post_author_id UUID;
    post_title TEXT;
BEGIN
    -- 게시글 작성자 정보 조회
    SELECT author_id, title INTO post_author_id, post_title 
    FROM posts WHERE id = NEW.post_id;
    
    -- 본인 댓글이 아닌 경우에만 알림 생성
    IF post_author_id != NEW.author_id THEN
        INSERT INTO notifications (user_id, type, title, message, related_post_id, related_comment_id)
        VALUES (
            post_author_id,
            'comment',
            '새 댓글이 달렸습니다',
            '게시글 "' || post_title || '"에 새로운 댓글이 달렸습니다.',
            NEW.post_id,
            NEW.id
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_comment_created
    AFTER INSERT ON comments
    FOR EACH ROW EXECUTE FUNCTION create_comment_notification();

-- 조회수 증가 함수
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE posts
    SET view_count = view_count + 1
    WHERE id = post_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 5. 기본 데이터 삽입

```sql
-- Categories 기본 데이터 삽입
INSERT INTO categories (name, slug, description, is_anonymous) VALUES
('공지사항', 'notice', '회사 공지사항을 게시하는 게시판입니다.', FALSE),
('업무공유', 'work-share', '업무 관련 정보를 공유하는 게시판입니다.', FALSE),
('자유게시판', 'free-board', '자유롭게 소통하는 게시판입니다.', FALSE),
('익명게시판(느티나무)', 'anonymous', '익명으로 소통하는 게시판입니다.', TRUE);

-- Employees 기본 데이터 삽입
INSERT INTO employees (employee_id, name, department, position, email, phone, is_active) VALUES
('2', '김상균', '외국', '팀장', 'kim@company.com', '010-1234-5678', TRUE),
('163', '서정에', '약지과', '대리', 'seo@company.com', '010-2345-6789', TRUE),
('101', '이영희', '인사팀', '과장', 'lee@company.com', '010-3456-7890', TRUE),
('205', '박민수', '개발팀', '부장', 'park@company.com', '010-4567-8901', TRUE),
('88', '정수진', '마케팅팀', '차장', 'jung@company.com', '010-5678-9012', TRUE);
```

## 🚀 서버 재시작

환경변수 설정 후 서버를 재시작하세요:

```bash
npm run dev
```

## ✅ 테스트

1. 브라우저에서 `http://localhost:3000` 접속
2. 사번: `2`, 이름: `김상균`으로 로그인
3. 모든 기능 테스트

## 📋 주요 기능

- ✅ 사번과 이름으로 로그인
- ✅ 직원 관리 (관리자 전용)
- ✅ 게시판 시스템 (공지사항, 업무공유, 자유게시판, 익명게시판)
- ✅ 댓글 시스템
- ✅ 알림 시스템
- ✅ 파일 첨부
- ✅ 좋아요/북마크
- ✅ Row Level Security (RLS)




