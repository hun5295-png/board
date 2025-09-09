import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function Test() {
  const [status, setStatus] = useState('로딩 중...')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const testSupabase = async () => {
      try {
        console.log('Supabase 테스트 시작')
        const { data, error } = await supabase
          .from('categories')
          .select('*')
        
        console.log('Supabase 응답:', { data, error })
        
        if (error) {
          setStatus(`오류: ${error.message}`)
        } else {
          setStatus(`성공! 카테고리 ${data?.length || 0}개 로드됨`)
          setCategories(data || [])
        }
      } catch (err) {
        console.error('테스트 오류:', err)
        setStatus(`예외 오류: ${err}`)
      }
    }

    testSupabase()
  }, [])

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase 연결 테스트</h1>
      <div className="mb-4">
        <strong>상태:</strong> {status}
      </div>
      <div>
        <strong>카테고리:</strong>
        <ul className="list-disc list-inside mt-2">
          {categories.map((cat: any) => (
            <li key={cat.id}>{cat.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}





