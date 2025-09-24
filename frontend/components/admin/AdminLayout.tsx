'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '../../hooks/useAuth'

interface AdminUser {
  username: string
  fullName: string
  role: string
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isLoading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [hasRedirected, setHasRedirected] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    console.log('AdminLayout 认证检查:', { 
      user: !!user, 
      username: user?.username,
      isLoading, 
      pathname,
      hasRedirected,
      shouldRedirect: !isLoading && !user && !hasRedirected
    })
    if (!isLoading && !user && !hasRedirected) {
      console.log('认证失败，跳转到登录页面')
      setHasRedirected(true)
      router.push('/admin/login')
    } else if (user && hasRedirected) {
      console.log('用户已登录，重置hasRedirected')
      setHasRedirected(false)
    } else if (user) {
      console.log('认证成功，用户:', user.username)
    }
  }, [user, isLoading, router, pathname, hasRedirected])

  // 点击外部关闭用户菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen) {
        const target = event.target as Element
        if (!target.closest('.user-menu-container')) {
          setUserMenuOpen(false)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [userMenuOpen])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const menuItems = [
    { href: '/admin/dashboard', label: '仪表盘', icon: '📊' },
    { href: '/admin/users', label: '用户管理', icon: '👥' },
    { href: '/admin/company', label: '企业信息', icon: '🏢' },
    { href: '/admin/products', label: '产品管理', icon: '📦' },
    { href: '/admin/news', label: '新闻管理', icon: '📰' },
    { href: '/admin/messages', label: '留言管理', icon: '💬' },
    { href: '/admin/configs', label: '系统配置', icon: '⚙️' },
  ]

  return (
    <div className="h-screen bg-gray-100 flex overflow-hidden">
      {/* 侧边栏 */}
      {sidebarOpen && (
        <div className="fixed lg:static w-64 bg-white shadow-lg h-screen z-20">
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-800">管理后台</h1>
            <p className="text-sm text-gray-600 mt-1">宁波企业门户</p>
          </div>

          <nav className="mt-6">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors ${
                  pathname === item.href ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600' : ''
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="absolute w-64 bottom-0 p-4 border-t">
            <div className="relative user-menu-container">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center w-full p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.fullName?.charAt(0) || user.username.charAt(0)}
                </div>
                <div className="ml-3 flex-1 text-left">
                  <p className="text-sm font-medium text-gray-700">{user.fullName || user.username}</p>
                  <p className="text-xs text-gray-500">{user.role}</p>
                </div>
                <span className="text-gray-400">⚙</span>
              </button>
              
              {/* 用户菜单悬浮弹窗 */}
              {userMenuOpen && (
                <div className="absolute bottom-full left-0 w-full mb-2 bg-white rounded-lg shadow-lg border py-2 z-50">
                  <button
                    onClick={() => {
                      logout()
                      setUserMenuOpen(false)
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                  >
                    <span className="mr-2">🚪</span>
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 主内容区域 */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* 顶部导航栏 */}
        <header className="bg-white shadow-sm border-b px-6 py-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
              >
                <span className="text-xl">☰</span>
              </button>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="hidden lg:block p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-xl">☰</span>
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <Link
                href="/"
                target="_blank"
                className="px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                查看网站
              </Link>
            </div>
          </div>
        </header>

        {/* 主内容 */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* 移动端遮罩 */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}