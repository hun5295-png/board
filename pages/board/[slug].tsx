import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'
import { getUser } from '../../lib/auth'

interface Post {
  id: string
  title: string
  content: string
  author_id: string
  is_anonymous: boolean
  view_count: number
  created_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description: string
  is_anonymous: boolean
}

export default function BoardPage() {
  const router = useRouter()
  const { slug } = router.query
  const [posts, setPosts] = useState<Post[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (slug) {
      checkUser()
      fetchCategory()
      fetchPosts()
    }
  }, [slug])

  const checkUser = async () => {
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
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  }

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          profiles:author_id (
            full_name,
            email
          )
        `)
        .eq('category_id', await getCategoryId())
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryId = async (): Promise<string> => {
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()
    return data?.id || ''
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
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
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              ← 홈으로
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              {category?.name || '게시판'}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">{category?.name}</h2>
              <p className="text-sm text-gray-600">{category?.description}</p>
            </div>
            <Link
              href={`/board/${slug}/write`}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              글쓰기
            </Link>
          </div>

          <div className="divide-y divide-gray-200">
            {posts.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                게시글이 없습니다.
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => router.push(`/board/${slug}/post/${post.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>
                          작성자: {post.is_anonymous ? '익명' : (post.profiles?.full_name || post.profiles?.email)}
                        </span>
                        <span>조회 {post.view_count}</span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}






