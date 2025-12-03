import { toast } from '../components/Toast'
import type { HumanizeJob, HumanizeOptions } from '../types'

// N8N webhook endpoints
const N8N_BASE_URL = import.meta.env.VITE_N8N_WEBHOOK_URL || 'http://localhost:5678/webhook'

// API endpoints
const API_ENDPOINTS = {
  humanize: `${N8N_BASE_URL}/humanize`,
  uploadFile: `${N8N_BASE_URL}/upload`,
  jobStatus: (jobId: string) => `${N8N_BASE_URL}/job/${jobId}/status`,
}

// Mock API delay for demo
const MOCK_DELAY = 2000

export async function humanizeText(
  text: string,
  options: HumanizeOptions,
  jobId: string
): Promise<{ jobId: string; status: 'pending' | 'processing' }> {
  try {
    // Get user API key if using custom key
    const apiKey = options.useApiKey ? localStorage.getItem('userApiKey') : null
    
    const payload = {
      jobId,
      inputText: text,
      tone: options.tone,
      degree: options.degree,
      ...(apiKey && { apiKey })
    }

    // In production, this would call n8n webhook
    const response = await fetch(API_ENDPOINTS.humanize, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      },
      body: JSON.stringify(payload)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Humanize API error:', error)
    
    // For demo purposes, return mock success
    await new Promise(resolve => setTimeout(resolve, 500))
    return {
      jobId,
      status: 'processing'
    }
  }
}

export async function uploadFile(
  file: File,
  jobId: string
): Promise<{ jobId: string; extractedText: string }> {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('jobId', jobId)

    const response = await fetch(API_ENDPOINTS.uploadFile, {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Upload API error:', error)
    
    // For demo purposes, return mock extracted text
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
      jobId,
      extractedText: `[Mock extracted text from ${file.name}]\n\nThis is a placeholder for the actual text that would be extracted from your uploaded file. The extraction service would parse PDF, DOCX, or TXT files and return the content here for humanization.`
    }
  }
}

export async function getJobStatus(jobId: string): Promise<HumanizeJob | null> {
  try {
    const response = await fetch(API_ENDPOINTS.jobStatus(jobId))
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Job status API error:', error)
    return null
  }
}

// Mock humanized output for demo
export function generateMockHumanizedText(inputText: string, options: HumanizeOptions): string {
  const variations = {
    casual: {
      low: (text: string) => text.replace(/\. /g, '. Also, ').replace(/However,/g, 'But'),
      medium: (text: string) => text.replace(/utilize/g, 'use').replace(/facilitate/g, 'help').replace(/Additionally,/g, 'Plus,'),
      high: (text: string) => text.split('.').map(sentence => 
        sentence.trim() ? sentence.trim() + '. You know what I mean?' : sentence
      ).join(' ')
    },
    formal: {
      low: (text: string) => text.replace(/can't/g, 'cannot').replace(/won't/g, 'will not'),
      medium: (text: string) => text.replace(/\bget\b/g, 'obtain').replace(/\bshow\b/g, 'demonstrate'),
      high: (text: string) => 'In conclusion, ' + text.replace(/\. /g, '. Furthermore, ')
    }
  }

  const transformer = variations[options.tone][options.degree]
  return transformer(inputText)
}

// Clipboard utility
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.left = '-999999px'
      textarea.style.top = '-999999px'
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()
      const result = document.execCommand('copy')
      textarea.remove()
      return result
    }
  } catch (error) {
    console.error('Copy to clipboard failed:', error)
    return false
  }
}

// Download utility
export function downloadTextAsFile(text: string, filename: string = 'humanized-text.txt'): void {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}