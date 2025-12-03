import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { Check, X, Zap, Crown, Building2, Key } from 'lucide-react'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'
import { toast } from '../components/Toast'
import { clsx } from 'clsx'

export function Plans() {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly')
  const [showApiModal, setShowApiModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
      )
    }
  }, [])

  const plans = {
    monthly: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        icon: <Zap className="w-6 h-6" />,
        description: 'Perfect for trying out our service',
        features: [
          { text: '5,000 words per month', included: true },
          { text: 'Basic humanization', included: true },
          { text: 'Standard support', included: true },
          { text: 'File uploads (.txt only)', included: true },
          { text: 'API access', included: false },
          { text: 'Priority processing', included: false },
          { text: 'Advanced humanization', included: false },
          { text: 'Custom models', included: false }
        ],
        cta: 'Get Started',
        popular: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 19,
        icon: <Crown className="w-6 h-6" />,
        description: 'Best for content creators and marketers',
        features: [
          { text: '50,000 words per month', included: true },
          { text: 'Advanced humanization', included: true },
          { text: 'Priority support', included: true },
          { text: 'All file formats (.txt, .docx, .pdf)', included: true },
          { text: 'API access (1,000 requests/month)', included: true },
          { text: 'Priority processing', included: true },
          { text: 'Multiple tone options', included: true },
          { text: 'Custom models', included: false }
        ],
        cta: 'Start Free Trial',
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 99,
        icon: <Building2 className="w-6 h-6" />,
        description: 'For teams and large organizations',
        features: [
          { text: 'Unlimited words', included: true },
          { text: 'Custom AI models', included: true },
          { text: 'Dedicated support', included: true },
          { text: 'All file formats + bulk upload', included: true },
          { text: 'Unlimited API access', included: true },
          { text: 'Instant processing', included: true },
          { text: 'Team management', included: true },
          { text: 'SLA guarantee', included: true }
        ],
        cta: 'Contact Sales',
        popular: false
      }
    ],
    yearly: [
      {
        id: 'free',
        name: 'Free',
        price: 0,
        icon: <Zap className="w-6 h-6" />,
        description: 'Perfect for trying out our service',
        features: [
          { text: '5,000 words per month', included: true },
          { text: 'Basic humanization', included: true },
          { text: 'Standard support', included: true },
          { text: 'File uploads (.txt only)', included: true },
          { text: 'API access', included: false },
          { text: 'Priority processing', included: false },
          { text: 'Advanced humanization', included: false },
          { text: 'Custom models', included: false }
        ],
        cta: 'Get Started',
        popular: false
      },
      {
        id: 'pro',
        name: 'Pro',
        price: 190, // 19 * 10 (2 months free)
        originalPrice: 228,
        icon: <Crown className="w-6 h-6" />,
        description: 'Best for content creators and marketers',
        features: [
          { text: '50,000 words per month', included: true },
          { text: 'Advanced humanization', included: true },
          { text: 'Priority support', included: true },
          { text: 'All file formats (.txt, .docx, .pdf)', included: true },
          { text: 'API access (1,000 requests/month)', included: true },
          { text: 'Priority processing', included: true },
          { text: 'Multiple tone options', included: true },
          { text: 'Custom models', included: false }
        ],
        cta: 'Start Free Trial',
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 990, // 99 * 10 (2 months free)
        originalPrice: 1188,
        icon: <Building2 className="w-6 h-6" />,
        description: 'For teams and large organizations',
        features: [
          { text: 'Unlimited words', included: true },
          { text: 'Custom AI models', included: true },
          { text: 'Dedicated support', included: true },
          { text: 'All file formats + bulk upload', included: true },
          { text: 'Unlimited API access', included: true },
          { text: 'Instant processing', included: true },
          { text: 'Team management', included: true },
          { text: 'SLA guarantee', included: true }
        ],
        cta: 'Contact Sales',
        popular: false
      }
    ]
  }

  const currentPlans = plans[selectedPlan]

  const handleSelectPlan = (planId: string) => {
    if (planId === 'free') {
      toast.success('Free plan selected', 'You can start using HumanifyMe right away!')
    } else if (planId === 'enterprise') {
      toast.info('Contact sales', 'Our team will reach out to discuss enterprise options')
    } else {
      toast.success('Plan selected', `Starting your ${planId} plan trial...`)
    }
  }

  const mockApiKey = 'hmfy_sk_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'

  const handleGetApiKey = () => {
    setShowApiModal(true)
  }

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(mockApiKey)
      toast.success('Copied!', 'API key copied to clipboard')
    } catch (error) {
      toast.error('Copy failed', 'Unable to copy API key')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div ref={containerRef} className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose the Perfect Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Start free and scale as you grow. All plans include our core humanization features 
              with varying limits and advanced capabilities.
            </p>
            
            {/* Billing Toggle */}
            <div className="inline-flex items-center bg-white rounded-lg p-1 border border-gray-300">
              <button
                onClick={() => setSelectedPlan('monthly')}
                className={clsx(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  selectedPlan === 'monthly'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setSelectedPlan('yearly')}
                className={clsx(
                  'px-4 py-2 rounded-md text-sm font-medium transition-all relative',
                  selectedPlan === 'yearly'
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                )}
              >
                Yearly
                <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8">
            {currentPlans.map((plan) => (
              <div
                key={plan.id}
                className={clsx(
                  'bg-white rounded-xl border shadow-sm relative',
                  plan.popular
                    ? 'border-primary-500 ring-2 ring-primary-500 scale-105'
                    : 'border-gray-200 hover:border-gray-300'
                )}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={clsx(
                      'w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4',
                      plan.id === 'free' ? 'bg-blue-100 text-blue-600' :
                      plan.id === 'pro' ? 'bg-purple-100 text-purple-600' :
                      'bg-gray-100 text-gray-600'
                    )}>
                      {plan.icon}
                    </div>
                    
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    
                    <p className="text-gray-600 mb-4">
                      {plan.description}
                    </p>
                    
                    <div className="mb-4">
                      {plan.originalPrice && (
                        <div className="text-lg text-gray-500 line-through">
                          ${plan.originalPrice}/{selectedPlan === 'yearly' ? 'year' : 'month'}
                        </div>
                      )}
                      <div className="text-4xl font-bold text-gray-900">
                        ${plan.price}
                        <span className="text-lg text-gray-600 font-normal">
                          /{selectedPlan === 'yearly' ? 'year' : 'month'}
                        </span>
                      </div>
                      {selectedPlan === 'yearly' && plan.originalPrice && (
                        <div className="text-sm text-green-600 font-medium">
                          Save ${plan.originalPrice - plan.price}/year
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Features */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-300 mt-0.5 flex-shrink-0" />
                        )}
                        <span className={clsx(
                          'text-sm',
                          feature.included ? 'text-gray-700' : 'text-gray-400'
                        )}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* CTA */}
                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    variant={plan.popular ? 'primary' : 'secondary'}
                    size="lg"
                    className="w-full mb-4"
                  >
                    {plan.cta}
                  </Button>
                  
                  {plan.id !== 'free' && (
                    <p className="text-xs text-gray-500 text-center">
                      {plan.id === 'enterprise' ? 'Custom pricing available' : '14-day free trial included'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* API Access Section */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-8 text-white">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-4">
                    Need API Access?
                  </h2>
                  <p className="text-primary-100 mb-6">
                    Integrate HumanifyMe directly into your applications, websites, or workflows 
                    with our powerful API. Get started with comprehensive documentation and examples.
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary-200" />
                      <span className="text-primary-100">RESTful API with JSON responses</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary-200" />
                      <span className="text-primary-100">Real-time processing webhooks</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary-200" />
                      <span className="text-primary-100">Comprehensive documentation</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="w-5 h-5 text-primary-200" />
                      <span className="text-primary-100">SDKs for popular languages</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="bg-white bg-opacity-10 rounded-lg p-6 mb-6">
                    <Key className="w-12 h-12 mx-auto mb-4 text-primary-200" />
                    <h3 className="text-xl font-semibold mb-2">Get Your API Key</h3>
                    <p className="text-primary-100 text-sm mb-4">
                      Start integrating HumanifyMe into your workflow
                    </p>
                  </div>
                  
                  <Button
                    onClick={handleGetApiKey}
                    variant="secondary"
                    size="lg"
                    icon={<Key size={20} />}
                  >
                    Get API Key
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Can I change plans anytime?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes! You can upgrade, downgrade, or cancel your plan at any time. 
                    Changes take effect at the start of your next billing cycle.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    What file formats do you support?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Free plans support .txt files. Pro and Enterprise plans support 
                    .txt, .docx, and .pdf files with advanced extraction capabilities.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is there a free trial?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes! All paid plans include a 14-day free trial. You can also 
                    use our free plan indefinitely with basic features.
                  </p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    How accurate is the humanization?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Our AI achieves 95%+ human-like quality and passes all major 
                    AI detection tools including GPTZero, Turnitin, and Copyscape.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Do you offer enterprise support?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Yes! Enterprise plans include dedicated support, custom integrations, 
                    and SLA guarantees. Contact our sales team for more details.
                  </p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Is my data secure?
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Absolutely. We use enterprise-grade encryption and never store 
                    your content longer than necessary for processing.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      <Modal
        isOpen={showApiModal}
        onClose={() => setShowApiModal(false)}
        title="Your API Key"
        size="lg"
      >
        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Demo API Key
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>
                    This is a demo API key for testing purposes. In a real application, 
                    this would be generated after account verification and payment setup.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type="text"
                value={mockApiKey}
                readOnly
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-900 font-mono text-sm"
              />
              <Button
                onClick={copyApiKey}
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                Copy
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Quick Start</h4>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm text-gray-700 overflow-x-auto">
{`curl -X POST https://api.humanifyme.com/v1/humanize \
  -H "Authorization: Bearer ${mockApiKey}" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Your AI-generated text here",
    "tone": "casual",
    "degree": "medium"
  }'`}
              </pre>
            </div>
          </div>
          
          <div className="flex justify-between items-center">
            <a
              href="#"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View API Documentation →
            </a>
            <Button
              onClick={() => setShowApiModal(false)}
              variant="primary"
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}