import Cookies from 'js-cookie'

export interface User {
  id: string
  employee_id: string
  name: string
  department: string
  position: string
  email: string
  phone: string
  is_admin: boolean
}

// 사용자 정보 저장 (쿠키와 localStorage 모두 사용)
export const saveUser = (user: User) => {
  try {
    // localStorage에 저장 (PC용)
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user))
    }
    
    // 쿠키에 저장 (모바일용)
    Cookies.set('user', JSON.stringify(user), { 
      expires: 7, // 7일
      secure: true, // HTTPS에서만 전송
      sameSite: 'lax' // CSRF 보호
    })
  } catch (error) {
    console.error('사용자 정보 저장 실패:', error)
  }
}

// 사용자 정보 가져오기
export const getUser = (): User | null => {
  try {
    // 먼저 localStorage에서 시도
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem('user')
      if (localUser) {
        return JSON.parse(localUser)
      }
    }
    
    // localStorage가 실패하면 쿠키에서 시도
    const cookieUser = Cookies.get('user')
    if (cookieUser) {
      const user = JSON.parse(cookieUser)
      // 쿠키에서 가져온 사용자 정보를 localStorage에도 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(user))
      }
      return user
    }
    
    return null
  } catch (error) {
    console.error('사용자 정보 가져오기 실패:', error)
    return null
  }
}

// 사용자 정보 삭제
export const removeUser = () => {
  try {
    // localStorage에서 삭제
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
    
    // 쿠키에서 삭제
    Cookies.remove('user')
  } catch (error) {
    console.error('사용자 정보 삭제 실패:', error)
  }
}

// 관리자 권한 확인
export const isAdmin = (): boolean => {
  const user = getUser()
  return user?.is_admin || false
}

// 로그인 상태 확인
export const isLoggedIn = (): boolean => {
  return getUser() !== null
}
