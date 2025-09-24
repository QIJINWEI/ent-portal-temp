const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Company API
export const companyApi = {
  getMainCompanyInfo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/company/main`)
      if (!response.ok) throw new Error('Failed to fetch company info')
      return await response.json()
    } catch (error) {
      console.error('Error fetching company info:', error)
      return null
    }
  },

  getAllCompanyInfo: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/company`)
      if (!response.ok) throw new Error('Failed to fetch companies')
      return await response.json()
    } catch (error) {
      console.error('Error fetching companies:', error)
      return []
    }
  }
}

// Products API
export const productsApi = {
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) throw new Error('Failed to fetch products')
      return await response.json()
    } catch (error) {
      console.error('Error fetching products:', error)
      return []
    }
  },

  getProductCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      return await response.json()
    } catch (error) {
      console.error('Error fetching categories:', error)
      return []
    }
  },

  getProductsByCategory: async (category: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/category/${encodeURIComponent(category)}`)
      if (!response.ok) throw new Error('Failed to fetch products by category')
      return await response.json()
    } catch (error) {
      console.error('Error fetching products by category:', error)
      return []
    }
  },

  getProductById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`)
      if (!response.ok) throw new Error('Failed to fetch product')
      return await response.json()
    } catch (error) {
      console.error('Error fetching product:', error)
      return null
    }
  }
}

// News API
export const newsApi = {
  getLatestNews: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/latest`)
      if (!response.ok) throw new Error('Failed to fetch latest news')
      return await response.json()
    } catch (error) {
      console.error('Error fetching latest news:', error)
      return []
    }
  },

  getAllNews: async (page: number = 0, size: number = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news?page=${page}&size=${size}`)
      if (!response.ok) throw new Error('Failed to fetch news')
      return await response.json()
    } catch (error) {
      console.error('Error fetching news:', error)
      return { content: [], totalElements: 0, totalPages: 0 }
    }
  },

  getNewsCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/categories`)
      if (!response.ok) throw new Error('Failed to fetch news categories')
      return await response.json()
    } catch (error) {
      console.error('Error fetching news categories:', error)
      return []
    }
  },

  getNewsByCategory: async (category: string, page: number = 0, size: number = 10) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/category/${encodeURIComponent(category)}?page=${page}&size=${size}`)
      if (!response.ok) throw new Error('Failed to fetch news by category')
      return await response.json()
    } catch (error) {
      console.error('Error fetching news by category:', error)
      return { content: [], totalElements: 0, totalPages: 0 }
    }
  },

  getNewsById: async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/news/${id}`)
      if (!response.ok) throw new Error('Failed to fetch news')
      return await response.json()
    } catch (error) {
      console.error('Error fetching news:', error)
      return null
    }
  }
}

// Contact API (for future implementation)
export const contactApi = {
  submitContactForm: async (formData: any) => {
    try {
      // This would be implemented when we add a contact form endpoint
      console.log('Contact form submitted:', formData)
      return { success: true, message: '消息已发送' }
    } catch (error) {
      console.error('Error submitting contact form:', error)
      return { success: false, message: '发送失败，请稍后重试' }
    }
  }
}