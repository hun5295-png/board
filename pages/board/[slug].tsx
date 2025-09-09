import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

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

  // 댓글 업데이트 이벤트 리스너 (알림 생성 비활성화로 주석 처리)
  // useEffect(() => {
  //   const handleCommentUpdate = () => {
  //     fetchPosts() // 댓글 수 업데이트를 위해 게시글 목록 새로고침
  //   }

  //   window.addEventListener('commentUpdated', handleCommentUpdate)
    
  //   return () => {
  //     window.removeEventListener('commentUpdated', handleCommentUpdate)
  //   }
  // }, [])

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

  const fetchPosts = async () => {
    try {
      const categoryId = await getCategoryId()
      
      // Supabase에서 게시글 가져오기
      const { data: posts, error: postsError } = await supabase
        .from('posts')
        .select('*')
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false })

      if (postsError) throw postsError

      // 각 게시글에 댓글 수 추가
      const postsWithCommentCount = await Promise.all(
        (posts || []).map(async (post: any) => {
          const { count: commentCount } = await supabase
            .from('comments')
            .select('*', { count: 'exact', head: true })
            .eq('post_id', post.id)
          
          return {
            ...post,
            comment_count: commentCount || 0,
            author_name: post.is_anonymous ? '익명' : ((post as any).author_name || '작성자')
          }
        })
      )
      
      setPosts(postsWithCommentCount)
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

  const handleLogout = () => {
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('user')
    router.push('/login')
  }

  const handleDeletePost = async (postId: string) => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return
    }

    try {
      // Supabase에서 관련 댓글 먼저 삭제
      await supabase
        .from('comments')
        .delete()
        .eq('post_id', postId)

      // Supabase에서 게시글 삭제
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      alert('게시글이 삭제되었습니다.')
      await fetchPosts() // 게시글 목록 새로고침
    } catch (error: any) {
      console.error('Error deleting post:', error)
      alert('게시글 삭제 중 오류가 발생했습니다.')
    }
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
                  className="px-6 py-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div 
                      className="flex-1 cursor-pointer"
                      onClick={() => router.push(`/board/${slug}/post/${post.id}`)}
                    >
                      <h3 className="text-lg font-medium text-gray-900 mb-1">
                        {post.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 space-x-4">
                        <span>
                          작성자: {(post as any).author_name}
                        </span>
                        <span>조회 {post.view_count}</span>
                        <span className="flex items-center text-blue-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          댓글 {(post as any).comment_count || 0}
                        </span>
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    {/* 본인 게시글인 경우 수정/삭제 버튼 표시 */}
                    {user && ((post as any).author_employee_id === user.employee_id || (post as any).author_employee_id === null) && (
                      <div className="flex space-x-2 ml-4" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => router.push(`/board/${slug}/post/${post.id}/edit`)}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button
                          onClick={() => handleDeletePost(post.id)}
                          className="text-sm text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    )}
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






