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

      // 로그인 성공 시 사용자 정보를 sessionStorage에 저장 (단순하게)
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('user', JSON.stringify({
          id: employee.id,
          employee_id: employee.employee_id,
          name: employee.name,
          department: employee.department,
          position: employee.position || '',
          email: employee.email || '',
          phone: employee.phone || '',
          is_admin: false
        }))
      }

      router.push('/')
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600"></div>

      {/* 메인 콘텐츠 */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 py-12">
        <div className="w-full max-w-md">
          {/* 제목 */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              직원 로그인
            </h1>
            <p className="text-white/80 text-lg">
              사번과 이름을 입력하세요
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
                  <p className="text-sm text-red-200">
                    {error}
                  </p>
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

            {/* 테스트 정보 */}
            <div className="mt-6 p-4 bg-blue-500/20 backdrop-blur-sm rounded-xl border border-blue-400/30">
              <h3 className="text-sm font-semibold text-blue-100 mb-2">테스트 계정</h3>
              <div className="text-xs text-blue-200 space-y-1">
                <div>사번: 1131, 이름: 김창훈</div>
                <div>사번: 2, 이름: 김징균</div>
                <div>사번: 163, 이름: 서정애</div>
                <div>사번: 267, 이름: 박두심</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}