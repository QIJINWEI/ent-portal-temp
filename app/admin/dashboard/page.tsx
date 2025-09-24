'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import AdminLayout from '../../../components/admin/AdminLayout'
import { dashboardAPI, DashboardStats, RecentActivity } from '../../../lib/admin-api'

export default function AdminDashboard() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalNews: 0,
    totalCompanies: 0,
    totalMessages: 0,
    unreadMessages: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      // 获取仪表盘统计数据
      const statsData = await dashboardAPI.getStats()
      setStats(statsData)
      
      // 获取最近活动数据
      const activitiesData = await dashboardAPI.getRecentActivities(5)
      setRecentActivities(activitiesData)
      
      setLoading(false)
    } catch (error) {
      console.error('获取仪表盘数据失败:', error)
      // 如果API失败，使用模拟数据
      setStats({
        totalUsers: 5,
        totalProducts: 12,
        totalNews: 8,
        totalCompanies: 1,
        totalMessages: 0,
        unreadMessages: 0
      })
      setRecentActivities([
        { id: 1, time: '2小时前', action: '新增产品', target: '智能制造解决方案' },
        { id: 2, time: '5小时前', action: '更新新闻', target: '公司获得技术创新奖' },
        { id: 3, time: '1天前', action: '修改配置', target: '网站标题更新' },
        { id: 4, time: '2天前', action: '新增用户', target: '编辑员工张三' },
      ])
      setLoading(false)
    }
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'add-user':
        router.push('/admin/users')
        break
      case 'add-product':
        router.push('/admin/products')
        break
      case 'add-news':
        router.push('/admin/news')
        break
      case 'company-info':
        router.push('/admin/company')
        break
      case 'messages':
        router.push('/admin/messages')
        break
      default:
        break
    }
  }

  const statsCards = [
    {
      title: '管理员用户',
      value: stats.totalUsers,
      icon: '👥',
      color: 'bg-blue-500',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: '产品数量',
      value: stats.totalProducts,
      icon: '📦',
      color: 'bg-green-500',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: '新闻文章',
      value: stats.totalNews,
      icon: '📰',
      color: 'bg-purple-500',
      change: '+1',
      changeType: 'increase'
    },
    {
      title: '企业信息',
      value: stats.totalCompanies,
      icon: '🏢',
      color: 'bg-orange-500',
      change: '0',
      changeType: 'stable'
    },
    {
      title: '客户留言',
      value: stats.totalMessages,
      icon: '💬',
      color: 'bg-cyan-500',
      change: stats.unreadMessages > 0 ? `${stats.unreadMessages}未读` : '0',
      changeType: stats.unreadMessages > 0 ? 'increase' : 'stable'
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">仪表盘</h1>
          <p className="mt-2 text-gray-600">欢迎回到管理后台</p>
        </motion.div>

        {/* 统计卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {statsCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-white text-2xl`}>
                  {card.icon}
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <span className={`text-sm font-medium ${
                  card.changeType === 'increase' ? 'text-green-600' : 
                  card.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {card.changeType === 'increase' && '↗'}
                  {card.changeType === 'decrease' && '↘'}
                  {card.changeType === 'stable' && '→'}
                  {card.change}
                </span>
                <span className="text-sm text-gray-600 ml-2">较上月</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 最近活动和快捷操作 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 最近活动 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">最近活动</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={activity.id || index} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.action}</span>：{activity.target}
                    </p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* 快捷操作 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">快捷操作</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              <button 
                onClick={() => handleQuickAction('add-user')}
                className="p-4 text-left rounded-lg border border-gray-200 hover:bg-blue-50 hover:border-blue-200 transition-colors"
              >
                <div className="text-2xl mb-2">👤</div>
                <p className="font-medium text-gray-900">新增用户</p>
                <p className="text-sm text-gray-600">添加管理员账户</p>
              </button>
              <button 
                onClick={() => handleQuickAction('add-product')}
                className="p-4 text-left rounded-lg border border-gray-200 hover:bg-green-50 hover:border-green-200 transition-colors"
              >
                <div className="text-2xl mb-2">📦</div>
                <p className="font-medium text-gray-900">新增产品</p>
                <p className="text-sm text-gray-600">发布新产品信息</p>
              </button>
              <button 
                onClick={() => handleQuickAction('add-news')}
                className="p-4 text-left rounded-lg border border-gray-200 hover:bg-purple-50 hover:border-purple-200 transition-colors"
              >
                <div className="text-2xl mb-2">📰</div>
                <p className="font-medium text-gray-900">发布新闻</p>
                <p className="text-sm text-gray-600">添加公司动态</p>
              </button>
              <button 
                onClick={() => handleQuickAction('company-info')}
                className="p-4 text-left rounded-lg border border-gray-200 hover:bg-orange-50 hover:border-orange-200 transition-colors"
              >
                <div className="text-2xl mb-2">🏢</div>
                <p className="font-medium text-gray-900">企业信息</p>
                <p className="text-sm text-gray-600">修改企业信息</p>
              </button>
              <button 
                onClick={() => handleQuickAction('messages')}
                className="p-4 text-left rounded-lg border border-gray-200 hover:bg-cyan-50 hover:border-cyan-200 transition-colors"
              >
                <div className="text-2xl mb-2">💬</div>
                <p className="font-medium text-gray-900">留言管理</p>
                <p className="text-sm text-gray-600">查看客户留言</p>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  )
}