import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, User, CheckCircle, X } from 'lucide-react'
import { clsx } from 'clsx'
import { Input } from './Input'
import { Button } from './Button'
import { toast } from './Toast'
import { validatePassword } from '../utils/validation'
import type { AuthFormData, PasswordValidation } from '../types'

interface AuthFormProps {
  mode: 'login' | 'signup'
}

export function AuthForm({ mode }: AuthFormProps) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState<AuthFormData>({
    email: '',
    password: '',
    name: ''
  })
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
    minLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  })
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<AuthFormData>>({})

  useEffect(() => {
    if (mode === 'signup' && formData.password) {
      setPasswordValidation(validatePassword(formData.password))
    }
  }, [formData.password, mode])

  const handleInputChange = (field: keyof AuthFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<AuthFormData> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (mode === 'signup') {
      const validation = validatePassword(formData.password)
      const isValid = Object.values(validation).every(Boolean)
      if (!isValid) {
        newErrors.password = 'Password does not meet requirements'
      }
    }

    if (mode === 'signup' && !formData.name) {
      newErrors.name = 'Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate success
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        email: formData.email,
        name: formData.name || formData.email.split('@')[0],
        plan: 'free' as const,
        createdAt: new Date().toISOString()
      }

      localStorage.setItem('user', JSON.stringify(userData))
      
      toast.success(
        mode === 'login' ? 'Welcome back!' : 'Account created!',
        mode === 'login' ? 'You have been logged in successfully' : 'Your account has been created successfully'
      )
      
      navigate('/')
    } catch (error) {
      toast.error(
        'Authentication failed',
        'Please check your credentials and try again'
      )
    } finally {
      setIsLoading(false)
    }
  }

  const passwordRequirements = [
    { key: 'minLength', label: 'At least 8 characters', valid: passwordValidation.minLength },
    { key: 'hasUppercase', label: 'One uppercase letter', valid: passwordValidation.hasUppercase },
    { key: 'hasLowercase', label: 'One lowercase letter', valid: passwordValidation.hasLowercase },
    { key: 'hasNumber', label: 'One number', valid: passwordValidation.hasNumber },
    { key: 'hasSpecialChar', label: 'One special character (!@#$%^&*)', valid: passwordValidation.hasSpecialChar }
  ]

  const getPasswordStrength = (): { strength: number; label: string; color: string } => {
    const validCount = Object.values(passwordValidation).filter(Boolean).length
    const strength = (validCount / 5) * 100
    
    if (strength < 40) return { strength, label: 'Weak', color: 'bg-red-500' }
    if (strength < 80) return { strength, label: 'Medium', color: 'bg-yellow-500' }
    return { strength, label: 'Strong', color: 'bg-green-500' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === 'signup' && (
          <Input
            type="text"
            placeholder="Full name"
            value={formData.name || ''}
            onChange={handleInputChange('name')}
            error={errors.name}
            leftIcon={<User size={18} />}
            required
          />
        )}
        
        <Input
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleInputChange('email')}
          error={errors.email}
          leftIcon={<Mail size={18} />}
          required
        />
        
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleInputChange('password')}
            error={errors.password}
            leftIcon={<Lock size={18} />}
            required
          />
          
          {mode === 'signup' && formData.password && (
            <div className="mt-4 space-y-3">
              {/* Password strength meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Password strength</span>
                  <span className={clsx(
                    'font-medium',
                    passwordStrength.strength < 40 ? 'text-red-600' :
                    passwordStrength.strength < 80 ? 'text-yellow-600' : 'text-green-600'
                  )}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={clsx('h-2 rounded-full transition-all duration-300', passwordStrength.color)}
                    style={{ width: `${passwordStrength.strength}%` }}
                  />
                </div>
              </div>
              
              {/* Password requirements checklist */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Password requirements:</p>
                <div className="space-y-1">
                  {passwordRequirements.map((req) => (
                    <div key={req.key} className="flex items-center gap-2 text-sm">
                      {req.valid ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <X className="w-4 h-4 text-gray-400" />
                      )}
                      <span className={clsx(
                        req.valid ? 'text-green-700' : 'text-gray-600'
                      )}>
                        {req.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
        >
          {mode === 'login' ? 'Sign In' : 'Create Account'}
        </Button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
          {' '}
          <Link
            to={mode === 'login' ? '/auth/signup' : '/auth/login'}
            className="font-medium text-primary-600 hover:text-primary-700 transition-colors"
          >
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  )
}