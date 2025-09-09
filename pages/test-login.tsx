import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TestLogin() {
  const [employeeId, setEmployeeId] = useState('1131')
  const [employeeName, setEmployeeName] = useState('김창훈')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testLogin = async () => {
    setLoading(true)
    setResult(null)

    try {
      // 1. 직원 정보 조회
      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('name', employeeName)
        .single()

      if (employeeError) {
        setResult({ error: `직원 조회 오류: ${employeeError.message}` })
        return
      }

      if (!employee) {
        setResult({ error: '직원을 찾을 수 없습니다.' })
        return
      }

      setResult({ 
        success: true, 
        employee,
        message: '직원 정보 조회 성공!' 
      })

    } catch (error) {
      setResult({ 
        error: `오류 발생: ${error instanceof Error ? error.message : '알 수 없는 오류'}` 
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Supabase 연결 테스트</h1>
        
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
            {loading ? '테스트 중...' : '직원 정보 조회 테스트'}
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 rounded-md">
            {result.error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                <strong>오류:</strong> {result.error}
              </div>
            ) : (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <strong>성공:</strong> {result.message}
                <pre className="mt-2 text-xs overflow-auto">
                  {JSON.stringify(result.employee, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/login" className="text-blue-500 hover:underline">
            실제 로그인 페이지로 이동
          </a>
        </div>
      </div>
    </div>
  )
}





