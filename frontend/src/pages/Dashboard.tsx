import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useNavigate, Link } from 'react-router-dom'
import { Calendar, FileText, BarChart3, Eye, MoreVertical, Trash2 } from 'lucide-react'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { useAuth } from '../hooks/useAuth'
import { truncateText } from '../utils/validation'
import type { HumanizeJob } from '../types'
import { clsx } from 'clsx'
import { toast } from '../components/Toast'

export function Dashboard() {
  const navigate = useNavigate()
  const { isAuthenticated, user } = useAuth()
  const [jobs, setJobs] = useState<HumanizeJob[]>([])
  const [selectedJob, setSelectedJob] = useState<HumanizeJob | null>(null)
  const [showJobModal, setShowJobModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login')
      return
    }

    // Load jobs from localStorage
    const savedJobs = JSON.parse(localStorage.getItem('humanizeJobs') || '[]')
    setJobs(savedJobs)

    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [isAuthenticated, navigate])

  const handleViewJob = (job: HumanizeJob) => {
    setSelectedJob(job)
    setShowJobModal(true)
  }

  const handleDeleteJob = (jobId: string) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId)
    setJobs(updatedJobs)
    localStorage.setItem('humanizeJobs', JSON.stringify(updatedJobs))
    toast.success('Job deleted', 'The humanization job has been removed')
  }

  const handleRerunJob = (job: HumanizeJob) => {
    // Navigate to humanize page and pre-fill with job data
    navigate('/humanize', { 
      state: { 
        inputText: job.inputText,
        options: {
          tone: job.tone,
          degree: job.degree,
          useApiKey: false
        }
      }
    })
  }

  const getStatusColor = (status: HumanizeJob['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200'
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'failed': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTotalWords = () => {
    return jobs.reduce((total, job) => total + job.wordCount, 0)
  }

  const getCompletedJobs = () => {
    return jobs.filter(job => job.status === 'completed').length
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-xl text-gray-600 mt-2">
                Here's your humanization activity and history
              </p>
            </div>
            
            <Link to="/humanize">
              <Button size="lg">
                New Humanization
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Jobs</p>
                  <p className="text-2xl font-bold text-gray-900">{jobs.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{getCompletedJobs()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Words Processed</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalWords().toLocaleString()}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Plan</p>
                  <p className="text-2xl font-bold text-gray-900 capitalize">{user?.plan}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Jobs */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Recent Humanizations
              </h2>
              <p className="text-gray-600 mt-1">
                Your latest humanization jobs and their status
              </p>
            </div>
            
            {jobs.length === 0 ? (
              <div className="p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No humanizations yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Start by creating your first humanization to see your activity here.
                </p>
                <Link to="/humanize">
                  <Button>Create First Humanization</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {jobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={clsx(
                            'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                            getStatusColor(job.status)
                          )}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(job.createdAt)}
                          </span>
                        </div>
                        
                        <p className="text-gray-900 font-medium mb-1">
                          {truncateText(job.inputText, 100)}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>{job.wordCount.toLocaleString()} words</span>
                          <span className="capitalize">{job.tone} tone</span>
                          <span className="capitalize">{job.degree} level</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewJob(job)}
                          icon={<Eye size={16} />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRerunJob(job)}
                          icon={<FileText size={16} />}
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                          icon={<Trash2 size={16} />}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Details Modal */}
      <Modal
        isOpen={showJobModal}
        onClose={() => setShowJobModal(false)}
        title="Job Details"
        size="lg"
      >
        {selectedJob && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <span className={clsx(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                  getStatusColor(selectedJob.status)
                )}>
                  {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                </span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Created
                </label>
                <p className="text-sm text-gray-900">{formatDate(selectedJob.createdAt)}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Word Count
                </label>
                <p className="text-sm text-gray-900">{selectedJob.wordCount.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Settings
                </label>
                <p className="text-sm text-gray-900 capitalize">
                  {selectedJob.tone} tone, {selectedJob.degree} level
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Text
              </label>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 max-h-32 overflow-y-auto">
                <p className="text-sm text-gray-900">{selectedJob.inputText}</p>
              </div>
            </div>
            
            {selectedJob.outputText && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Humanized Output
                </label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-h-32 overflow-y-auto">
                  <p className="text-sm text-gray-900">{selectedJob.outputText}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowJobModal(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  handleRerunJob(selectedJob)
                  setShowJobModal(false)
                }}
              >
                Re-run Job
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}