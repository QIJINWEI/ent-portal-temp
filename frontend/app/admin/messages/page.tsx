'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../../components/admin/AdminLayout'
import { messageAPI, Message } from '../../../lib/admin-api'
import { Page } from '../../../lib/types'

export default function MessagesPage() {
  const [messages, setMessages] = useState<Page<Message>>({
    content: [],
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
    first: true,
    last: true,
    numberOfElements: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [replyContent, setReplyContent] = useState('')
  const [filter, setFilter] = useState<{ isRead?: boolean; isReplied?: boolean }>({})
  const [currentPage, setCurrentPage] = useState(0)
  const [stats, setStats] = useState({ unreadCount: 0, unrepliedCount: 0, totalCount: 0 })

  useEffect(() => {
    fetchMessages()
    fetchStats()
  }, [currentPage, filter])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const res = await messageAPI.getMessages({
        page: currentPage,
        size: 10,
        ...filter
      })
      setMessages(res)
    } catch (error: any) {
      console.error('获取留言列表失败:', error)
      setError(error.message || '获取留言列表失败')
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const res = await messageAPI.getMessageStats()
      setStats(res)
    } catch (error: any) {
      console.error('获取统计信息失败:', error)
    }
  }

  const handleView = async (message: Message) => {
    setSelectedMessage(message)
    setReplyContent(message.replyContent || '')
    setShowModal(true)
    
    // 如果是未读消息，标记为已读
    if (!message.isRead) {
      try {
        await messageAPI.markAsRead(message.id!)
        fetchMessages()
        fetchStats()
      } catch (error: any) {
        console.error('标记已读失败:', error)
      }
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyContent.trim()) return

    try {
      await messageAPI.replyMessage(selectedMessage.id!, replyContent)
      setShowModal(false)
      setSelectedMessage(null)
      setReplyContent('')
      fetchMessages()
      fetchStats()
    } catch (error: any) {
      console.error('回复失败:', error)
      setError(error.message || '回复失败')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('确认删除此留言吗？')) {
      try {
        await messageAPI.deleteMessage(id)
        fetchMessages()
        fetchStats()
      } catch (error: any) {
        console.error('删除留言失败:', error)
        setError(error.message || '删除留言失败')
      }
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleFilterChange = (newFilter: { isRead?: boolean; isReplied?: boolean }) => {
    setFilter(newFilter)
    setCurrentPage(0)
  }

  if (loading && messages.content.length === 0) {
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">留言管理</h1>
            <p className="mt-2 text-gray-600">管理客户留言和反馈</p>
          </div>
          
          {/* 统计信息 */}
          <div className="flex space-x-4">
            <div className="bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-blue-600">总留言: {stats.totalCount}</span>
            </div>
            <div className="bg-yellow-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-yellow-600">未读: {stats.unreadCount}</span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-lg">
              <span className="text-sm text-red-600">未回复: {stats.unrepliedCount}</span>
            </div>
          </div>
        </motion.div>

        {/* 筛选器 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm p-4"
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange({})}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                Object.keys(filter).length === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => handleFilterChange({ isRead: false })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter.isRead === false
                  ? 'bg-yellow-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              未读
            </button>
            <button
              onClick={() => handleFilterChange({ isReplied: false })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter.isReplied === false
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              未回复
            </button>
            <button
              onClick={() => handleFilterChange({ isReplied: true })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter.isReplied === true
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              已回复
            </button>
          </div>
        </motion.div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    联系人
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    主题
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    状态
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    留言时间
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {messages.content.map((message) => (
                  <tr key={message.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {message.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {message.email}
                        </div>
                        {message.company && (
                          <div className="text-xs text-gray-400">
                            {message.company}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {message.subject}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          message.isRead
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {message.isRead ? '已读' : '未读'}
                        </span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          message.isReplied
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {message.isReplied ? '已回复' : '待回复'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(message.createdAt!)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleView(message)}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        查看
                      </button>
                      <button
                        onClick={() => handleDelete(message.id!)}
                        className="text-red-600 hover:text-red-900"
                      >
                        删除
                      </button>
                    </td>
                  </tr>
                ))}
                {messages.content.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      暂无留言数据
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* 分页 */}
        {messages.totalPages > 1 && (
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={messages.first}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                上一页
              </button>
              <span className="px-3 py-2 text-gray-700">
                第 {currentPage + 1} 页，共 {messages.totalPages} 页
              </span>
              <button
                onClick={() => setCurrentPage(Math.min(messages.totalPages - 1, currentPage + 1))}
                disabled={messages.last}
                className="px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50"
              >
                下一页
              </button>
            </div>
          </div>
        )}

        {/* 查看/回复模态框 */}
        <AnimatePresence>
          {showModal && selectedMessage && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    留言详情
                  </h2>
                  
                  <div className="space-y-4 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">姓名</label>
                        <p className="text-gray-900">{selectedMessage.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">邮箱</label>
                        <p className="text-gray-900">{selectedMessage.email}</p>
                      </div>
                    </div>
                    
                    {(selectedMessage.phone || selectedMessage.company) && (
                      <div className="grid grid-cols-2 gap-4">
                        {selectedMessage.phone && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">电话</label>
                            <p className="text-gray-900">{selectedMessage.phone}</p>
                          </div>
                        )}
                        {selectedMessage.company && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700">公司</label>
                            <p className="text-gray-900">{selectedMessage.company}</p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">主题</label>
                      <p className="text-gray-900">{selectedMessage.subject}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">留言内容</label>
                      <div className="bg-gray-50 p-4 rounded-lg mt-1">
                        <p className="text-gray-900 whitespace-pre-wrap">{selectedMessage.content}</p>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">留言时间</label>
                      <p className="text-gray-600">{formatDate(selectedMessage.createdAt!)}</p>
                    </div>
                  </div>
                  
                  {selectedMessage.isReplied && selectedMessage.replyContent && (
                    <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                      <h3 className="font-medium text-blue-900 mb-2">已回复内容</h3>
                      <p className="text-blue-800 whitespace-pre-wrap">{selectedMessage.replyContent}</p>
                      <p className="text-sm text-blue-600 mt-2">
                        回复时间: {formatDate(selectedMessage.replyTime!)}
                      </p>
                    </div>
                  )}
                  
                  <div className="mb-6">
                    <label htmlFor="replyContent" className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedMessage.isReplied ? '修改回复' : '回复内容'}
                    </label>
                    <textarea
                      id="replyContent"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="请输入回复内容..."
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-4">
                    <button
                      onClick={() => {
                        setShowModal(false)
                        setSelectedMessage(null)
                        setReplyContent('')
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                      取消
                    </button>
                    <button
                      onClick={handleReply}
                      disabled={!replyContent.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedMessage.isReplied ? '更新回复' : '发送回复'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}