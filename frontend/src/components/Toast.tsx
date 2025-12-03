import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { gsap } from 'gsap'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { clsx } from 'clsx'
import type { Toast } from '../types'

interface ToastItemProps {
  toast: Toast
  onRemove: (id: string) => void
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const toastRef = useRef<HTMLDivElement>(null)

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  }

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }

  useEffect(() => {
    if (!toastRef.current) return

    // Entry animation
    gsap.fromTo(toastRef.current,
      { opacity: 0, x: 100, scale: 0.9 },
      { opacity: 1, x: 0, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }
    )

    // Auto remove
    const duration = toast.duration || 5000
    const timer = setTimeout(() => {
      handleRemove()
    }, duration)

    return () => clearTimeout(timer)
  }, [])

  const handleRemove = () => {
    if (!toastRef.current) {
      onRemove(toast.id)
      return
    }

    gsap.to(toastRef.current, {
      opacity: 0,
      x: 100,
      scale: 0.9,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => onRemove(toast.id)
    })
  }

  return (
    <div
      ref={toastRef}
      className={clsx(
        'flex items-start gap-3 p-4 rounded-lg border shadow-lg max-w-md',
        colors[toast.type]
      )}
    >
      <div className="flex-shrink-0 pt-0.5">
        {icons[toast.type]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm opacity-90">{toast.message}</p>
        )}
      </div>
      <button
        onClick={handleRemove}
        className="flex-shrink-0 p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

let toasts: Toast[] = []
let listeners: ((toasts: Toast[]) => void)[] = []

function addToast(toast: Omit<Toast, 'id'>) {
  const newToast: Toast = {
    ...toast,
    id: Math.random().toString(36).substring(2, 15)
  }
  toasts = [...toasts, newToast]
  listeners.forEach(listener => listener(toasts))
}

function removeToast(id: string) {
  toasts = toasts.filter(toast => toast.id !== id)
  listeners.forEach(listener => listener(toasts))
}

export function ToastContainer() {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([])

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setCurrentToasts(newToasts)
    }
    listeners.push(listener)

    return () => {
      listeners = listeners.filter(l => l !== listener)
    }
  }, [])

  if (currentToasts.length === 0) return null

  return createPortal(
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {currentToasts.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>,
    document.body
  )
}

export const toast = {
  success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
  warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
  info: (title: string, message?: string) => addToast({ type: 'info', title, message })
}