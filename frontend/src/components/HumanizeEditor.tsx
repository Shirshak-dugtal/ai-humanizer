import { useState, useEffect } from 'react'
import { FileText, Settings, Key } from 'lucide-react'
import { Button } from './Button'
import { Input } from './Input'
import { FileUpload } from './FileUpload'
import { Modal } from './Modal'
import { toast } from './Toast'
import { uploadFile, generateMockHumanizedText } from '../utils/api'
import { calculateReadabilityScore } from '../utils/validation'
import type { HumanizeOptions } from '../types'
import { clsx } from 'clsx'

interface HumanizeEditorProps {
  onHumanize: (text: string, options: HumanizeOptions) => Promise<void>
  isLoading: boolean
}

export function HumanizeEditor({ onHumanize, isLoading }: HumanizeEditorProps) {
  const [inputText, setInputText] = useState('')
  const [options, setOptions] = useState<HumanizeOptions>({
    tone: 'casual',
    degree: 'medium',
    useApiKey: false
  })
  const [showSettings, setShowSettings] = useState(false)
  const [apiKey, setApiKey] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [readabilityScore, setReadabilityScore] = useState(0)

  useEffect(() => {
    const words = inputText.trim().split(/\s+/).filter(w => w.length > 0).length
    setWordCount(inputText.trim() ? words : 0)
    setReadabilityScore(calculateReadabilityScore(inputText))
  }, [inputText])

  useEffect(() => {
    const savedApiKey = localStorage.getItem('userApiKey')
    if (savedApiKey) {
      setApiKey(savedApiKey)
      setOptions(prev => ({ ...prev, useApiKey: true }))
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    try {
      const jobId = Math.random().toString(36).substring(2, 15)
      const result = await uploadFile(file, jobId)
      setInputText(result.extractedText)
      toast.success('File uploaded', `Extracted text from ${file.name}`)
    } catch (error) {
      toast.error('Upload failed', 'Could not extract text from file')
    }
  }

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast.warning('Input required', 'Please enter text to humanize')
      return
    }

    if (wordCount > 10000) {
      toast.warning('Text too long', 'Please keep text under 10,000 words')
      return
    }

    await onHumanize(inputText, options)
  }

  const handleApiKeyToggle = () => {
    if (options.useApiKey && !apiKey) {
      setShowSettings(true)
    } else {
      setOptions(prev => ({ ...prev, useApiKey: !prev.useApiKey }))
    }
  }

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('userApiKey', apiKey)
      setOptions(prev => ({ ...prev, useApiKey: true }))
      setShowSettings(false)
      toast.success('API key saved', 'Your API key has been saved securely')
    }
  }

  const removeApiKey = () => {
    localStorage.removeItem('userApiKey')
    setApiKey('')
    setOptions(prev => ({ ...prev, useApiKey: false }))
    toast.info('API key removed', 'Using default API service')
  }

  const getReadabilityColor = (score: number) => {
    if (score >= 70) return 'text-green-600'
    if (score >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Input Text
          </h2>
          <p className="text-gray-600 mt-1">
            Paste your AI-generated text or upload a document
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowSettings(true)}
          icon={<Settings size={16} />}
        >
          Settings
        </Button>
      </div>

      {/* File Upload */}
      <FileUpload
        onFileSelect={handleFileUpload}
        accept=".txt,.docx,.pdf"
        maxSizeMB={5}
      />

      {/* Text Input */}
      <div className="space-y-4">
        <textarea
          className="w-full h-64 p-4 border border-gray-300 rounded-lg resize-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 transition-colors"
          placeholder="Paste your AI-generated text here..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
        
        {/* Stats */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span>Words: {wordCount.toLocaleString()}</span>
          <span>Characters: {inputText.length.toLocaleString()}</span>
          {readabilityScore > 0 && (
            <span className={getReadabilityColor(readabilityScore)}>
              Readability: {readabilityScore}/100
            </span>
          )}
        </div>
      </div>

      {/* Options */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tone
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={options.tone}
            onChange={(e) => setOptions(prev => ({ ...prev, tone: e.target.value as 'casual' | 'formal' }))}
          >
            <option value="casual">Casual</option>
            <option value="formal">Formal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Humanization Level
          </label>
          <select
            className="w-full p-3 border border-gray-300 rounded-lg focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            value={options.degree}
            onChange={(e) => setOptions(prev => ({ ...prev, degree: e.target.value as 'low' | 'medium' | 'high' }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* API Key Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center gap-3">
          <Key className="w-5 h-5 text-gray-600" />
          <div>
            <p className="font-medium text-gray-900">Use My API Key</p>
            <p className="text-sm text-gray-600">
              {options.useApiKey ? 'Using your custom API key' : 'Using default service'}
            </p>
          </div>
        </div>
        <button
          onClick={handleApiKeyToggle}
          className={clsx(
            'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2',
            options.useApiKey ? 'bg-primary-600' : 'bg-gray-200'
          )}
        >
          <span
            className={clsx(
              'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out',
              options.useApiKey ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>
      </div>

      {/* Submit Button */}
      <Button
        onClick={handleSubmit}
        disabled={!inputText.trim() || isLoading}
        loading={isLoading}
        size="lg"
        className="w-full"
      >
        {isLoading ? 'Humanizing...' : 'Humanize Text'}
      </Button>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Humanization Settings"
        size="md"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Configuration</h3>
            <Input
              type="password"
              label="Your API Key"
              placeholder="Enter your API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              hint="Your API key will be stored locally and used for humanization requests"
            />
            
            <div className="flex gap-3 mt-4">
              <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                Save API Key
              </Button>
              {apiKey && (
                <Button variant="danger" onClick={removeApiKey}>
                  Remove Key
                </Button>
              )}
            </div>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Humanization Options</h3>
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                <strong>Tone:</strong> Choose between casual (conversational) or formal (professional) writing style.
              </p>
              <p className="text-sm text-gray-600">
                <strong>Level:</strong> Higher levels apply more aggressive humanization but may change meaning more significantly.
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}