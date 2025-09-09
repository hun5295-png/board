import { createClient } from '@supabase/supabase-js'

// 환경변수가 없을 때를 위한 기본값 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

// 간단한 Mock 데이터
const mockCategories = [
  {
    id: '1',
    name: '공지사항',
    slug: 'notice',
    description: '회사 공지사항을 게시하는 게시판입니다.',
    is_anonymous: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: '업무공유',
    slug: 'work-share',
    description: '업무 관련 정보를 공유하는 게시판입니다.',
    is_anonymous: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: '자유게시판',
    slug: 'free-board',
    description: '자유롭게 소통하는 게시판입니다.',
    is_anonymous: false,
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: '익명게시판(느티나무)',
    slug: 'anonymous',
    description: '익명으로 소통하는 게시판입니다.',
    is_anonymous: true,
    created_at: '2024-01-01T00:00:00Z'
  }
]

const mockEmployees = [
  {
    id: '1',
    employee_id: '2',
    name: '김상균',
    department: '외국',
    position: '팀장',
    email: 'kim@company.com',
    phone: '010-1234-5678',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    employee_id: '163',
    name: '서정에',
    department: '약지과',
    position: '대리',
    email: 'seo@company.com',
    phone: '010-2345-6789',
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

// 간단한 Mock Supabase 클라이언트
const createSimpleMockClient = () => ({
  auth: {
    getUser: async () => ({ data: { user: { id: 'demo-user', email: 'demo@company.com' } }, error: null }),
    signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
      if (email && password) {
        return { data: { user: { id: 'demo-user', email } }, error: null }
      }
      return { data: { user: null }, error: { message: '이메일과 비밀번호를 입력해주세요.' } }
    },
    signUp: async ({ email, password }: { email: string, password: string }) => {
      if (email && password) {
        return { data: { user: { id: 'demo-user', email } }, error: null }
      }
      return { data: { user: null }, error: { message: '이메일과 비밀번호를 입력해주세요.' } }
    },
    signOut: async () => ({ error: null })
  },
  from: (table: string) => ({
    select: () => ({
      eq: (column: string, value: any) => ({
        eq: (column2: string, value2: any) => ({
          single: async () => {
            if (table === 'employees') {
              const employee = mockEmployees.find(e => 
                e[column as keyof typeof e] === value && 
                e[column2 as keyof typeof e] === value2
              )
              return { data: employee, error: employee ? null : { message: '사번 또는 이름이 올바르지 않습니다.' } }
            }
            return { data: null, error: { message: 'Not found' } }
          }
        }),
        single: async () => {
          if (table === 'profiles') {
            return { data: { id: 'demo-user', is_admin: true }, error: null }
          }
          if (table === 'employees') {
            const employee = mockEmployees.find(e => e[column as keyof typeof e] === value)
            return { data: employee, error: employee ? null : { message: 'Not found' } }
          }
          return { data: null, error: { message: 'Not found' } }
        },
        order: (column: string, options: any) => {
          if (table === 'categories') {
            return Promise.resolve({ data: mockCategories, error: null })
          }
          if (table === 'employees') {
            return Promise.resolve({ data: mockEmployees, error: null })
          }
          return Promise.resolve({ data: [], error: null })
        }
      }),
      order: (column: string, options: any) => {
        if (table === 'categories') {
          return Promise.resolve({ data: mockCategories, error: null })
        }
        if (table === 'employees') {
          return Promise.resolve({ data: mockEmployees, error: null })
        }
        return Promise.resolve({ data: [], error: null })
      }
    }),
    insert: (values: any) => Promise.resolve({ data: [values], error: null }),
    update: (values: any) => ({
      eq: () => Promise.resolve({ data: [values], error: null })
    }),
    delete: () => ({
      eq: () => Promise.resolve({ data: [], error: null })
    })
  })
})

// 데모 모드인지 확인
const isDemo = !supabaseUrl || !supabaseAnonKey || 
               supabaseUrl === 'https://your-project.supabase.co' || 
               supabaseAnonKey === 'your-anon-key'

// Supabase 클라이언트 생성
export const supabase = isDemo 
  ? createSimpleMockClient()
  : createClient(supabaseUrl, supabaseAnonKey)

// 데모 모드 안내
if (isDemo) {
  console.log('🚀 데모 모드로 실행 중입니다!')
  console.log('📝 실제 Supabase 연결을 위해 .env.local 파일에 다음을 설정하세요:')
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_actual_supabase_url')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_actual_supabase_anon_key')
} else {
  console.log('✅ 실제 Supabase 연결 모드로 실행 중입니다!')
}