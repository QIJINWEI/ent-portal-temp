'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLayout from '../../../components/admin/AdminLayout'

interface SystemConfig {
  id: number
  configKey: string
  configValue: string
  description: string
  createdAt: string
  updatedAt: string
}

interface ConfigForm {
  configKey: string
  configValue: string
  description: string
}

export default function AdminConfigs() {
  const [configs, setConfigs] = useState<SystemConfig[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingConfig, setEditingConfig] = useState<SystemConfig | null>(null)
  const [form, setForm] = useState<ConfigForm>({
    configKey: '',
    configValue: '',
    description: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetchConfigs()
  }, [])

  const fetchConfigs = async () => {
    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch('http://localhost:8080/api/admin/configs', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setConfigs(data)
      }
    } catch (error) {
      console.error('获取配置列表失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('admin_token')
      const url = editingConfig 
        ? `http://localhost:8080/api/admin/configs/${editingConfig.id}`
        : 'http://localhost:8080/api/admin/configs'
      
      const method = editingConfig ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (response.ok) {
        fetchConfigs()
        setShowModal(false)
        resetForm()
      } else {
        const errorData = await response.text()
        setError(errorData || '操作失败')
      }
    } catch (error) {
      setError('网络错误，请稍后重试')
    }
  }

  const handleEdit = (config: SystemConfig) => {
    setEditingConfig(config)
    setForm({
      configKey: config.configKey,
      configValue: config.configValue,
      description: config.description
    })
    setShowModal(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个配置吗？')) return

    try {
      const token = localStorage.getItem('admin_token')
      const response = await fetch(`http://localhost:8080/api/admin/configs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchConfigs()
      }
    } catch (error) {
      console.error('删除配置失败:', error)
    }
  }

  const resetForm = () => {
    setForm({
      configKey: '',
      configValue: '',
      description: ''
    })
    setEditingConfig(null)
    setError('')
  }

  const getConfigTypeIcon = (key: string) => {
    if (key.includes('email')) return '📧'
    if (key.includes('name') || key.includes('title')) return '🏷️'
    if (key.includes('mode')) return '🔧'
    if (key.includes('url')) return '🔗'
    return '⚙️'
  }

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
        {/* 页面标题和操作 */}
        <div className="flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold text-gray-900">系统配置</h1>
            <p className="mt-2 text-gray-600">管理系统全局配置参数</p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            新增配置
          </motion.button>
        </div>

        {/* 配置列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {configs.map((config, index) => (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="text-2xl mr-3">
                    {getConfigTypeIcon(config.configKey)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{config.configKey}</h3>
                    <p className="text-sm text-gray-500">{config.description}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(config)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(config.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm font-medium text-gray-700 mb-1">配置值：</div>
                <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-900 font-mono break-all">
                  {config.configValue}
                </div>
              </div>

              <div className="text-xs text-gray-500">
                更新时间：{new Date(config.updatedAt).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {configs.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-gray-400 text-6xl mb-4">⚙️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无配置</h3>
            <p className="text-gray-500">点击右上角按钮添加第一个系统配置</p>
          </motion.div>
        )}

        {/* 模态框 */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-xl p-6 w-full max-w-md mx-4"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {editingConfig ? '编辑配置' : '新增配置'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">配置键</label>
                    <input
                      type="text"
                      value={form.configKey}
                      onChange={(e) => setForm({ ...form, configKey: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="例如：site_name"
                      required
                      disabled={!!editingConfig}
                    />
                    {editingConfig && (
                      <p className="text-xs text-gray-500 mt-1">配置键不能修改</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">配置值</label>
                    <textarea
                      value={form.configValue}
                      onChange={(e) => setForm({ ...form, configValue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      rows={3}
                      placeholder="输入配置值"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                    <input
                      type="text"
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                      placeholder="配置项说明"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      {editingConfig ? '更新' : '创建'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}