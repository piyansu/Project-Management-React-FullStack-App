import { useState } from 'react';
import { CheckCircle, Users, Calendar, BarChart3, Zap, Shield, Menu, X, ArrowRight, Github, Linkedin, Mail, Check, Send, Star, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
// 1. Import the logo image from the assets folder
import projectManLogo from '../assets/logo.png';

export default function ProjectManLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    name: '',
    email: '',
    rating: 5,
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState('');

  const handleSmoothScroll = (e) => {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      if (isMenuOpen) {
        setIsMenuOpen(false);
      }
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult("Sending....");

    const formData = new FormData(e.target);
    formData.append("access_key", import.meta.env.VITE_WEB3FORMS_ACCESS_KEY);
    formData.append("rating", feedbackForm.rating);

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitResult("Form Submitted Successfully!");
        setFeedbackForm({ name: '', email: '', rating: 5, message: '' });
        setTimeout(() => setSubmitResult(''), 5000);
      } else {
        console.log("Error", data);
        setSubmitResult(data.message);
      }
    } catch (error) {
      console.error("Submission Error:", error);
      setSubmitResult("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    setFeedbackForm({
      ...feedbackForm,
      [e.target.name]: e.target.value
    });
  };

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
      price: "₹499",
      duration: "month",
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
      price: "₹899",
      duration: "month",
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
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* 2. Replace the old logo with the new image tag */}
              <img src={projectManLogo} alt="ProjectMan Logo" className="h-10 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <a href="#features" onClick={handleSmoothScroll} className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer">Features</a>
              <a href="#pricing" onClick={handleSmoothScroll} className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer">Pricing</a>
              <a href="#feedback" onClick={handleSmoothScroll} className="text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer">Feedback</a>
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <button className="text-gray-600 hover:text-blue-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                    Login
                  </button>
                </Link>
                <Link to="/login">
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md cursor-pointer">
                    Sign Up
                  </button>
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button with Animation */}
            <button
              className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="relative w-6 h-6">
                <Menu className={`h-6 w-6 absolute transition-all duration-300 transform ${isMenuOpen ? 'rotate-180 opacity-0' : 'rotate-0 opacity-100'}`} />
                <X className={`h-6 w-6 absolute transition-all duration-300 transform ${isMenuOpen ? 'rotate-0 opacity-100' : '-rotate-180 opacity-0'}`} />
              </div>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-100 bg-white shadow-lg">
              <div className="px-4 py-6 space-y-4">
                <a href="#features" onClick={handleSmoothScroll} className="block text-gray-600 hover:text-blue-600 font-medium py-2">Features</a>
                <a href="#pricing" onClick={handleSmoothScroll} className="block text-gray-600 hover:text-blue-600 font-medium py-2">Pricing</a>
                <a href="#feedback" onClick={handleSmoothScroll} className="block text-gray-600 hover:text-blue-600 font-medium py-2">Feedback</a>
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
      <section className="bg-gradient-to-br from-gray-50 via-white to-blue-50 px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-6">
              <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                Trusted by our growing community of innovators
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
              <Link to="/login"><button className="group bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button></Link>
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
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-15 bg-white">
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
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-15 bg-gray-50 pb-20">
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

                  <button onClick={() => alert("Pricing is not started yet , Stay Tuned ✨")} className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors mb-8 cursor-pointer ${plan.buttonStyle}`}>
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
        </div>
      </section>

      {/* Feedback Section */}
      <section id="feedback" className="px-4 sm:px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              We'd love to hear from you
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your feedback helps us improve ProjectMan and build better features for everyone
            </p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <form onSubmit={handleFeedbackSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={feedbackForm.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={feedbackForm.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating *
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackForm({ ...feedbackForm, rating: star })}
                      className={`p-1 rounded transition-colors cursor-pointer ${star <= feedbackForm.rating
                        ? 'text-yellow-400 hover:text-yellow-500'
                        : 'text-gray-300 hover:text-yellow-400'
                        }`}
                    >
                      <Star className={`h-8 w-8 ${star <= feedbackForm.rating ? 'fill-current' : ''}`} />
                    </button>
                  ))}
                  <span className="ml-3 text-sm text-gray-600">
                    {feedbackForm.rating} star{feedbackForm.rating !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Your Feedback *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={feedbackForm.message}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                  placeholder="Share your thoughts, suggestions, or experiences with ProjectMan..."
                />
              </div>

              <div className="text-center">
                {submitResult && (
                  <p className="text-sm text-gray-600 mb-4">{submitResult}</p>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center mx-auto shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? 'Sending...' : 'Send Feedback'}
                  <Send className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
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
            <Link to="/login">
              <button className="group bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 cursor-pointer">
                Start Free 30-Day Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6">
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

      {/* Footer - Made Fully Responsive */}
      <footer className="bg-white border-t border-gray-100 px-4 sm:px-6 lg:px-8 py-12 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="mb-6">
                {/* 3. Replace the old logo in the footer as well */}
                <img src={projectManLogo} alt="ProjectMan Logo" className="h-12 w-auto" />
              </div>
              <p className="text-gray-600 mb-6 text-sm lg:text-base">
                A modern project management solution demonstrating cutting-edge web technologies and enterprise-grade features.
              </p>
              <div className="flex space-x-4">
                <a href="https://github.com/piyansu" target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/in/piyansuwebdeveloper" target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="mailto:piyansufo3saha.com" className="text-gray-400 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                  <Mail className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Frontend Technologies */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">Frontend Stack</h4>
              <div className="space-y-3">
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">React.js 18</div>
                  <div className="text-xs lg:text-sm text-gray-500">Modern UI library with hooks</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">Tailwind CSS</div>
                  <div className="text-xs lg:text-sm text-gray-500">Utility-first styling framework</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">Lucide React</div>
                  <div className="text-xs lg:text-sm text-gray-500">Beautiful icon library</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">Vite</div>
                  <div className="text-xs lg:text-sm text-gray-500">Fast build tool & dev server</div>
                </div>
              </div>
            </div>

            {/* Backend Technologies */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">Backend Stack</h4>
              <div className="space-y-3">
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">Node.js</div>
                  <div className="text-xs lg:text-sm text-gray-500">JavaScript runtime environment</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">Express.js</div>
                  <div className="text-xs lg:text-sm text-gray-500">Fast web framework</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">MongoDB</div>
                  <div className="text-xs lg:text-sm text-gray-500">NoSQL database solution</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">JWT Auth</div>
                  <div className="text-xs lg:text-sm text-gray-500">Secure token authentication</div>
                </div>
              </div>
            </div>

            {/* Additional Tools */}
            <div>
              <h4 className="text-gray-900 font-semibold mb-4 text-lg">Development Tools</h4>
              <div className="space-y-3">
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">Axios</div>
                  <div className="text-xs lg:text-sm text-gray-500">HTTP client library</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">React Router</div>
                  <div className="text-xs lg:text-sm text-gray-500">Client-side routing</div>
                </div>
                <div className="text-gray-600 hover:text-blue-600 transition-colors cursor-pointer">
                  <div className="font-medium text-sm lg:text-base">ESLint & Prettier</div>
                  <div className="text-xs lg:text-sm text-gray-500">Code quality & formatting</div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-100 mt-12 pt-8 flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-500 text-sm lg:text-base text-center lg:text-left">
              &copy; 2025 ProjectMan - Made with ❤️ by Piyansu Saha
            </p>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-center lg:text-left">
              <a href="https://github.com/piyansu/Project-Management-React-FullStack-App.git" target="_blank" className="text-gray-500 hover:text-blue-600 transition-colors text-sm lg:text-base">GitHub Repository</a>
              <a href="mailto:piyansfo3saha@gmail.com" className="text-gray-500 hover:text-blue-600 transition-colors text-sm lg:text-base">Contact Developer</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}