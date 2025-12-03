import { useState, useEffect } from 'react'
import { Copy, Download, RefreshCw, CheckCircle, BarChart } from 'lucide-react'
import { Button } from './Button'
import { toast } from './Toast'
import { copyToClipboard, downloadTextAsFile } from '../utils/api'
import { calculateReadabilityScore, getReadabilityLabel } from '../utils/validation'
import { clsx } from 'clsx'

interface OutputCardProps {
  outputText: string
  isLoading: boolean
  onRerun?: () => void
}

export function OutputCard({ outputText, isLoading, onRerun }: OutputCardProps) {
  const [wordCount, setWordCount] = useState(0)
  const [readabilityScore, setReadabilityScore] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (outputText) {
      const words = outputText.trim().split(/\s+/).filter(w => w.length > 0).length
      setWordCount(words)
      setReadabilityScore(calculateReadabilityScore(outputText))
    } else {
      setWordCount(0)
      setReadabilityScore(0)
    }
  }, [outputText])

  const handleCopy = async () => {
    if (!outputText) return
    
    const success = await copyToClipboard(outputText)
    if (success) {
      setCopied(true)
      toast.success('Copied!', 'Text copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } else {
      toast.error('Copy failed', 'Unable to copy text to clipboard')
    }
  }

  const handleDownload = () => {
    if (!outputText) return
    
    const filename = `humanized-text-${new Date().toISOString().split('T')[0]}.txt`
    downloadTextAsFile(outputText, filename)
    toast.success('Downloaded!', 'Text saved to your device')
  }

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600 bg-green-50'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  if (isLoading) {
    return (
      <div className="card p-8">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Humanizing your text...</h3>
            <p className="text-gray-600 mt-2">
              Please wait while we transform your content into natural, human-like text.
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!outputText) {
    return (
      <div className="card p-8">
        <div className="text-center text-gray-500 space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
            <BarChart className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-700">Output will appear here</h3>
            <p className="text-gray-600 mt-2">
              Your humanized text will be displayed here once processing is complete.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            Humanized Text
          </h2>
          <p className="text-gray-600 mt-1">
            Your content has been successfully humanized
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            icon={<Copy size={16} />}
            disabled={!outputText}
          >
            {copied ? 'Copied!' : 'Copy'}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDownload}
            icon={<Download size={16} />}
            disabled={!outputText}
          >
            Download
          </Button>
          {onRerun && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onRerun}
              icon={<RefreshCw size={16} />}
            >
              Re-run
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-medium text-sm">W</span>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-900">Word Count</p>
              <p className="text-2xl font-bold text-blue-600">{wordCount.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className={clsx('p-4 rounded-lg border', getReadabilityColor(readabilityScore))}>
          <div className="flex items-center gap-2">
            <div className={clsx('w-8 h-8 rounded-full flex items-center justify-center', 
              readabilityScore >= 70 ? 'bg-green-100' : 
              readabilityScore >= 50 ? 'bg-yellow-100' : 'bg-red-100'
            )}>
              <BarChart className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Readability</p>
              <p className="text-2xl font-bold">{readabilityScore}/100</p>
              <p className="text-xs opacity-75">{getReadabilityLabel(readabilityScore)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-900">Status</p>
              <p className="text-lg font-bold text-green-600">Humanized</p>
            </div>
          </div>
        </div>
      </div>

      {/* Output Text */}
      <div className="card p-6">
        <div className="relative">
          <textarea
            className="w-full h-64 p-4 border border-gray-200 rounded-lg resize-none bg-gray-50 text-gray-900"
            value={outputText}
            readOnly
          />
          
          {/* Overlay buttons */}
          <div className="absolute top-2 right-2 flex gap-1">
            <button
              onClick={handleCopy}
              className="p-1.5 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors"
              title="Copy to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-gray-600" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 bg-white border border-gray-300 rounded shadow-sm hover:bg-gray-50 transition-colors"
              title="Download as file"
            >
              <Download className="w-3.5 h-3.5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-primary-50 p-4 rounded-lg border border-primary-200">
        <h4 className="font-medium text-primary-900 mb-2">💡 Tips for best results:</h4>
        <ul className="text-sm text-primary-800 space-y-1">
          <li>• Review the humanized text for accuracy and context</li>
          <li>• Consider running multiple variations for different tones</li>
          <li>• Use the readability score to gauge content accessibility</li>
          <li>• Save successful humanizations to your dashboard for future reference</li>
        </ul>
      </div>
    </div>
  )
}