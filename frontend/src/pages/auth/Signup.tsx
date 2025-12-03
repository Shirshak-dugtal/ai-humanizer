import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { AuthForm } from '../../components/AuthForm'
import { Logo } from '../../components/Logo'
import { LottiePlayer, placeholderAnimations } from '../../components/LottiePlayer'

export function Signup() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    gsap.fromTo(containerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    )
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 to-white">
      <div className="flex min-h-screen">
        {/* Left Panel - Animation */}
        <div className="hidden lg:flex lg:flex-1 items-center justify-center bg-gradient-to-br from-accent-600 to-accent-800">
          <div className="max-w-md text-center">
            <LottiePlayer
              src={placeholderAnimations.hero}
              className="w-full mb-8"
              width={300}
              height={300}
            />
            <h3 className="text-2xl font-bold text-white mb-4">
              Start Your Content Transformation Journey
            </h3>
            <p className="text-accent-100">
              Create your free account and begin transforming AI-generated content 
              into natural, human-like text that passes all detection systems.
            </p>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-accent-100">5,000 free words monthly</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-accent-100">Multiple humanization styles</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-accent-200" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-accent-100">Document upload support</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
          <div ref={containerRef} className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Logo size="md" className="mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Join HumanifyMe and start creating authentic content today
              </p>
            </div>
            
            <AuthForm mode="signup" />
          </div>
        </div>
      </div>
    </div>
  )
}