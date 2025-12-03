import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Github, Twitter, Mail, Key } from 'lucide-react'
import { Logo } from './Logo'
import { Input } from './Input'
import { Button } from './Button'
import { toast } from './Toast'

export function Footer() {
  const [apiKey, setApiKey] = useState('')

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (apiKey.trim()) {
      localStorage.setItem('userApiKey', apiKey)
      toast.success('API Key saved', 'Your API key has been securely saved for this session')
      setApiKey('')
    }
  }

  const footerLinks = {
    Product: [
      { label: 'Humanize Text', href: '/humanize' },
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'API Access', href: '/plans' },
      { label: 'Pricing', href: '/plans' }
    ],
    Company: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Contact', href: '/contact' }
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'API Reference', href: '/docs/api' },
      { label: 'Examples', href: '/docs/examples' },
      { label: 'Support', href: '/support' }
    ],
    Legal: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ]
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* API Key Demo Section */}
        <div className="py-8 border-b border-gray-200">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
              Quick API Key Demo
            </h3>
            <form onSubmit={handleApiKeySubmit} className="space-y-3">
              <Input
                type="password"
                placeholder="Enter your API key for demo"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                leftIcon={<Key size={18} />}
              />
              <Button 
                type="submit" 
                variant="secondary" 
                size="sm" 
                className="w-full"
                disabled={!apiKey.trim()}
              >
                Save API Key
              </Button>
              <p className="text-xs text-gray-500 text-center">
                Your API key is stored locally and never sent to our servers
              </p>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <Logo size="sm" animate={false} />
              </div>
              <p className="text-gray-600 mb-4 max-w-sm">
                Transform AI-generated content into natural, human-like text with the smartest AI humanizer available.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Twitter size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-600 transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="font-semibold text-gray-900 mb-4">{category}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-gray-600 hover:text-primary-600 transition-colors text-sm"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-600">
              © 2025 HumanifyMe. All rights reserved.
            </p>
            <p className="text-sm text-gray-500">
              Made with ❤️ for better content
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}