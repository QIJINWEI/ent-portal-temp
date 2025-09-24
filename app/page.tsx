import Navbar from '@/components/ui/navbar'
import HeroSection from '@/components/sections/hero-section'
import AboutSection from '@/components/sections/about-section'
import ServicesSection from '@/components/sections/services-section'
import NewsSection from '@/components/sections/news-section'
import ContactSection from '@/components/sections/contact-section'
import Footer from '@/components/ui/footer'

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <NewsSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
