-- 배포용 데이터베이스 마이그레이션
-- Supabase SQL Editor에서 실행하세요

-- Posts 테이블에 작성자 정보 컬럼 추가
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS author_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS author_employee_id VARCHAR(20);

-- Comments 테이블에도 작성자 정보 컬럼 추가
ALTER TABLE comments 
ADD COLUMN IF NOT EXISTS author_name VARCHAR(100),
ADD COLUMN IF NOT EXISTS author_employee_id VARCHAR(20);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_posts_author_employee_id ON posts(author_employee_id);
CREATE INDEX IF NOT EXISTS idx_comments_author_employee_id ON comments(author_employee_id);
