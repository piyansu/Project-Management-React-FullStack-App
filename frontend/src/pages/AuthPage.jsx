import { useState } from 'react';
import { Mail, Lock, User, ArrowLeft, Eye, EyeOff, LoaderCircle, KeyRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import projectManLogo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loginWithGoogle } = useAuth();

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

  // New state for OTP flow
  const [showOtpForm, setShowOtpForm] = useState(false);
  const [otp, setOtp] = useState('');
  
  // A helper function to clear messages
  const resetState = () => {
    setError('');
    setSuccess('');
    setShowPassword(false);
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowOtpForm(false); // Reset OTP form when switching tabs
    resetState();
  };

  const handleLoginChange = (e) => setLoginForm({...loginForm, [e.target.name]: e.target.value });
  const handleRegisterChange = (e) => setRegisterForm({...registerForm, [e.target.name]: e.target.value });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);

    try {
      await login(loginForm.email, loginForm.password);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 1 of Registration: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    resetState();
    setIsLoading(true);

    try {
      const { fullName, email, password } = registerForm;
      const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to send OTP.');

      setSuccess(data.message);
      setShowOtpForm(true); // Proceed to OTP verification step
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2 of Registration: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    resetState();
    setIsLoading(true);
    
    try {
        const { email } = registerForm;
        const response = await fetch(`${import.meta.env.VITE_URL_BACKEND}/auth/verify-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, otp }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'OTP verification failed.');
        
        setSuccess('Account verified successfully! Redirecting...');
        // The backend sets the auth cookie, so we can redirect.
        // A full page reload ensures the AuthContext is updated correctly.
        setTimeout(() => {
            window.location.href = '/dashboard';
        }, 1500);

    } catch(err) {
        setError(err.message);
    } finally {
        setIsLoading(false);
    }
  };

  // Google Login Logic
  const handleGoogleSuccess = async (codeResponse) => {
    resetState();
    setIsLoading(true);
    try {
      await loginWithGoogle(codeResponse.code);
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      setError(err.message || 'An error occurred during Google login.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google login failed. Please try again.'),
    flow: 'auth-code',
  });

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

  const GoogleButton = () => (
    <button
      type="button"
      onClick={() => googleLogin()}
      disabled={isLoading}
      className="w-full flex justify-center items-center bg-white text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-gray-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" className="h-5 w-5 mr-3" />
      Continue with Google
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
            !showOtpForm ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div className="relative"><User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" name="fullName" value={registerForm.fullName} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Enter your full name" /></div>
                <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="email" name="email" value={registerForm.email} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Enter your email" /></div>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type={showPassword ? "text" : "password"} name="password" value={registerForm.password} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Create a password" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">{showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}</button></div>
                <div className="relative"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="password" name="confirmPassword" value={registerForm.confirmPassword} onChange={handleRegisterChange} required className={commonInputClass} placeholder="Confirm your password" /></div>
                <div><FormButton text="Continue" /></div>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <p className="text-center text-sm text-gray-600">
                    An OTP has been sent to <strong>{registerForm.email}</strong>.
                  </p>
                  <div className="relative">
                      <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input 
                          type="text" 
                          name="otp"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required 
                          className={commonInputClass}
                          placeholder="Enter 6-digit OTP"
                          maxLength="6"
                      />
                  </div>
                  <div><FormButton text="Verify & Create Account" /></div>
                  <button 
                    type="button" 
                    onClick={() => setShowOtpForm(false)} 
                    className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Back
                  </button>
              </form>
            )
          )}
        </div>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200"></span>
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
        </div>

        <div>
            <GoogleButton />
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