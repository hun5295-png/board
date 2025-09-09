// Mock Supabase 클라이언트 - 데모 실행을 위한 가짜 Supabase 구현

import { mockCategories, mockPosts, mockComments, mockUser, mockEmployees } from './data'

// 런타임 데이터 저장소 (실제 데이터 추가/수정 가능)
let runtimePosts = [...mockPosts]
let runtimeComments = [...mockComments]
let runtimeCategories = [...mockCategories]
let runtimeEmployees = Array.isArray(mockEmployees) ? [...mockEmployees] : []

// 데모 모드 감지 (실제 Supabase URL이 아닌 경우)
export const isDemoMode = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  
  // 환경변수가 없거나 기본값인 경우 데모 모드
  return !url || 
         !anonKey || 
         url === 'https://your-project.supabase.co' || 
         anonKey === 'your-anon-key' ||
         url.includes('demo.supabase.co')
}

// Mock 인증 객체
const mockAuth = {
  getUser: async () => ({
    data: { user: mockUser },
    error: null
  }),
  signInWithPassword: async ({ email, password }: { email: string, password: string }) => {
    // 데모용 간단한 로그인 (실제로는 보안상 위험함)
    if (email && password) {
      return { data: { user: mockUser }, error: null }
    }
    return { data: { user: null }, error: { message: '이메일과 비밀번호를 입력해주세요.' } }
  },
  signUp: async ({ email, password, options }: { email: string, password: string, options?: any }) => {
    // 사번 로그인을 위한 가짜 회원가입
    if (email && password) {
      return { data: { user: mockUser }, error: null }
    }
    return { data: { user: null }, error: { message: '이메일과 비밀번호를 입력해주세요.' } }
  },
  signOut: async () => ({ error: null })
}

// Mock Supabase 클라이언트
export const createMockSupabaseClient = () => {
  return {
    auth: mockAuth,
    from: (table: string) => ({
      select: (columns?: string) => {
        // 간단한 Promise 반환
        const data = table === 'categories' ? runtimeCategories : 
                    table === 'employees' ? runtimeEmployees :
                    table === 'posts' ? runtimePosts :
                    table === 'comments' ? runtimeComments : []
        
        return Promise.resolve({
          data,
          error: null
        })
      },
      insert: (values: any) => {
        // 실제로 런타임 데이터에 추가
        const newItem = {
          id: Date.now().toString(),
          ...values,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        if (table === 'posts') {
          runtimePosts.unshift(newItem) // 최신 글을 맨 위에 추가
          console.log('새 게시글 추가됨:', newItem.title)
        } else if (table === 'comments') {
          runtimeComments.push(newItem)
          console.log('새 댓글 추가됨:', newItem.content.substring(0, 20) + '...')
        } else if (table === 'employees') {
          runtimeEmployees.push(newItem)
          console.log('새 직원 추가됨:', newItem.name)
        }
        
        return Promise.resolve({
          data: [newItem],
          error: null
        })
      },
      update: (values: any) => ({
        eq: (column: string, value: any) => 
          Promise.resolve({
            data: updateData(table, column, value, values),
            error: null
          })
      }),
      delete: () => ({
        eq: (column: string, value: any) => 
          Promise.resolve({
            data: deleteData(table, column, value),
            error: null
          })
      })
    }),
    rpc: (functionName: string, params?: any) => 
      Promise.resolve({
        data: null,
        error: null
      })
  }
}

// 헬퍼 함수들
const getFilteredData = (table: string, column: string, value: any, options?: any) => {
  let data: any[] = []
  
  if (table === 'categories') {
    data = [...runtimeCategories]
  } else if (table === 'posts') {
    data = runtimePosts.filter(p => p[column as keyof typeof p] === value)
  } else if (table === 'comments') {
    data = runtimeComments.filter(c => c[column as keyof typeof c] === value)
  } else if (table === 'employees') {
    data = runtimeEmployees.filter(e => e[column as keyof typeof e] === value)
  }
  
  if (options?.ascending === false) {
    data.reverse()
  }
  
  return data
}

const getAllData = (table: string, options?: any) => {
  let data: any[] = []
  
  if (table === 'categories') {
    data = [...runtimeCategories]
  } else if (table === 'posts') {
    data = [...runtimePosts]
  } else if (table === 'comments') {
    data = [...runtimeComments]
  } else if (table === 'employees') {
    data = [...runtimeEmployees]
  }
  
  if (options?.ascending === false) {
    data.reverse()
  }
  
  return data
}

// 업데이트 함수
const updateData = (table: string, column: string, value: any, updateValues: any) => {
  if (table === 'posts') {
    const index = runtimePosts.findIndex(p => p[column as keyof typeof p] === value)
    if (index !== -1) {
      runtimePosts[index] = {
        ...runtimePosts[index],
        ...updateValues,
        updated_at: new Date().toISOString()
      }
      console.log('게시글 수정됨:', runtimePosts[index].title)
      return [runtimePosts[index]]
    }
  } else if (table === 'comments') {
    const index = runtimeComments.findIndex(c => c[column as keyof typeof c] === value)
    if (index !== -1) {
      runtimeComments[index] = {
        ...runtimeComments[index],
        ...updateValues,
        updated_at: new Date().toISOString()
      }
      console.log('댓글 수정됨:', runtimeComments[index].content.substring(0, 20) + '...')
      return [runtimeComments[index]]
    }
  } else if (table === 'employees') {
    const index = runtimeEmployees.findIndex(e => e[column as keyof typeof e] === value)
    if (index !== -1) {
      runtimeEmployees[index] = {
        ...runtimeEmployees[index],
        ...updateValues,
        updated_at: new Date().toISOString()
      }
      console.log('직원 정보 수정됨:', runtimeEmployees[index].name)
      return [runtimeEmployees[index]]
    }
  } else if (table === 'profiles') {
    // 프로필 업데이트는 항상 성공 (데모용)
    console.log('프로필 업데이트됨:', updateValues)
    return [{ id: 'demo-user', ...updateValues }]
  }
  return []
}

// 삭제 함수
const deleteData = (table: string, column: string, value: any) => {
  if (table === 'posts') {
    const index = runtimePosts.findIndex(p => p[column as keyof typeof p] === value)
    if (index !== -1) {
      const deleted = runtimePosts.splice(index, 1)
      console.log('게시글 삭제됨:', deleted[0]?.title)
      return deleted
    }
  } else if (table === 'comments') {
    const index = runtimeComments.findIndex(c => c[column as keyof typeof c] === value)
    if (index !== -1) {
      const deleted = runtimeComments.splice(index, 1)
      console.log('댓글 삭제됨:', deleted[0]?.content.substring(0, 20) + '...')
      return deleted
    }
  } else if (table === 'employees') {
    const index = runtimeEmployees.findIndex(e => e[column as keyof typeof e] === value)
    if (index !== -1) {
      const deleted = runtimeEmployees.splice(index, 1)
      console.log('직원 삭제됨:', deleted[0]?.name)
      return deleted
    }
  }
  return []
}

// localStorage를 사용한 간단한 상태 관리 (데모용)
export const mockStorage = {
  setItem: (key: string, value: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    }
  },
  getItem: (key: string) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    }
    return null
  },
  removeItem: (key: string) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    }
  }
}
