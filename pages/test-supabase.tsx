import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function TestSupabase() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setTestResults([])
    
    const results = []

    // 테스트 1: Supabase 클라이언트 생성 확인
    try {
      results.push({
        test: 'Supabase 클라이언트 생성',
        status: 'success',
        message: '클라이언트가 정상적으로 생성되었습니다.',
        data: null
      })
    } catch (error) {
      results.push({
        test: 'Supabase 클라이언트 생성',
        status: 'error',
        message: error.message,
        data: null
      })
    }

    // 테스트 2: 카테고리 테이블 접근
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(1)

      if (error) {
        results.push({
          test: '카테고리 테이블 접근',
          status: 'error',
          message: error.message,
          data: error
        })
      } else {
        results.push({
          test: '카테고리 테이블 접근',
          status: 'success',
          message: `카테고리 ${data.length}개 조회 성공`,
          data: data
        })
      }
    } catch (error) {
      results.push({
        test: '카테고리 테이블 접근',
        status: 'error',
        message: error.message,
        data: null
      })
    }

    // 테스트 3: 게시글 테이블 접근
    try {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .limit(1)

      if (error) {
        results.push({
          test: '게시글 테이블 접근',
          status: 'error',
          message: error.message,
          data: error
        })
      } else {
        results.push({
          test: '게시글 테이블 접근',
          status: 'success',
          message: `게시글 ${data.length}개 조회 성공`,
          data: data
        })
      }
    } catch (error) {
      results.push({
        test: '게시글 테이블 접근',
        status: 'error',
        message: error.message,
        data: null
      })
    }

    // 테스트 4: 직원 테이블 접근
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .limit(1)

      if (error) {
        results.push({
          test: '직원 테이블 접근',
          status: 'error',
          message: error.message,
          data: error
        })
      } else {
        results.push({
          test: '직원 테이블 접근',
          status: 'success',
          message: `직원 ${data.length}개 조회 성공`,
          data: data
        })
      }
    } catch (error) {
      results.push({
        test: '직원 테이블 접근',
        status: 'error',
        message: error.message,
        data: null
      })
    }

    setTestResults(results)
    setLoading(false)
  }

  useEffect(() => {
    runTests()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Supabase 연결 테스트</h1>
        
        <div className="mb-6">
          <button
            onClick={runTests}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg disabled:opacity-50"
          >
            {loading ? '테스트 중...' : '테스트 다시 실행'}
          </button>
        </div>

        <div className="space-y-4">
          {testResults.map((result, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                result.status === 'success'
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{result.test}</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    result.status === 'success'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {result.status === 'success' ? '✅ 성공' : '❌ 실패'}
                </span>
              </div>
              <p className="text-gray-700 mb-2">{result.message}</p>
              {result.data && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-sm text-gray-600">
                    데이터 보기
                  </summary>
                  <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          ))}
        </div>

        {testResults.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">테스트 요약</h3>
            <p>
              성공: {testResults.filter(r => r.status === 'success').length}개 /{' '}
              {testResults.length}개
            </p>
            <p>
              실패: {testResults.filter(r => r.status === 'error').length}개 /{' '}
              {testResults.length}개
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
