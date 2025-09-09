import { useEffect } from 'react'
import { useRouter } from 'next/router'
import '../styles/globals.css'

function MyApp({ Component, pageProps }: any) {
  const router = useRouter()

  useEffect(() => {
    // 모바일에서 Vercel 로그인창 우회
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent.toLowerCase()
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent)
      
      // 모바일이고 Vercel 도메인에서 접속하는 경우
      if (isMobile && window.location.hostname.includes('vercel.app')) {
        // 현재 페이지가 모바일 안내 페이지가 아닌 경우에만 리다이렉트
        if (router.pathname !== '/mobile') {
          router.push('/mobile')
        }
      }
    }
  }, [router])

  return <Component {...pageProps} />
}

export default MyApp