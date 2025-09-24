// Company types
export interface CompanyInfo {
  id: number
  name: string
  description: string
  phoneNumber?: string
  email?: string
  address?: string
  businessScope?: string
  establishedYear?: number
  employeeCount?: number
  createdAt: string
  updatedAt: string
}

// Product types
export interface Product {
  id: number
  name: string
  description: string
  category?: string
  price?: number
  imageUrl?: string
  features?: string
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

// News types
export interface News {
  id: number
  title: string
  excerpt: string
  content: string
  category?: string
  imageUrl?: string
  author?: string
  readTime?: string
  isPublished: boolean
  viewCount: number
  publishedAt?: string
  createdAt: string
  updatedAt: string
}

// Pagination types
export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
  first: boolean
  last: boolean
  numberOfElements: number
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: string[]
}

// Contact form types
export interface ContactFormData {
  name: string
  company?: string
  email: string
  phone?: string
  message: string
}

// Message types
export interface Message {
  id?: number
  name: string
  email: string
  phone?: string
  company?: string
  subject: string
  content: string
  isRead?: boolean
  isReplied?: boolean
  replyContent?: string
  replyTime?: string
  createdAt?: string
  updatedAt?: string
}