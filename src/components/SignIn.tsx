import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const SignIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already signed in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/editor');
      }
    };
    checkUser();
  }, [navigate]);

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/editor`
      }
    });
    if (error) {
      alert('Error signing in with Google: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] px-2">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 w-full max-w-xs p-4 flex flex-col items-center">
        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Sign in to Continue</h2>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 bg-[#0071e3] hover:bg-[#005bb5] text-white px-4 py-2 rounded-lg font-semibold text-sm shadow transition-colors mb-2"
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <g>
              <path fill="#4285F4" d="M21.35 11.1H12v2.8h5.35c-.23 1.2-1.4 3.5-5.35 3.5-3.22 0-5.85-2.67-5.85-5.9s2.63-5.9 5.85-5.9c1.83 0 3.06.78 3.76 1.44l2.57-2.5C17.1 3.6 14.76 2.5 12 2.5 6.75 2.5 2.5 6.75 2.5 12s4.25 9.5 9.5 9.5c5.47 0 9.08-3.84 9.08-9.23 0-.62-.07-1.09-.15-1.57z"/>
              <path fill="#34A853" d="M3.15 7.68l2.29 1.68C6.3 8.1 8.92 6.1 12 6.1c1.83 0 3.06.78 3.76 1.44l2.57-2.5C17.1 3.6 14.76 2.5 12 2.5c-3.45 0-6.36 2.18-7.85 5.18z"/>
              <path fill="#FBBC05" d="M12 21.5c2.76 0 5.1-.9 6.8-2.44l-2.8-2.3c-.8.6-1.8.94-3 .94-2.35 0-4.33-1.58-5.04-3.7l-2.29 1.77C5.64 19.32 8.63 21.5 12 21.5z"/>
              <path fill="#EA4335" d="M21.35 11.1H12v2.8h5.35c-.23 1.2-1.4 3.5-5.35 3.5-3.22 0-5.85-2.67-5.85-5.9s2.63-5.9 5.85-5.9c1.83 0 3.06.78 3.76 1.44l2.57-2.5C17.1 3.6 14.76 2.5 12 2.5 6.75 2.5 2.5 6.75 2.5 12s4.25 9.5 9.5 9.5c5.47 0 9.08-3.84 9.08-9.23 0-.62-.07-1.09-.15-1.57z"/>
            </g>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn; 