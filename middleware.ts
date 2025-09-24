import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 如果是管理后台路径（除了登录页面）
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    // 检查是否有token
    const token = request.cookies.get('admin_token')?.value

    if (!token) {
      // 重定向到登录页
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 如果已经登录访问登录页，重定向到仪表盘
  if (pathname === '/admin/login') {
    const token = request.cookies.get('admin_token')?.value
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*']
}