// API 基础配置
const API_BASE_URL = '/api'

// 导入类型
import { CompanyInfo, Product, News, Page, Message } from './types'

// 仪表盘相关类型
interface DashboardStats {
  totalUsers: number
  totalProducts: number
  totalNews: number
  totalCompanies: number
  totalMessages: number
  unreadMessages: number
}

interface RecentActivity {
  id: number
  time: string
  action: string
  target: string
  operator?: string
}

// 获取认证token
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token')
  }
  return null
}

// 基础请求函数
async function apiRequest(
  endpoint: string, 
  options: RequestInit = {}
): Promise<Response> {
  const token = getAuthToken()
  const url = `${API_BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers as Record<string, string>,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // 如果是401错误，清除本地认证信息并跳转到登录页
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/admin/login'
    }
  }

  return response
}

// GET 请求
export async function apiGet<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

// POST 请求
export async function apiPost<T>(endpoint: string, data?: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `API Error: ${response.status}`)
  }
  return response.json()
}

// PUT 请求
export async function apiPut<T>(endpoint: string, data?: any): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `API Error: ${response.status}`)
  }
  return response.json()
}

// DELETE 请求
export async function apiDelete<T>(endpoint: string): Promise<T> {
  const response = await apiRequest(endpoint, {
    method: 'DELETE',
  })
  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(errorText || `API Error: ${response.status}`)
  }
  
  // 如果返回的是纯文本而不是JSON
  const contentType = response.headers.get('content-type')
  if (contentType && contentType.includes('application/json')) {
    return response.json()
  } else {
    return response.text() as any
  }
}

// 认证相关API
export const authAPI = {
  login: (credentials: { username: string; password: string }) =>
    apiPost<{ token: string; username: string; fullName: string; role: string }>('/auth/login', credentials),
    
  logout: () => apiPost('/auth/logout'),
}

// 用户管理API
export const userAPI = {
  getUsers: (params?: { page?: number; size?: number; sort?: string; direction?: string }) => {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.append('page', params.page.toString())
    if (params?.size !== undefined) searchParams.append('size', params.size.toString())
    if (params?.sort) searchParams.append('sort', params.sort)
    if (params?.direction) searchParams.append('direction', params.direction)
    
    const queryString = searchParams.toString()
    return apiGet<{ content: any[]; totalElements: number }>(`/admin/users${queryString ? '?' + queryString : ''}`)
  },
  
  getUser: (id: number) => apiGet<any>(`/admin/users/${id}`),
  
  createUser: (user: any) => apiPost<any>('/admin/users', user),
  
  updateUser: (id: number, user: any) => apiPut<any>(`/admin/users/${id}`, user),
  
  deleteUser: (id: number) => apiDelete<string>(`/admin/users/${id}`),
  
  changePassword: (id: number, password: string) => 
    apiPost<string>(`/admin/users/${id}/change-password`, { password }),
}

// 系统配置API
export const configAPI = {
  getConfigs: () => apiGet<any[]>('/admin/configs'),
  
  getConfig: (id: number) => apiGet<any>(`/admin/configs/${id}`),
  
  createConfig: (config: any) => apiPost<any>('/admin/configs', config),
  
  updateConfig: (id: number, config: any) => apiPut<any>(`/admin/configs/${id}`, config),
  
  deleteConfig: (id: number) => apiDelete<string>(`/admin/configs/${id}`),
}

// 企业信息API
export const companyAPI = {
  getCompany: () => apiGet<CompanyInfo[]>('/company'),
  
  getMainCompany: () => apiGet<CompanyInfo>('/company/main'),
  
  updateCompany: (id: number, company: Partial<CompanyInfo>) => apiPut<CompanyInfo>(`/company/${id}`, company),
  
  createCompany: (company: Partial<CompanyInfo>) => apiPost<CompanyInfo>('/company', company),
}

// 产品API
export const productAPI = {
  getProducts: () => apiGet<Product[]>('/admin/products'), // 管理员专用接口，返回全量数据
  
  getProduct: (id: number) => apiGet<Product>(`/admin/products/${id}`),
  
  createProduct: (product: Partial<Product>) => apiPost<Product>('/admin/products', product),
  
  updateProduct: (id: number, product: Partial<Product>) => apiPut<Product>(`/admin/products/${id}`, product),
  
  deleteProduct: (id: number) => apiDelete<string>(`/admin/products/${id}`),
}

// 新闻API
export const newsAPI = {
  getNews: () => apiGet<News[]>('/admin/news'), // 管理员专用接口，返回全量数据
  
  getNewsItem: (id: number) => apiGet<News>(`/admin/news/${id}`),
  
  createNews: (news: Partial<News>) => apiPost<News>('/admin/news', news),
  
  updateNews: (id: number, news: Partial<News>) => apiPut<News>(`/admin/news/${id}`, news),
  
  deleteNews: (id: number) => apiDelete<string>(`/admin/news/${id}`),
}

// 留言API
export const messageAPI = {
  // 提交留言（公开接口）
  createMessage: (message: Partial<Message>) => apiPost<string>('/messages', message),
  
  // 管理员接口
  getMessages: (params?: { page?: number; size?: number; isRead?: boolean; isReplied?: boolean }) => {
    const searchParams = new URLSearchParams()
    if (params?.page !== undefined) searchParams.append('page', params.page.toString())
    if (params?.size !== undefined) searchParams.append('size', params.size.toString())
    if (params?.isRead !== undefined) searchParams.append('isRead', params.isRead.toString())
    if (params?.isReplied !== undefined) searchParams.append('isReplied', params.isReplied.toString())
    
    const queryString = searchParams.toString()
    return apiGet<Page<Message>>(`/admin/messages${queryString ? '?' + queryString : ''}`)
  },
  
  getMessage: (id: number) => apiGet<Message>(`/admin/messages/${id}`),
  
  markAsRead: (id: number) => apiPost<string>(`/admin/messages/${id}/mark-read`),
  
  replyMessage: (id: number, replyContent: string) => 
    apiPost<Message>(`/admin/messages/${id}/reply`, { replyContent }),
  
  deleteMessage: (id: number) => apiDelete<string>(`/admin/messages/${id}`),
  
  getMessageStats: () => apiGet<{ unreadCount: number; unrepliedCount: number; totalCount: number }>('/admin/messages/stats'),
}

// 仪表盘API
export const dashboardAPI = {
  getStats: () => apiGet<DashboardStats>('/admin/dashboard/stats'),
  
  getRecentActivities: (limit?: number) => {
    const params = limit ? `?limit=${limit}` : ''
    return apiGet<RecentActivity[]>(`/admin/dashboard/activities${params}`)
  },
}

// 导出类型
export type { DashboardStats, RecentActivity }