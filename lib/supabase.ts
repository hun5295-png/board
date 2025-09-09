import { createClient } from '@supabase/supabase-js'

// 환경변수에서 Supabase 설정 가져오기 (Vercel 배포용 기본값 포함)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yohabzjiqyhmuowgkcep.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvaGFiemppcXlobXVvd2drY2VwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MDgwMDEsImV4cCI6MjA2MjA4NDAwMX0.neKxFyiUbjSwPUUpjimMHXKLCE5Ds5OKcF2JJnBR3dg'

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

console.log('✅ Supabase 연결 모드로 실행 중입니다!')