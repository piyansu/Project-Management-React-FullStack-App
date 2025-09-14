import React, { useState } from 'react';
import { CheckCircle, Users, Calendar, BarChart3, Zap, Shield, Menu, X, ArrowRight, Play, Star, Github, Linkedin, Twitter, Instagram, Mail, Check } from 'lucide-react';

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

  const pricingPlans = [
    {
      name: "Starter",
      price: "Free",
      duration: "Forever",
      description: "Perfect for small teams getting started",
      features: [
        "Up to 5 team members",
        "3 projects",
        "Basic task management",
        "Email support"
      ],
      highlighted: false,
      buttonText: "Get Started",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800"
    },
    {
      name: "Professional",
      price: "$12",
      duration: "per user/month",
      description: "Ideal for growing teams and businesses",
      features: [
        "Up to 50 team members",
        "Unlimited projects",
        "Advanced analytics",
        "Priority support",
        "Custom workflows",
        
      ],
      highlighted: true,
      buttonText: "Start Free Trial",
      buttonStyle: "bg-blue-600 text-white hover:bg-blue-700"
    },
    {
      name: "Enterprise",
      price: "$24",
      duration: "per user/month",
      description: "For large organizations with advanced needs",
      features: [
        "Unlimited team members",
        "Unlimited projects",
        "Advanced security",
        "24/7 dedicated support",
        "Time tracking"
      ],
      highlighted: false,
      buttonText: "Contact Sales",
      buttonStyle: "bg-gray-900 text-white hover:bg-gray-800"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="relative z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-sm">PM</span>
              </div>
              <span className="text-xl font-bold text-gray-900">ProjectMan</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">Pricing</a>
              <div className="flex items-center space-x-3">
                <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50">
                  Login
                </button>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                  Sign Up
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-blue-600 font-medium py-2">Features</a>
                <a href="#pricing" className="block text-gray-600 hover:text-blue-600 font-medium py-2">Pricing</a>
                <hr className="border-gray-200" />
                <button className="block w-full text-left text-gray-600 hover:text-blue-600 font-medium py-2">Login</button>
                <button className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by 10,000+ teams worldwide
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Enterprise Project Management
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Reimagined</span>
            </h1>

            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              Streamline workflows, enhance collaboration, and deliver projects on time with our comprehensive platform designed for modern enterprises.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
              <button className="group bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center text-gray-600 hover:text-blue-600 font-medium px-4 py-2 rounded-lg hover:bg-white hover:shadow-md transition-all">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                30-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
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
                <div className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer hover:border-blue-200">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 group-hover:scale-110">
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

      {/* Pricing Section */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Choose the perfect plan for your team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Start free and scale as your business grows. All plans include our core features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${plan.highlighted ? 'border-blue-500 ring-4 ring-blue-100' : 'border-gray-200'}`}>
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== "Free" && <span className="text-gray-600 ml-1">/{plan.duration}</span>}
                  </div>

                  <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-8 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>

                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Need a custom solution for your enterprise?</p>
            <button className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center">
              Contact our sales team
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to transform your project management?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of enterprise teams who trust ProjectMan to deliver exceptional results
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Start Free 30-Day Trial
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white hover:text-gray-900 transition-colors">
              Schedule a Demo
            </button>
          </div>
          <p className="text-sm text-gray-400 mt-6 flex items-center justify-center space-x-6">
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              No credit card required
            </span>
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Full access to all features
            </span>
            <span className="flex items-center">
              <CheckCircle className="h-4 w-4 mr-2" />
              Cancel anytime
            </span>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">PM</span>
                </div>
                <span className="text-xl font-bold text-gray-900">ProjectMan</span>
              </div>
              <p className="text-gray-600 max-w-md mb-6">
                A modern project management solution demonstrating cutting-edge web technologies and enterprise-grade features.
              </p>
              <div className="flex space-x-4 mb-6">
                <span className="text-gray-400 text-sm">Built with React</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">Tailwind CSS</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400 text-sm">Lucide Icons</span>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Github className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Project</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Documentation</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Source Code</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Live Demo</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Features</a>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Technologies</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">React.js</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Node.js</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">MongoDB</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Express.js</a>
              </div>
            </div>

            <div>
              <h4 className="text-gray-900 font-semibold mb-4">Academic</h4>
              <div className="space-y-3">
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Project Report</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Presentation</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">Abstract</a>
                <a href="#" className="block text-gray-600 hover:text-blue-600 transition-colors">References</a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-500">&copy; 2025 ProjectMan - Made with ❤️ by Piyansu Saha</p>
            <div className="flex space-x-6 mt-4 lg:mt-0">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">GitHub Repository</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Contact Team</a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors">Project Guide</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}