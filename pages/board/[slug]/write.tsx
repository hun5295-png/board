import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../../lib/supabase'
import { getUser } from '../../../lib/auth'

interface Category {
  id: string
  name: string
  slug: string
  is_anonymous: boolean
}

export default function WritePage() {
  const router = useRouter()
  const { slug } = router.query
  const [category, setCategory] = useState<Category | null>(null)
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      checkUser()
      fetchCategory()
    }
  }, [slug])

  const checkUser = () => {
    const user = getUser()
    if (!user) {
      router.push('/login')
      return
    }
    setUser(user)
  }

  const fetchCategory = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single()

      if (error) throw error
      setCategory(data)
      if (data.is_anonymous) {
        setIsAnonymous(true)
      }
    } catch (error) {
      console.error('Error fetching category:', error)
    } finally {
      setPageLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }

    if (!user) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    if (!category) {
      alert('게시판 정보를 불러오는 중입니다. 잠시 후 다시 시도해주세요.')
      return
    }

    setLoading(true)

    try {
      // UUID 생성 (더 정확한 방법)
      const generateUUID = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          const r = Math.random() * 16 | 0
          const v = c === 'x' ? r : (r & 0x3 | 0x8)
          return v.toString(16)
        })
      }

      console.log('게시글 작성 시도:', {
        title: title.trim(),
        content: content.trim(),
        category_id: category?.id,
        author_id: generateUUID(),
        is_anonymous: isAnonymous
      })

      // Supabase에 게시글 저장 (외래키 제약 조건 제거됨)
      const { data, error } = await supabase
        .from('posts')
        .insert({
          title: title.trim(),
          content: content.trim(),
          category_id: category?.id,
          author_id: generateUUID(), // UUID 생성 (외래키 제약 조건 제거됨)
          author_name: isAnonymous ? '익명' : user.name,
          author_employee_id: isAnonymous ? null : user.employee_id,
          is_anonymous: isAnonymous
        })
        .select()
        .single()

      if (error) {
        console.error('Supabase 오류:', error)
        throw new Error(`데이터베이스 오류: ${error.message}`)
      }

      console.log('Supabase에 게시글 저장됨:', data)

      alert('게시글이 작성되었습니다.')
      router.push(`/board/${slug}`)
    } catch (error: any) {
      console.error('Error creating post:', error)
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        user: user,
        category: category
      })
      alert(`게시글 작성 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('user')
    router.push('/login')
  }

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <Link href={`/board/${slug}`} className="text-blue-600 hover:text-blue-800">
              ← 게시판으로
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {category?.name} - 글쓰기
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.name} ({user?.employee_id})</span>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="제목을 입력하세요"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                내용
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                placeholder="내용을 입력하세요"
                required
              />
            </div>

            {category?.is_anonymous && (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  익명으로 작성
                </label>
              </div>
            )}

            <div className="flex justify-end space-x-4">
              <Link
                href={`/board/${slug}`}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '작성 중...' : '작성하기'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}






