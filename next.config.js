/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // TypeScript 체크 비활성화
  typescript: {
    ignoreBuildErrors: true,
  },
  // 파일 감시자 문제 해결을 위한 설정
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js']
  },
  // 개발 환경에서 파일 감시 설정
  webpack: (config, { dev }) => {
    if (dev) {
      // 파일 감시자를 폴링 모드로 설정 (webpack 5 호환)
      config.watchOptions = {
        poll: 2000, // 2초마다 폴링
        aggregateTimeout: 500,
        ignored: /node_modules/ // 정규식만 사용
      }
    }
    return config
  }
}

module.exports = nextConfig