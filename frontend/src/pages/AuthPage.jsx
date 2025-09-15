import { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, LoaderCircle } from 'lucide-react';
import projectManLogo from '../assets/logo.png';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);

  // State for API interaction
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // State for Login Form
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  // State for Register Form
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // A helper function to clear messages and form fields
  const resetState = () => {
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    resetState();
  };

  const handleLoginChange = (e) => setLoginForm({...loginForm, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterForm({...registerForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }
      
      // Handle successful login (e.g., store token, redirect)
      console.log('Login successful:', data);
      setSuccess('Login successful! Redirecting...');
      // TODO: Add redirection logic, e.g., window.location.href = '/dashboard';

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    resetState();
    setIsLoading(true);

    try {
      const { fullName, email, password } = registerForm;
      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed. Please try again.');
      }

      console.log('Registration successful:', data);
      setSuccess('Registration successful! Please log in.');
      setActiveTab('login'); // Switch to login tab on success
      setRegisterForm({fullName: '', email: '', password: '', confirmPassword: ''});

    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const commonInputClass = "w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors";
  
  const FormButton = ({ text }) => (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full flex justify-center items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? <LoaderCircle className="animate-spin h-5 w-5 mr-2" /> : null}
      {isLoading ? 'Processing...' : text}
    </button>
  );

  return (
    <div className="h-screen bg-white flex items-center justify-center scale-90">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-6">
        
        <div className="text-center">
            <a href="/" className="inline-block mb-4">
                <img src={projectManLogo} alt="ProjectMan Logo" className="h-12 w-auto" />
            </a>
            <h2 className="text-2xl font-bold text-gray-900">
                {activeTab === 'login' ? 'Welcome Back!' : 'Create Your Account'}
            </h2>
            <p className="text-gray-600 mt-2 text-sm">
                {activeTab === 'login' ? 'Login to continue to ProjectMan' : 'Get started with a free account'}
            </p>
        </div>

        <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
          <button onClick={() => handleTabChange('login')} className={`w-full py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer ${activeTab === 'login' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Login</button>
          <button onClick={() => handleTabChange('register')} className={`w-full py-2.5 rounded-md font-medium text-sm transition-colors cursor-pointer ${activeTab === 'register' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:bg-gray-200'}`}>Register</button>
        </div>
        
        <div>
          {error && <div className="mb-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</div>}
          {success && <div className="mb-4 text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">{success}</div>}

          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="email" name="email" value={loginForm.email} onChange={handleLoginChange} required className={commonInputClass} placeholder="Enter your email" /></div>
              <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type={showPassword ? "text" : "password"} name="password" value={loginForm.password} onChange={handleLoginChange} required className={commonInputClass} placeholder="Enter your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
              <div className="text-right"><a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700">Forgot Password?</a></div>
              <div><FormButton text="Login" /></div>
            </form>
          ) : (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" name="fullName" value={registerForm.fullName} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Enter your full name" /></div>
              <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="email" name="email" value={registerForm.email} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Enter your email" /></div>
              <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type={showPassword ? "text" : "password"} name="password" value={registerForm.password} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Create a password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
              <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="password" name="confirmPassword" value={registerForm.confirmPassword} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Confirm your password" /></div>
              <div><FormButton text="Create Account" /></div>
            </form>
          )}
        </div>

        <div className="text-center">
            <a href="/" className="group text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center justify-center transition-all">
                <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                Back to Home
            </a>
        </div>
      </div>
    </div>
  );
}