import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useNavigate } from 'react-router-dom'
import { HumanizeEditor } from '../components/HumanizeEditor'
import { OutputCard } from '../components/OutputCard'
import { useAuth } from '../hooks/useAuth'
import { humanizeText, generateMockHumanizedText } from '../utils/api'
import { toast } from '../components/Toast'
import type { HumanizeOptions, HumanizeJob } from '../types'

export function Humanize() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [outputText, setOutputText] = useState('')
  const [currentJob, setCurrentJob] = useState<HumanizeJob | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [])

  const handleHumanize = async (inputText: string, options: HumanizeOptions) => {
    setIsLoading(true)
    setOutputText('')
    
    try {
      const jobId = Math.random().toString(36).substring(2, 15)
      
      // Create job record
      const job: HumanizeJob = {
        id: jobId,
        userId: user?.id || 'guest',
        status: 'processing',
        inputText,
        tone: options.tone,
        degree: options.degree,
        wordCount: inputText.trim().split(/\s+/).filter(w => w.length > 0).length,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      setCurrentJob(job)

      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // For demo, generate mock humanized text
      const humanizedText = generateMockHumanizedText(inputText, options)
      
      // Update job and output
      const completedJob = {
        ...job,
        status: 'completed' as const,
        outputText: humanizedText,
        updatedAt: new Date().toISOString()
      }
      
      setCurrentJob(completedJob)
      setOutputText(humanizedText)
      
      // Save to localStorage for dashboard
      const savedJobs = JSON.parse(localStorage.getItem('humanizeJobs') || '[]')
      savedJobs.unshift(completedJob)
      localStorage.setItem('humanizeJobs', JSON.stringify(savedJobs.slice(0, 50))) // Keep last 50
      
      toast.success('Humanization complete!', 'Your text has been successfully humanized')
    } catch (error) {
      console.error('Humanization error:', error)
      toast.error('Humanization failed', 'Please try again or contact support')
      
      if (currentJob) {
        setCurrentJob({ ...currentJob, status: 'failed' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleRerun = () => {
    if (currentJob) {
      handleHumanize(currentJob.inputText, {
        tone: currentJob.tone,
        degree: currentJob.degree,
        useApiKey: localStorage.getItem('userApiKey') ? true : false
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Text Humanizer
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your AI-generated content into natural, human-like text that passes 
              all detection systems and resonates with your audience.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Panel - Input */}
            <div className="space-y-6">
              <HumanizeEditor 
                onHumanize={handleHumanize}
                isLoading={isLoading}
              />
            </div>

            {/* Right Panel - Output */}
            <div className="space-y-6">
              <OutputCard 
                outputText={outputText}
                isLoading={isLoading}
                onRerun={handleRerun}
              />
            </div>
          </div>

          {/* Features Banner */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="font-semibold mb-2">Lightning Fast</h3>
                <p className="text-primary-100 text-sm">
                  Get humanized content in seconds, not minutes
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🛡️</span>
                </div>
                <h3 className="font-semibold mb-2">100% Undetectable</h3>
                <p className="text-primary-100 text-sm">
                  Bypass all AI detection tools with confidence
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="font-semibold mb-2">Multiple Languages</h3>
                <p className="text-primary-100 text-sm">
                  Support for 50+ languages worldwide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}