import { useState } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabase'

export default function SimpleLogin() {
  const router = useRouter()
  const [employeeId, setEmployeeId] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 사번과 이름으로 직접 로그인 (이메일 검증 없음, UUID 오류 없음)
      const result = await supabase
        .from('employees')
        .select('employee_id, name, department')
        .eq('employee_id', employeeId)
        .eq('name', employeeName)
        .single()
      
      const employee = result.data
      const employeeError = result.error

      if (employeeError || !employee) {
        throw new Error('사번 또는 이름이 올바르지 않습니다.')
      }

      // 로컬 스토리지에 사용자 정보 저장 (즉시 로그인)
      const userData = {
        id: employee.employee_id,
        employee_id: employee.employee_id,
        name: employee.name,
        department: employee.department,
        is_admin: false,
        loginTime: new Date().toISOString()
      }

      localStorage.setItem('user', JSON.stringify(userData))
      router.push('/')
      
    } catch (error: any) {
      console.error('로그인 오류:', error)
      setError(`로그인 실패: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">직원 로그인</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
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
              required
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
              required
            />
          </div>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-sm text-gray-600">
            예시: 사번 2, 이름 김징균
          </p>
          <a href="/login" className="text-blue-500 hover:underline block">
            메인 로그인 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  )
}