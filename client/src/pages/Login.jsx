import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// 🔑 IMPORT THE REAL AUTH LOGIC (Assuming this is in client/src/api/auth.js)
import { loginUser } from '../api/auth'; 
// NOTE: For a real app, you would also need a Context to manage the global user state.

function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState(''); // State to display API errors
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        
        try {
            // ----------------------------------------------------
            // 🔑 REAL API CALL INTEGRATION: Calling the custom Render backend route
            // ----------------------------------------------------
            // The loginUser function (from ../api/auth) handles the fetch call, 
            // stores the JWT token, and returns user data if successful.
            await loginUser(email, password, rememberMe); 
            
            // If successful, navigate to the dashboard root route
            navigate('/'); 

        } catch (err) {
            // Display error message received from the backend/API wrapper
            console.error("Login Failed:", err);
            setError(err.message || 'Login failed. Please check your network or credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider) => {
        setError('');
        setIsLoading(true);
        
        // 💡 In a live app, this would redirect the user to your Render backend's 
        // /auth/{provider} endpoint to initiate the OAuth flow.
        
        alert(`Redirecting for ${provider} authentication. This requires server-side setup.`);
        // Simulating the failure/success of the external redirect for now.
        setTimeout(() => {
            setIsLoading(false);
            // You would normally check the result of the OAuth redirect here.
            // For a successful demo, you could force navigation: navigate('/');
        }, 1500);
    };
    
    // The existing handleGoogleLogin and handleGitHubLogin are replaced 
    // by the generic handleSocialLogin function above.

    // Determine if the submit button should be fully disabled
    const isSubmitDisabled = isLoading || !email.trim() || !password.trim();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
            
            {/* Animated Background (Original Design Preserved) */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-32 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse delay-500"></div>
            </div>

            {/* Login Container */}
            <div className="relative z-10 w-full max-w-md">
                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-8">
                    
                    {/* Header (Original Design Preserved) */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-2xl">
                            <span className="text-2xl text-white">🔐</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-white/70">
                            Sign in to continue your learning journey
                        </p>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="space-y-4 mb-6">
                        <button
                            onClick={() => handleSocialLogin('Google')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                            {/* Google SVG Path... */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                            </svg>
                            Continue with Google
                        </button>

                        <button
                            onClick={() => handleSocialLogin('GitHub')}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
                        >
                            {/* GitHub SVG Path... */}
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 2.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            Continue with GitHub
                        </button>
                    </div>

                    {/* Divider (Original Design Preserved) */}
                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-3 bg-transparent text-white/60">Or continue with email</span>
                        </div>
                    </div>

                    {/* API Error Display */}
                    {error && (
                        <div className="p-3 mb-4 bg-red-800/50 text-red-300 border border-red-400/50 rounded-xl text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Email Login Form */}
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-white font-medium text-lg">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="Enter your email"
                                className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-white font-medium text-lg">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Enter your password"
                                className="w-full p-4 bg-white/5 border border-white/20 rounded-2xl text-white placeholder-white/40 focus:bg-white/10 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                                disabled={isLoading}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 text-cyan-500 border-white/20 rounded focus:ring-cyan-500 bg-white/5"
                                    disabled={isLoading}
                                />
                                <span className="ml-2 text-white/80">Remember me</span>
                            </label>
                            <button type="button" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            // Disabled if loading OR if fields are empty
                            disabled={isSubmitDisabled} 
                            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In to Your Account'
                            )}
                        </button>
                    </form>

                    {/* Demo Login Button */}
                    <div className="mt-6 pt-6 border-t border-white/20">
                        <button
                            // Reusing handleLogin for a quick demo click, forcing it to use the API
                            onClick={handleLogin} 
                            disabled={isLoading}
                            className="w-full py-3 text-white border-2 border-white/20 bg-white/5 rounded-2xl hover:bg-white/10 transition-all duration-300 font-semibold transform hover:scale-105 disabled:opacity-50"
                        >
                             Sign In (Demo Click)
                        </button>
                    </div>

                    {/* Sign Up Link (Original Design Preserved) */}
                    <div className="text-center mt-6">
                        <p className="text-white/60">
                            Don't have an account?{' '}
                            <button type="button" className="text-cyan-400 font-semibold hover:text-cyan-300 transition-colors">
                                Sign up for free
                            </button>
                        </p>
                    </div>
                </div>

                {/* Features Preview (Original Design Preserved) */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    {[
                        { label: 'AI-Powered', desc: 'Learning' },
                        { label: 'Progress', desc: 'Tracking' },
                        { label: 'Peer', desc: 'Collaboration' }
                    ].map((item, index) => (
                        <div key={index} className="bg-white/5 backdrop-blur-sm p-3 rounded-2xl border border-white/10">
                            <div className="text-cyan-400 font-semibold text-sm">{item.label}</div>
                            <div className="text-white/60 text-xs">{item.desc}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Floating Elements (Original Design Preserved) */}
            <div className="absolute bottom-10 left-10 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl animate-bounce"></div>
            <div className="absolute top-20 right-20 w-16 h-16 bg-purple-400/20 rounded-full blur-xl animate-bounce delay-1000"></div>
        </div>
    );
}

export default Login;