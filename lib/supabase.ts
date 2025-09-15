import { createClient } from '@supabase/supabase-js'

// 환경변수에서 Supabase 설정 가져오기
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 환경변수 확인
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase 환경변수가 설정되지 않았습니다!')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '설정됨' : '설정되지 않음')
  throw new Error('Supabase 환경변수가 설정되지 않았습니다. Vercel 대시보드에서 환경변수를 설정해주세요.')
}

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // 세션을 자동으로 저장하지 않음
    autoRefreshToken: false, // 토큰 자동 갱신 비활성화
    detectSessionInUrl: false // URL에서 세션 감지 비활성화
  }
})

// 연결 테스트
supabase.from('categories').select('count').limit(1).then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase 연결 실패:', error.message)
  } else {
    console.log('✅ Supabase 연결 성공!')
  }
}).catch(err => {
  console.error('❌ Supabase 연결 오류:', err)
})