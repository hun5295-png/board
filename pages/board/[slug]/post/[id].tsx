import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { supabase } from '../../../../lib/supabase'

interface Post {
  id: string
  title: string
  content: string
  author_id: string
  is_anonymous: boolean
  view_count: number
  created_at: string
  updated_at: string
  profiles?: {
    full_name: string
    email: string
  }
}

interface Comment {
  id: string
  content: string
  author_id: string
  is_anonymous: boolean
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
  is_anonymous: boolean
}

export default function PostDetailPage() {
  const router = useRouter()
  const { slug, id } = router.query
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [category, setCategory] = useState<Category | null>(null)
  const [user, setUser] = useState<any>(null)
  const [newComment, setNewComment] = useState('')
  const [isAnonymousComment, setIsAnonymousComment] = useState(false)
  const [loading, setLoading] = useState(true)
  const [commentLoading, setCommentLoading] = useState(false)
  const [canEditPost, setCanEditPost] = useState(false)

  useEffect(() => {
    if (slug && id) {
      checkUser()
      fetchCategory()
      fetchPost()
      fetchComments()
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
      
      // 조회수 증가
      await supabase
        .from('posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', id)
      
      // 작성자 정보 추가
      const postWithAuthor = {
        ...data,
        author_name: data.is_anonymous ? '익명' : (data.author_name || '작성자'),
        view_count: (data.view_count || 0) + 1
      }
      
      setPost(postWithAuthor)
      
      // 작성자 권한 체크
      console.log('권한 체크:', {
        user: user,
        userEmployeeId: user?.employee_id,
        postAuthorEmployeeId: data.author_employee_id,
        isMatch: user && data.author_employee_id === user.employee_id
      })
      
      // author_employee_id가 null인 경우 임시로 모든 사용자에게 수정 권한 부여
      if (user && (data.author_employee_id === user.employee_id || data.author_employee_id === null)) {
        setCanEditPost(true)
      } else {
        setCanEditPost(false)
      }
    } catch (error) {
      console.error('Error fetching post:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    try {
      // Supabase에서 댓글 가져오기
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', id)
        .order('created_at', { ascending: true })

      if (error) throw error
      
      // 댓글 작성자 정보 추가
      const commentsWithAuthors = (data || []).map(comment => ({
        ...comment,
        author_name: comment.is_anonymous ? '익명' : (comment.author_name || '댓글 작성자')
      }))
      
      setComments(commentsWithAuthors)
    } catch (error) {
      console.error('Error fetching comments:', error)
      setComments([])
    }
  }

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0
      const v = c === 'x' ? r : (r & 0x3 | 0x8)
      return v.toString(16)
    })
  }

  // 댓글 작성자 권한 체크
  const canEditComment = (comment: any) => {
    // author_employee_id가 null인 경우 임시로 모든 사용자에게 수정 권한 부여
    const canEdit = user && (comment.author_employee_id === user.employee_id || comment.author_employee_id === null)
    console.log('댓글 권한 체크:', {
      user: user,
      userEmployeeId: user?.employee_id,
      commentAuthorEmployeeId: comment.author_employee_id,
      canEdit: canEdit
    })
    return canEdit
  }

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) {
      alert('댓글 내용을 입력해주세요.')
      return
    }

    if (!user) {
      alert('로그인이 필요합니다.')
      router.push('/login')
      return
    }

    if (!id) {
      alert('게시글 정보를 찾을 수 없습니다.')
      return
    }

    setCommentLoading(true)

    try {
      // 댓글 데이터 준비
      const commentData = {
        content: newComment.trim(),
        post_id: id,
        author_id: generateUUID(), // UUID 생성 (외래키 제약 조건 제거됨)
        author_name: isAnonymousComment ? '익명' : user.name,
        author_employee_id: isAnonymousComment ? null : user.employee_id,
        is_anonymous: isAnonymousComment
      }

      console.log('댓글 작성 시도:', commentData)

      // Supabase에 댓글 저장 (외래키 제약 조건 제거됨)
      const { error } = await supabase
        .from('comments')
        .insert(commentData)

      if (error) {
        console.error('댓글 저장 오류:', error)
        throw error
      }

      setNewComment('')
      setIsAnonymousComment(false)
      await fetchComments()
      
      // 댓글 추가 후 게시글 목록 업데이트를 위한 이벤트 발생 (알림 생성 비활성화)
      // window.dispatchEvent(new CustomEvent('commentUpdated'))
    } catch (error: any) {
      console.error('Error creating comment:', error)
      console.error('Comment error details:', {
        message: error.message,
        stack: error.stack,
        user: user,
        postId: id,
        commentContent: newComment
      })
      alert(`댓글 작성 중 오류가 발생했습니다: ${error.message}`)
    } finally {
      setCommentLoading(false)
    }
  }

  const handleLogout = () => {
    // 로컬 스토리지에서 사용자 정보 제거
    localStorage.removeItem('user')
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

  const canEdit = () => {
    // 작성자만 수정 가능
    return user && post && canEditPost
  }

  const handleEditPost = () => {
    router.push(`/board/${slug}/post/${id}/edit`)
  }

  const handleDeletePost = async () => {
    if (!confirm('정말로 이 게시글을 삭제하시겠습니까?')) {
      return
    }

    try {
      // Supabase에서 관련 댓글 먼저 삭제
      await supabase
        .from('comments')
        .delete()
        .eq('post_id', id)

      // Supabase에서 게시글 삭제
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id)

      if (error) throw error

      alert('게시글이 삭제되었습니다.')
      router.push(`/board/${slug}`)
    } catch (error: any) {
      console.error('Error deleting post:', error)
      alert('게시글 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('정말로 이 댓글을 삭제하시겠습니까?')) {
      return
    }

    // 댓글 작성자 권한 확인
    const comment = comments.find(c => c.id === commentId)
    if (!canEditComment(comment)) {
      alert('삭제 권한이 없습니다.')
      return
    }

    try {
      // Supabase에서 댓글 삭제
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      await fetchComments() // 댓글 목록 새로고침
      
      // 댓글 삭제 후 게시글 목록 업데이트를 위한 이벤트 발생 (알림 생성 비활성화)
      // window.dispatchEvent(new CustomEvent('commentUpdated'))
    } catch (error: any) {
      console.error('Error deleting comment:', error)
      alert('댓글 삭제 중 오류가 발생했습니다.')
    }
  }

  const handleEditComment = async (commentId: string, newContent: string) => {
    // 댓글 작성자 권한 확인
    const comment = comments.find(c => c.id === commentId)
    if (!canEditComment(comment)) {
      alert('수정 권한이 없습니다.')
      return
    }

    try {
      // Supabase에서 댓글 수정
      const { error } = await supabase
        .from('comments')
        .update({ content: newContent })
        .eq('id', commentId)

      if (error) throw error

      await fetchComments() // 댓글 목록 새로고침
    } catch (error: any) {
      console.error('Error updating comment:', error)
      alert('댓글 수정 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">게시글을 찾을 수 없습니다.</div>
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
              {category?.name}
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 게시글 상세 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
                <div className="flex items-center text-sm text-gray-500 space-x-4">
                  <span>
                    작성자: {post.author_name}
                  </span>
                  <span>조회 {post.view_count}</span>
                  <span>{formatDate(post.created_at)}</span>
                  {post.updated_at !== post.created_at && (
                    <span>(수정됨: {formatDate(post.updated_at)})</span>
                  )}
                </div>
              </div>
              {canEdit() && (
                <div className="flex space-x-2">
                  <button 
                    onClick={handleEditPost}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    수정
                  </button>
                  <button 
                    onClick={handleDeletePost}
                    className="text-sm text-red-600 hover:text-red-800"
                  >
                    삭제
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="px-6 py-6">
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap">{post.content}</div>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">댓글 ({comments.length})</h2>
          </div>

          {/* 댓글 작성 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-vertical"
                placeholder="댓글을 입력하세요"
                required
              />
              <div className="flex justify-between items-center">
                {category?.is_anonymous && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous-comment"
                      checked={isAnonymousComment}
                      onChange={(e) => setIsAnonymousComment(e.target.checked)}
                      className="mr-2"
                    />
                    <label htmlFor="anonymous-comment" className="text-sm text-gray-700">
                      익명으로 작성
                    </label>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={commentLoading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {commentLoading ? '작성 중...' : '댓글 작성'}
                </button>
              </div>
            </form>
          </div>

          {/* 댓글 목록 */}
          <div className="divide-y divide-gray-200">
            {comments.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500">
                댓글이 없습니다.
              </div>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="px-6 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <span className="font-medium">
                        {comment.author_name}
                      </span>
                      <span>•</span>
                      <span>{formatDate(comment.created_at)}</span>
                    </div>
                    {user && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => {
                            // 댓글 수정 기능은 간단히 prompt로 구현
                            const newContent = prompt('댓글을 수정하세요:', comment.content)
                            if (newContent && newContent.trim() !== comment.content) {
                              handleEditComment(comment.id, newContent.trim())
                            }
                          }}
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          수정
                        </button>
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="text-gray-900 whitespace-pre-wrap">
                    {comment.content}
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
