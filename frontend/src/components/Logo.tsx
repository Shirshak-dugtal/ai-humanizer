import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { clsx } from 'clsx'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  animate?: boolean
  className?: string
}

export function Logo({ size = 'md', animate = true, className }: LogoProps) {
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLSpanElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const cornerTLRef = useRef<HTMLDivElement>(null)
  const cornerBRRef = useRef<HTMLDivElement>(null)

  const sizeClasses = {
    sm: 'text-lg px-3 py-1.5',
    md: 'text-2xl px-4 py-2',
    lg: 'text-4xl px-6 py-3'
  }

  useEffect(() => {
    if (!animate || !logoRef.current) return

    const tl = gsap.timeline()

    // Initial state
    gsap.set([textRef.current, frameRef.current, cornerTLRef.current, cornerBRRef.current], {
      opacity: 0,
      scale: 0.8
    })

    // Animation sequence
    tl.to(textRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      ease: 'back.out(1.7)'
    })
    .to(frameRef.current, {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3')
    .to([cornerTLRef.current, cornerBRRef.current], {
      opacity: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
      stagger: 0.1
    }, '-=0.2')
    .to(textRef.current, {
      skewX: 2,
      duration: 0.1,
      ease: 'power2.inOut'
    })
    .to(textRef.current, {
      skewX: 0,
      duration: 0.2,
      ease: 'power2.inOut'
    })

    return () => {
      tl.kill()
    }
  }, [animate])

  return (
    <div 
      ref={logoRef}
      className={clsx('relative inline-block', className)}
    >
      {/* Main dashed frame */}
      <div 
        ref={frameRef}
        className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-lg"
        style={{ 
          transform: 'scale(1.15)',
          zIndex: 1
        }}
      />
      
      {/* Top-left solid corner */}
      <div 
        ref={cornerTLRef}
        className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-solid border-gray-700"
        style={{
          transform: 'translate(-3px, -3px)',
          zIndex: 2
        }}
      />
      
      {/* Bottom-right solid corner */}
      <div 
        ref={cornerBRRef}
        className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-solid border-gray-700"
        style={{
          transform: 'translate(3px, 3px)',
          zIndex: 2
        }}
      />
      
      {/* Logo text */}
      <span 
        ref={textRef}
        className={clsx(
          'relative font-bold text-gray-900 tracking-tight',
          sizeClasses[size]
        )}
        style={{ zIndex: 3 }}
      >
        Humanifyme
      </span>
    </div>
  )
}

// Simplified version without animation for performance
export function LogoSimple({ size = 'md', className }: Omit<LogoProps, 'animate'>) {
  const sizeClasses = {
    sm: 'text-lg px-3 py-1.5',
    md: 'text-2xl px-4 py-2',
    lg: 'text-4xl px-6 py-3'
  }

  return (
    <div className={clsx('relative inline-block', className)}>
      {/* Main dashed frame */}
      <div 
        className="absolute inset-0 border-2 border-dashed border-gray-400 rounded-lg"
        style={{ transform: 'scale(1.15)' }}
      />
      
      {/* Top-left solid corner */}
      <div 
        className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-solid border-gray-700"
        style={{ transform: 'translate(-3px, -3px)' }}
      />
      
      {/* Bottom-right solid corner */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-solid border-gray-700"
        style={{ transform: 'translate(3px, 3px)' }}
      />
      
      {/* Logo text */}
      <span 
        className={clsx(
          'relative font-bold text-gray-900 tracking-tight',
          sizeClasses[size]
        )}
      >
        Humanifyme
      </span>
    </div>
  )
}