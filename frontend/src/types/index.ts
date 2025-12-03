export interface User {
  id: string
  email: string
  name: string
  plan: 'free' | 'pro' | 'enterprise'
  apiKey?: string
  createdAt: string
}

export interface HumanizeJob {
  id: string
  userId: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  inputText: string
  outputText?: string
  tone: 'casual' | 'formal'
  degree: 'low' | 'medium' | 'high'
  fileName?: string
  fileType?: string
  wordCount: number
  createdAt: string
  updatedAt: string
}

export interface Plan {
  id: string
  name: string
  price: number
  features: string[]
  monthlyQuota: number
  priority: boolean
  apiAccess: boolean
}

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface AuthFormData {
  email: string
  password: string
  name?: string
}

export interface PasswordValidation {
  minLength: boolean
  hasUppercase: boolean
  hasLowercase: boolean
  hasNumber: boolean
  hasSpecialChar: boolean
}

export interface HumanizeOptions {
  tone: 'casual' | 'formal'
  degree: 'low' | 'medium' | 'high'
  useApiKey: boolean
}