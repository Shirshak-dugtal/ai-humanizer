import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AuthForm } from '../../components/AuthForm'
import { Logo } from '../../components/Logo'
import { LottiePlayer, placeholderAnimations } from '../../components/LottiePlayer'

export function Login() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="flex min-h-screen">
        {/* Left Panel - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div ref={containerRef} className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Logo size="md" className="mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to your account to continue humanizing your content
              </p>
            </div>
            
            <AuthForm mode="login" />
          </div>
        </div>
        
        {/* Right Panel - Animation */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gradient-to-br from-primary-600 to-primary-800">
          <div className="max-w-md text-center">
            <LottiePlayer
              src={placeholderAnimations.hero}
              className="w-full mb-8"
              width={300}
              height={300}
            />
            <h3 className="text-2xl font-bold text-white mb-4">
              Transform AI Text to Human-Like Content
            </h3>
            <p className="text-primary-100">
              Join thousands of users who trust HumanifyMe to create authentic, 
              undetectable content that resonates with their audience.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}