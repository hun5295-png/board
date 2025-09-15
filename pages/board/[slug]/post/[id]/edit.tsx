import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../../../../lib/supabase'

interface Post {
  id: string
  title: string
  content: string
  category_id: string
  author_id: string
  is_anonymous: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  is_anonymous: boolean
}

export default function EditPostPage() {
  const router = useRouter()
  const { slug, id } = router.query
  const [category, setCategory] = useState<Category | null>(null)
  const [post, setPost] = useState<Post | null>(null)
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)

  useEffect(() => {
    if (slug && id) {
      checkUser()
      fetchCategory()
      fetchPost()
    }
  }, [slug, id])

  const checkUser = () => {
    // 로컬 스토리지에서 사용자 정보 확인 (사번+이름 로그인)
    const userData = localStorage.getItem('user')
    if (!userData) {
      router.push('/login')
    } else {
      const user = JSON.parse(userData)
      setUser(user)
    }
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
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  }

  const fetchPost = async () => {
    try {
      // Supabase에서 게시글 가져오기
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      
      // 작성자 권한 확인
      const userData = localStorage.getItem('user')
      if (!userData) {
        alert('로그인이 필요합니다.')
        router.push('/login')
        return
      }

      const currentUser = JSON.parse(userData)
      
      // 권한 확인 로직
      const hasPermission = data.author_employee_id ? 
        data.author_employee_id === currentUser.employee_id :
        data.author_name === currentUser.name
      
      if (!hasPermission) {
        alert('수정 권한이 없습니다.')
        router.push(`/board/${slug}/post/${id}`)
        return
      }

      setPost(data)
      setTitle(data.title)
      setContent(data.content)
      setIsAnonymous(data.is_anonymous)
    } catch (error) {
      console.error('Error fetching post:', error)
      alert('게시글을 불러올 수 없습니다.')
      router.push(`/board/${slug}`)
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

    setLoading(true)

    try {
      // Supabase에서 게시글 수정
      const { error } = await supabase
        .from('posts')
        .update({
          title: title.trim(),
          content: content.trim(),
          is_anonymous: isAnonymous
        })
        .eq('id', id)

      if (error) throw error

      alert('게시글이 수정되었습니다.')
      router.push(`/board/${slug}/post/${id}`)
    } catch (error: any) {
      console.error('Error updating post:', error)
      alert('게시글 수정 중 오류가 발생했습니다.')
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
            <Link href={`/board/${slug}/post/${id}`} className="text-blue-600 hover:text-blue-800">
              ← 게시글로
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {category?.name} - 글 수정
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
                href={`/board/${slug}/post/${id}`}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                취소
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '수정 중...' : '수정하기'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}






