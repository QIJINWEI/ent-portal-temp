'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { productsApi } from '../../lib/api'
import { 
  Globe, 
  Smartphone, 
  Database, 
  Cloud, 
  ShoppingCart, 
  BarChart3,
  Package,
  Settings 
} from 'lucide-react'

interface Product {
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

interface Service {
  icon: any
  title: string
  description: string
  features: string[]
  color: string
  price?: number
}

const ServicesSection = () => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // 图标映射
  const iconMap: Record<string, any> = {
    '管理软件': Globe,
    '人工智能': Smartphone,
    '大数据': Database,
    '云服务': Cloud,
    '区块链': BarChart3,
    'default': Package
  }

  // 颜色映射
  const colorMap: Record<string, string> = {
    '管理软件': 'from-blue-500 to-blue-600',
    '人工智能': 'from-green-500 to-green-600',
    '大数据': 'from-purple-500 to-purple-600',
    '办公软件': 'from-orange-500 to-orange-600',
    '云服务': 'from-red-500 to-red-600',
    '区块链': 'from-indigo-500 to-indigo-600',
    'default': 'from-gray-500 to-gray-600'
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const data = await productsApi.getAllProducts()
        // 只获取激活的产品
        const activeProducts = data.filter((product: Product) => product.isActive)
        setProducts(activeProducts)
      } catch (error) {
        console.error('获取产品数据失败:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // 将产品数据转换为服务数据格式
  const getServiceFromProduct = (product: Product): Service => {
    const IconComponent = iconMap[product.category || ''] || iconMap.default
    const color = colorMap[product.category || ''] || colorMap.default
    
    // 将产品特色转换为特性列表
    const features = product.features 
      ? product.features.split(/[;，、\n]/).filter((f: string) => f.trim()).slice(0, 4)
      : ['专业服务', '质量保证', '技术支持', '售后服务']

    return {
      icon: IconComponent,
      title: product.name,
      description: product.description,
      features: features,
      color: color,
      price: product.price
    }
  }

  // 转换产品数据为服务数据
  const services = products.map(getServiceFromProduct)

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
        duration: 0.1,
      },
    },
  }

  // 加载状态
  if (loading) {
    return (
      <section id="services" className="py-20 bg-white" ref={ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">加载产品信息中...</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            产品与服务
          </h2>
          <div className="w-24 h-1 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            提供全方位的数字化解决方案，从网站开发到移动应用，从系统集成到云端部署
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {services.map((service: Service, index: number) => (
            <motion.div
              key={index}
              className="group relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -10 }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-r ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
              
              <div className="relative p-8">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${service.color} rounded-full mb-6 text-white`}>
                  <service.icon className="w-8 h-8" />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 mb-6 leading-relaxed h-12 overflow-hidden line-clamp-2">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.features.map((feature: string, featureIndex: number) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-500">
                      <div className={`w-2 h-2 bg-gradient-to-r ${service.color} rounded-full mr-3`}></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Price */}
                {service.price && (
                  <div className="mt-4 text-lg font-semibold text-gray-900">
                    ¥{service.price}
                  </div>
                )}

                {/* CTA Button */}
                <motion.button
                  className={`mt-6 w-full bg-gradient-to-r ${service.color} text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  了解详情
                </motion.button>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* 无产品时的显示 */}
        {!loading && services.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">暂无产品信息</p>
          </div>
        )}

        {/* Bottom CTA Section */}
        <motion.div
          className="mt-16 text-center bg-gray-50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            需要定制化解决方案？
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            我们的专业团队将根据您的具体需求，为您量身定制最适合的技术解决方案
          </p>
          <motion.button
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            免费咨询
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default ServicesSection