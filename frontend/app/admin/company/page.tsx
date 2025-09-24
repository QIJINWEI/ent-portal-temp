'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AdminLayout from '../../../components/admin/AdminLayout'
import { companyAPI } from '../../../lib/admin-api'
import { CompanyInfo } from '../../../lib/types'

export default function CompanyManagement() {
  const [company, setCompany] = useState<Partial<CompanyInfo>>({
    name: '',
    description: '',
    phoneNumber: '',
    email: '',
    address: '',
    businessScope: '',
    establishedYear: undefined,
    employeeCount: undefined
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCompanyInfo()
  }, [])

  const fetchCompanyInfo = async () => {
    try {
      setLoading(true)
      // 先尝试获取主要企业信息
      try {
        const mainCompany = await companyAPI.getMainCompany()
        if (mainCompany) {
          setCompany(mainCompany)
          return
        }
      } catch (mainError) {
        console.log('没有主要企业信息，尝试获取所有企业信息')
      }
      
      // 如果没有主要企业信息，获取所有企业信息的第一个
      const companies = await companyAPI.getCompany()
      if (companies && companies.length > 0) {
        setCompany(companies[0])
      }
    } catch (error: any) {
      console.error('获取企业信息失败:', error)
      setError(error.message || '获取企业信息失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      setError('')
      setSuccess('')
      
      if (company.id) {
        // 更新现有企业信息
        await companyAPI.updateCompany(company.id, company)
      } else {
        // 创建新的企业信息
        const newCompany = await companyAPI.createCompany(company)
        setCompany(newCompany)
      }
      
      setSuccess('企业信息更新成功！')
      
      // 3秒后清除成功消息
      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      console.error('更新企业信息失败:', error)
      setError(error.message || '更新企业信息失败')
    } finally {
      setSaving(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCompany(prev => ({
      ...prev,
      [name]: name === 'establishedYear' || name === 'employeeCount' 
        ? (value === '' ? undefined : parseInt(value)) 
        : value
    }))
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
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-gray-900">企业信息管理</h1>
          <p className="mt-2 text-gray-600">管理企业基本信息和联系方式</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业名称 *
                </label>
                <input
                  type="text"
                  name="name"
                  value={company.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="请输入企业名称"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  联系电话
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={company.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="请输入联系电话"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  企业邮箱
                </label>
                <input
                  type="email"
                  name="email"
                  value={company.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="请输入企业邮箱"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  成立年份
                </label>
                <input
                  type="number"
                  name="establishedYear"
                  value={company.establishedYear || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="请输入成立年份"
                  min="1900"
                  max={new Date().getFullYear()}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  员工人数
                </label>
                <input
                  type="number"
                  name="employeeCount"
                  value={company.employeeCount || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  placeholder="请输入员工人数"
                  min="1"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                企业地址
              </label>
              <input
                type="text"
                name="address"
                value={company.address}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="请输入企业地址"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                企业描述 *
              </label>
              <textarea
                name="description"
                value={company.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                placeholder="请输入企业描述"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                经营范围
              </label>
              <textarea
                name="businessScope"
                value={company.businessScope}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500 resize-none"
                placeholder="请输入经营范围"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
                {success}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-colors ${
                  saving 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {saving ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    保存中...
                  </div>
                ) : (
                  '保存企业信息'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AdminLayout>
  )
}