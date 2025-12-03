import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ArrowRight, FileText, Upload, Zap, Shield, Globe } from 'lucide-react'
import { Logo } from '../components/Logo'
import { Button } from '../components/Button'
import { LottiePlayer, placeholderAnimations } from '../components/LottiePlayer'
import { useAuth } from '../hooks/useAuth'

export function Landing() {
  const heroRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!heroRef.current || !cardsRef.current) return

    const tl = gsap.timeline()
    
    // Hero animation
    tl.fromTo(heroRef.current.children,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' }
    )
    
    // Cards animation
    tl.fromTo(cardsRef.current.children,
      { opacity: 0, scale: 0.9, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'back.out(1.7)' },
      '-=0.4'
    )
  }, [])

  const plans = [
    {
      name: 'Free',
      price: 0,
      features: ['5,000 words/month', 'Basic humanization', 'Standard support'],
      cta: 'Get Started'
    },
    {
      name: 'Pro',
      price: 19,
      features: ['50,000 words/month', 'Advanced humanization', 'Priority support', 'API access'],
      cta: 'Start Free Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 99,
      features: ['Unlimited words', 'Custom models', 'Dedicated support', 'Team management'],
      cta: 'Contact Sales'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div ref={heroRef} className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <Logo size="lg" className="mb-6" />
                <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Humanize AI text with the{' '}
                  <span className="text-primary-600">smartest AI humanizer</span>
                </h1>
              </div>
              
              <p className="text-xl text-gray-800 leading-relaxed max-w-2xl">
                Transform your AI-generated content into natural, human-like text with the ultimate 
                Humanize AI text tool. This AI-to-human text converter effortlessly converts output from 
                ChatGPT, Bard, Jasper, Grammarly, GPT4, and other AI text generators into text 
                indistinguishable from human writing.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={isAuthenticated ? "/humanize" : "/auth/signup"}>
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Humanizing
                    <ArrowRight size={20} />
                  </Button>
                </Link>
                <Link to="/plans">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <LottiePlayer
                src={placeholderAnimations.hero}
                className="w-full max-w-md"
                width={400}
                height={400}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Action Cards */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <div ref={cardsRef} className="grid md:grid-cols-2 gap-8">
            <Link to="/humanize" className="group">
              <div className="card p-8 h-full hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200 transition-colors">
                    <FileText className="w-6 h-6 text-primary-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Humanize Text</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Paste your AI-generated text and transform it into natural, human-like content 
                  that bypasses AI detection tools.
                </p>
                <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                  Try it now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            
            <Link to="/humanize" className="group">
              <div className="card p-8 h-full hover:scale-105 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-accent-100 rounded-lg flex items-center justify-center group-hover:bg-accent-200 transition-colors">
                    <Upload className="w-6 h-6 text-accent-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-900">Humanize Docs</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Upload PDF, DOCX, or TXT files and humanize entire documents with just a few clicks. 
                  Perfect for essays, articles, and reports.
                </p>
                <div className="flex items-center text-accent-600 font-medium group-hover:text-accent-700">
                  Upload document
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose HumanifyMe?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Achieve 100% originality and enhance your content creation with the best Humanize AI solution available.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Lightning Fast</h3>
              <p className="text-gray-600">
                Transform your content in seconds with our optimized AI processing pipeline.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">100% Undetectable</h3>
              <p className="text-gray-600">
                Bypass all AI detection tools including GPTZero, Turnitin, and Copyscape.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Multiple Languages</h3>
              <p className="text-gray-600">
                Support for over 50 languages with native-level humanization quality.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600">
              Start free and scale as you grow
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`card p-8 relative hover:shadow-2xl hover:scale-105 transition-all duration-300 ${plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </div>
                
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Link to="/auth/signup">
                  <Button
                    variant={plan.popular ? 'primary' : 'secondary'}
                    className="w-full"
                  >
                    {plan.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}