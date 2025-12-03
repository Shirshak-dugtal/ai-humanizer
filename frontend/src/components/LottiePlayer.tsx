import { useEffect, useRef, lazy, Suspense } from 'react'
import { clsx } from 'clsx'

const Lottie = lazy(() => import('lottie-react'))

interface LottiePlayerProps {
  src: string | object
  className?: string
  loop?: boolean
  autoplay?: boolean
  width?: number
  height?: number
  speed?: number
}

function LottieContent({ src, loop = true, autoplay = true, speed = 1, ...props }: LottiePlayerProps) {
  const animationData = typeof src === 'string' ? null : src
  const animationPath = typeof src === 'string' ? src : undefined

  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      autoplay={autoplay}
      speed={speed}
      {...props}
    />
  )
}

export function LottiePlayer({ className, ...props }: LottiePlayerProps) {
  return (
    <div className={clsx('inline-block', className)}>
      <Suspense fallback={<div className="w-full h-full bg-gray-100 rounded animate-pulse" />}>
        <LottieContent {...props} />
      </Suspense>
    </div>
  )
}

// Placeholder animations data - replace with actual Lottie JSON files
export const placeholderAnimations = {
  hero: {
    // TODO: Replace with actual hero Lottie JSON from https://iconscout.com/lottie-animations/ui-ux-design
    // or https://lottiefiles.com/free-animations/ui
    v: '5.5.7',
    fr: 30,
    ip: 0,
    op: 60,
    w: 400,
    h: 400,
    nm: 'Hero Animation',
    ddd: 0,
    assets: [],
    layers: []
  },
  loading: {
    // TODO: Replace with actual loading Lottie JSON
    v: '5.5.7',
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: 'Loading Animation',
    ddd: 0,
    assets: [],
    layers: []
  },
  success: {
    // TODO: Replace with actual success Lottie JSON
    v: '5.5.7',
    fr: 30,
    ip: 0,
    op: 60,
    w: 100,
    h: 100,
    nm: 'Success Animation',
    ddd: 0,
    assets: [],
    layers: []
  }
}