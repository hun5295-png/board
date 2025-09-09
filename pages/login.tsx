import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function Login() {
  const router = useRouter()
  const [employeeId, setEmployeeId] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // employees 테이블에서 사번과 이름으로 직원 조회
      const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('name', name)
        .single()

      if (error) throw error

      if (!employee) {
        throw new Error('사번 또는 이름이 올바르지 않습니다.')
      }

      // 로그인 성공 시 사용자 정보를 localStorage에 저장
      localStorage.setItem('user', JSON.stringify({
        id: employee.id,
        employee_id: employee.employee_id,
        name: employee.name,
        department: employee.department,
        position: employee.position,
        email: employee.email,
        phone: employee.phone,
        is_admin: false // 기본적으로 일반 사용자
      }))

      router.push('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 애니메이션 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-xl animate-pulse delay-2000"></div>
      </div>

      {/* 플로팅 파티클 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-2 h-2 bg-white/30 rounded-full animate-bounce"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-white/40 rounded-full animate-bounce delay-300"></div>
        <div className="absolute bottom-32 left-32 w-3 h-3 bg-white/20 rounded-full animate-bounce delay-700"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-white/35 rounded-full animate-bounce delay-1000"></div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* 로고 및 제목 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              환영합니다! 👋
            </h1>
            <p className="text-white/80 text-lg">
              직원 전용 게시판에 로그인하세요
            </p>
          </div>

          {/* 로그인 폼 */}
          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/20">
            <form onSubmit={handleLogin} className="space-y-6">
              {/* 사번 입력 */}
              <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-white mb-2">
                  사번
                </label>
                <input
                  id="employeeId"
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                  placeholder="사번을 입력하세요"
                  required
                />
              </div>

              {/* 이름 입력 */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                  이름
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent transition-all duration-200"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-4">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-200">
                        로그인 실패: {error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 로그인 버튼 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
              >
                {loading ? '로그인 중...' : '로그인'}
              </button>
            </form>

            {/* 도움말 */}
            <div className="mt-6 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-blue-300 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-blue-900 mb-1">사번 로그인</h3>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    첨부된 직원 목록에서 사번과 이름을 입력하세요.
                    <br />
                    <span className="font-medium">예시:</span> 사번 1131, 이름 김창훈
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 링크 */}
          <div className="text-center mt-8">
            <p className="text-white/60 text-sm">
              © 2024 직원 전용 게시판. 모든 권리 보유.
            </p>
          </div>
        </div>
      </div>

      {/* 하단 웨이브 효과 */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 320" className="w-full h-auto">
          <path 
            fill="rgba(255,255,255,0.1)" 
            fillOpacity="1" 
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,176C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>
    </div>
  )
}