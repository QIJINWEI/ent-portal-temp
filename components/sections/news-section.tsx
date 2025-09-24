'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { newsApi } from '@/lib/api'
import { News } from '@/lib/types'

const NewsSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [news, setNews] = useState<News[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsApi.getLatestNews()
        setNews(data)
      } catch (error) {
        console.error('Failed to fetch news:', error)
        // Use fallback data if API fails
        setNews(fallbackNews)
      } finally {
        setLoading(false)
      }
    }

    fetchNews()
  }, [])

  // Fallback data when API is not available
  const fallbackNews: News[] = [
    {
      id: 1,
      title: '数字化转型新趋势：AI技术在企业管理中的应用',
      excerpt: '探讨人工智能技术如何助力企业实现智能化管理，提升运营效率和决策质量...',
      content: '随着人工智能技术的快速发展...',
      imageUrl: '/api/placeholder/400/240',
      publishedAt: '2024-01-15T10:00:00',
      readTime: '5分钟',
      category: '技术前沿',
      author: '张三',
      isPublished: true,
      viewCount: 120,
      createdAt: '2024-01-15T10:00:00',
      updatedAt: '2024-01-15T10:00:00'
    },
    {
      id: 2,
      title: '云原生架构：企业数字化基础设施的演进',
      excerpt: '解析云原生技术如何重塑企业 IT架构，为数字化转型提供更强大的技术支撑...',
      content: '云原生架构作为现代企业 IT 基础设施的重要组成部分...',
      imageUrl: '/api/placeholder/400/240',
      publishedAt: '2024-01-10T10:00:00',
      readTime: '8分钟',
      category: '云计算',
      author: '李四',
      isPublished: true,
      viewCount: 89,
      createdAt: '2024-01-10T10:00:00',
      updatedAt: '2024-01-10T10:00:00'
    },
    {
      id: 3,
      title: '2024年企业数字化转型报告发布',
      excerpt: '最新行业报告显示，数字化转型已成为企业发展的核心战略，成功率大幅提升...',
      content: '根据最新发布的《2024年企业数字化转型报告》...',
      imageUrl: '/api/placeholder/400/240',
      publishedAt: '2024-01-05T10:00:00',
      readTime: '6分钟',
      category: '行业报告',
      author: '王五',
      isPublished: true,
      viewCount: 156,
      createdAt: '2024-01-05T10:00:00',
      updatedAt: '2024-01-05T10:00:00'
    },
    {
      id: 4,
      title: '微服务架构在大型企业中的实践经验',
      excerpt: '分享某大型制造企业成功实施微服务架构的完整过程和关键经验总结...',
      content: '微服务架构作为现代软件架构的重要模式...',
      imageUrl: '/api/placeholder/400/240',
      publishedAt: '2023-12-28T10:00:00',
      readTime: '7分钟',
      category: '案例分析',
      author: '赵六',
      isPublished: true,
      viewCount: 78,
      createdAt: '2023-12-28T10:00:00',
      updatedAt: '2023-12-28T10:00:00'
    },
    {
      id: 5,
      title: '数据安全新规范：企业如何应对数据合规挑战',
      excerpt: '深入分析最新数据安全法规对企业的影响，提供实用的合规建议和解决方案...',
      content: '随着《数据安全法》和《个人信息保护法》的正式实施...',
      imageUrl: '/api/placeholder/400/240',
      publishedAt: '2023-12-20T10:00:00',
      readTime: '4分钟',
      category: '数据安全',
      author: '孙七',
      isPublished: true,
      viewCount: 92,
      createdAt: '2023-12-20T10:00:00',
      updatedAt: '2023-12-20T10:00:00'
    },
    {
      id: 6,
      title: '低代码平台助力中小企业快速数字化',
      excerpt: '介绍低代码开发平台如何帮助中小企业以更低成本、更快速度实现数字化转型...',
      content: '低代码开发平台作为一种新兴的软件开发方式...',
      imageUrl: '/api/placeholder/400/240',
      publishedAt: '2023-12-15T10:00:00',
      readTime: '6分钟',
      category: '解决方案',
      author: '周八',
      isPublished: true,
      viewCount: 134,
      createdAt: '2023-12-15T10:00:00',
      updatedAt: '2023-12-15T10:00:00'
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN')
  }

  return (
    <section id="news" className="py-20 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            新闻资讯
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            关注行业动态，分享技术见解，为您的数字化转型之路提供有价值的信息
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {news.map((article, index) => (
            <motion.article
              key={article.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              {/* Article Image */}
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/80 to-blue-600/80 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="text-4xl font-bold mb-2">{article.category}</div>
                    <div className="text-sm opacity-80">封面图片</div>
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                {/* Meta info */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span className="mr-4">{formatDate(article.publishedAt)}</span>
                  <Clock className="w-4 h-4 mr-1" />
                  <span>{article.readTime}</span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>

                {/* Excerpt */}
                <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                  {article.excerpt}
                </p>

                {/* Read more button */}
                <motion.button
                  className="flex items-center text-blue-600 font-semibold text-sm hover:text-blue-700 transition-colors"
                  whileHover={{ x: 5 }}
                >
                  阅读更多
                  <ArrowRight className="w-4 h-4 ml-1" />
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Load more button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            查看更多资讯
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default NewsSection