'use client'

import { useState, useEffect, createContext, useContext } from 'react'
import { useRouter } from 'next/navigation'
import { authAPI } from '../lib/admin-api'

interface User {
  username: string
  fullName: string
  role: 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (credentials: { username: string; password: string }) => Promise<boolean>
  logout: () => void
  hasPermission: (requiredRole: string) => boolean
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const logout = () => {
    console.log('执行退出登录')
    setToken(null)
    setUser(null)
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    // 清除 Cookie
    document.cookie = 'admin_token=; path=/; max-age=0'
    router.push('/admin/login')
  }

  useEffect(() => {
    // 检查本地存储的认证信息
    const storedToken = localStorage.getItem('admin_token')
    const storedUser = localStorage.getItem('admin_user')
    console.log('检查本地存储:', { storedToken: !!storedToken, storedUser: !!storedUser })

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
        // 确保 Cookie 也是最新的
        document.cookie = `admin_token=${storedToken}; path=/; max-age=${7 * 24 * 60 * 60}`
        console.log('从本地存储恢复用户状态:', parsedUser)
      } catch (error) {
        console.error('解析用户信息失败:', error)
        // 清理无效的本地存储
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        document.cookie = 'admin_token=; path=/; max-age=0'
        setToken(null)
        setUser(null)
      }
    }
    setIsLoading(false)
    console.log('初始化完成，isLoading 设为 false')
  }, [])

  // 监听用户状态变化
  useEffect(() => {
    console.log('用户状态变化:', { 
      user: user ? `${user.username}(${user.role})` : null, 
      isLoading,
      hasToken: !!token,
      localStorage: {
        hasToken: !!localStorage.getItem('admin_token'),
        hasUser: !!localStorage.getItem('admin_user')
      }
    })
  }, [user, isLoading, token])

  const login = async (credentials: { username: string; password: string }): Promise<boolean> => {
    try {
      console.log('发送登录请求:', credentials.username)
      setIsLoading(true) // 设置加载状态以防止认证检查
      
      // 使用 admin-api 中的登录接口
      const data = await authAPI.login(credentials)
      
      console.log('登录响应数据:', data)
      const userData: User = {
        username: data.username,
        fullName: data.fullName,
        role: data.role as 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'
      }

      // 保存到本地存储和 Cookie
      localStorage.setItem('admin_token', data.token)
      localStorage.setItem('admin_user', JSON.stringify(userData))
      
      // 同时设置 Cookie 供 middleware 使用
      document.cookie = `admin_token=${data.token}; path=/; max-age=${7 * 24 * 60 * 60}` // 7天过期
      
      // 设置状态
      setToken(data.token)
      setUser(userData)
      setIsLoading(false) // 设置完成后才取消加载状态
      console.log('设置用户状态:', userData)
      
      return true
    } catch (error) {
      console.error('登录错误:', error)
      setIsLoading(false)
      return false
    }
  }



  const hasPermission = (requiredRole: string): boolean => {
    if (!user) return false

    const roleHierarchy = {
      'SUPER_ADMIN': 3,
      'ADMIN': 2,
      'EDITOR': 1
    }

    const userLevel = roleHierarchy[user.role] || 0
    const requiredLevel = roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0

    return userLevel >= requiredLevel
  }

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      hasPermission,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function withAuth<T extends object>(Component: React.ComponentType<T>) {
  return function AuthenticatedComponent(props: T) {
    const { user, isLoading } = useAuth()
    const router = useRouter()

    useEffect(() => {
      if (!isLoading && !user) {
        router.push('/admin/login')
      }
    }, [user, isLoading, router])

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

    return <Component {...props} />
  }
}

export function withPermission(requiredRole: string) {
  return function <T extends object>(Component: React.ComponentType<T>) {
    return function PermissionGuardedComponent(props: T) {
      const { hasPermission, isLoading } = useAuth()

      if (isLoading) {
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )
      }

      if (!hasPermission(requiredRole)) {
        return (
          <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">权限不足</h2>
              <p className="text-gray-600">您没有访问此页面的权限</p>
            </div>
          </div>
        )
      }

      return <Component {...props} />
    }
  }
}