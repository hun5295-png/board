import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function MobilePage() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // 모바일 감지
    const userAgent = navigator.userAgent.toLowerCase()
    const mobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
    setIsMobile(mobile)

    if (mobile) {
      // 모바일이면 즉시 메인 페이지로 리다이렉트 (Vercel 로그인창 우회)
      setTimeout(() => {
        // 새 창에서 열어서 Vercel 로그인창을 우회
        window.open('https://board-2oom56xr8-chanhuns-projects.vercel.app', '_self')
      }, 1000)
    }
  }, [])

  const handleDirectAccess = () => {
    window.location.href = 'https://board-2oom56xr8-chanhuns-projects.vercel.app'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 max-w-md w-full text-center border border-white/20">
        <div className="mb-6">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            모바일 접속 안내
          </h1>
          <p className="text-white/80 text-sm leading-relaxed">
            모바일에서 Vercel 로그인창이 표시되는 경우,<br />
            아래 버튼을 클릭하여 직접 접속하세요.
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={handleDirectAccess}
            className="w-full bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 border border-white/30"
          >
            직접 접속하기
          </button>
          
          <div className="text-xs text-white/60">
            자동으로 3초 후 접속됩니다...
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-500/20 rounded-xl border border-blue-400/30">
          <h3 className="text-sm font-semibold text-blue-100 mb-2">로그인 정보</h3>
          <div className="text-xs text-blue-200 space-y-1">
            <div>사번: 1131, 이름: 김창훈</div>
            <div>사번: 2, 이름: 김징균</div>
            <div>사번: 163, 이름: 서정애</div>
            <div>사번: 267, 이름: 박두심</div>
          </div>
        </div>
      </div>
    </div>
  )
}
