import React, { useState } from 'react';
import { CheckCircle, Users, Calendar, BarChart3, Zap, Shield, Menu, X, ArrowRight, Play, Star , Github , Linkedin , Twitter , Instagram , Mail  } from 'lucide-react';


export default function ProjectManLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Team Collaboration",
      description: "Enterprise-grade collaboration tools with real-time updates, advanced permissions, and integrated communication channels."
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Smart Scheduling",
      description: "Manage Project timelines with resource optimization, dependency tracking, and predictive analytics."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Advanced Analytics",
      description: "Comprehensive project insights with dedicated dashboards, performance metrics, and strategic reporting."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Workflow Automation",
      description: "Streamline processes with automation, custom workflows, and seamless integrations."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Enterprise Security",
      description: "SOC 2 compliant platform with end-to-end encryption, SSO integration, and audit trails."
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Quality Assurance",
      description: "Built-in quality gates, automated testing workflows, and compliance management tools."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">ProjectMan</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Features</a>
              <a href="#solutions" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Solutions</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Pricing</a>
              <a href="#resources" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">Resources</a>
              <div className="flex items-center space-x-4">
                <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  Sign In
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Start Free Trial
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 bg-white">
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-gray-900 font-medium">Features</a>
                <a href="#solutions" className="block text-gray-600 hover:text-gray-900 font-medium">Solutions</a>
                <a href="#pricing" className="block text-gray-600 hover:text-gray-900 font-medium">Pricing</a>
                <a href="#resources" className="block text-gray-600 hover:text-gray-900 font-medium">Resources</a>
                <hr className="border-gray-200" />
                <button className="block w-full text-left text-gray-600 hover:text-gray-900 font-medium">Sign In</button>
                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  Start Free Trial
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gray-50 px-4 sm:px-6 lg:px-8 py-15 lg:py-18">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 mb-6">
                <span className="w-2 h-2 bg-blue-400 rounded-full mr-2"></span>
                Trusted by our growing community of innovators
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise Project Management
              <span className="text-blue-600"> Reimagined</span>
            </h1>

            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Streamline workflows, enhance collaboration, and deliver projects on time with our comprehensive platform designed for modern enterprises.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center cursor-pointer">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive project management capabilities built for enterprise-scale operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="bg-white border border-gray-200 rounded-xl p-8 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your project management?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of enterprise teams who trust ProjectMan to deliver exceptional results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center cursor-pointer">
              Start Free 30-Day Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            No credit card required • Full access to all features • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 lg:px-8 py-6 pt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">PM</span>
                </div>
                <span className="text-xl font-semibold text-gray-900">ProjectMan</span>
              </div>
              <p className="text-gray-600 max-w-md mb-6">
                A college project demonstrating modern project management solutions with cutting-edge web technologies.
              </p>
              <div className="flex space-x-4 mb-6">
                <span className="text-gray-400">Built with React</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">Tailwind CSS</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Project</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Documentation</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Source Code</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Live Demo</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Features</a>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Technologies</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">React.js</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Node.js</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">MongoDB</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Express.js</a>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Academic</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Project Report</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Presentation</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">Abstract</a>
                <a href="#" className="block text-gray-600 hover:text-gray-900 transition-colors">References</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-500">&copy; 2025 ProjectMan - Made with ❤️ by Piyansu Saha</p>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">GitHub Repository</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Contact Team</a>
              <a href="#" className="text-gray-500 hover:text-gray-900 transition-colors">Project Guide</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}