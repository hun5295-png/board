import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function DebugLogin() {
  const [employeeId, setEmployeeId] = useState('1131')
  const [employeeName, setEmployeeName] = useState('김창훈')
  const [logs, setLogs] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  const testLogin = async () => {
    setLoading(true)
    setLogs([])
    
    try {
      addLog('로그인 테스트 시작')
      
      // 1. 직원 정보 조회
      addLog(`직원 조회 시도: 사번=${employeeId}, 이름=${employeeName}`)
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('name', employeeName)
        .maybeSingle()

      if (employeeError) {
        addLog(`직원 조회 오류: ${employeeError.message}`)
        return
      }

      if (!employee) {
        addLog('직원을 찾을 수 없습니다.')
        return
      }

      addLog(`직원 조회 성공: ${employee.name} (${employee.department})`)

      // 2. 임시 이메일 생성
      const tempEmail = `emp${employeeId}@company.com`
      addLog(`임시 이메일 생성: ${tempEmail}`)

      // 3. Supabase Auth 로그인 시도
      addLog('Supabase Auth 로그인 시도')
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: tempEmail,
        password: 'default123'
      })

      if (authError) {
        addLog(`Auth 로그인 실패: ${authError.message}`)
        
        // 4. 사용자 생성 시도
        addLog('사용자 생성 시도')
        const { error: signUpError } = await supabase.auth.signUp({
          email: tempEmail,
          password: 'default123',
          options: {
            data: {
              full_name: employee.name,
              employee_id: employee.employee_id,
              department: employee.department
            }
          }
        })

        if (signUpError) {
          addLog(`사용자 생성 실패: ${signUpError.message}`)
          return
        }

        addLog('사용자 생성 성공')
      } else {
        addLog('Auth 로그인 성공')
      }

      // 5. 프로필 확인/생성
      addLog('프로필 확인')
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', tempEmail)
        .single()

      if (profileError && profileError.code !== 'PGRST116') {
        addLog(`프로필 조회 오류: ${profileError.message}`)
      } else if (!profile) {
        addLog('프로필이 없습니다. 생성 시도')
        // 프로필 생성은 별도로 처리
      } else {
        addLog(`프로필 확인: ${profile.full_name} (관리자: ${profile.is_admin})`)
      }

      addLog('로그인 테스트 완료!')

    } catch (error: any) {
      addLog(`예외 발생: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">로그인 디버깅</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 입력 폼 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">로그인 정보</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  사번
                </label>
                <input
                  type="text"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="사번을 입력하세요"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름
                </label>
                <input
                  type="text"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="이름을 입력하세요"
                />
              </div>
              
              <button
                onClick={testLogin}
                disabled={loading}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? '테스트 중...' : '로그인 테스트'}
              </button>
            </div>

            <div className="mt-6 text-center">
              <a href="/login" className="text-blue-500 hover:underline">
                실제 로그인 페이지로 이동
              </a>
            </div>
          </div>

          {/* 로그 출력 */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">디버그 로그</h2>
            
            <div className="bg-gray-900 text-green-400 p-4 rounded-md h-96 overflow-y-auto font-mono text-sm">
              {logs.length === 0 ? (
                <div className="text-gray-500">로그인 테스트를 실행하면 로그가 여기에 표시됩니다.</div>
              ) : (
                logs.map((log, index) => (
                  <div key={index} className="mb-1">{log}</div>
                ))
              )}
            </div>
            
            <button
              onClick={() => setLogs([])}
              className="mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              로그 지우기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
