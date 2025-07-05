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
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 w-full max-w-md p-8 flex flex-col items-center">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Sign in to Continue</h2>
        <button
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center space-x-3 bg-[#0071e3] hover:bg-[#005bb5] text-white px-6 py-3 rounded-lg font-bold text-lg shadow transition-colors mb-2"
        >
          <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24">
            <path fill="#fff" d="M21.35 11.1H12v2.8h5.35c-.23 1.2-1.4 3.5-5.35 3.5-3.22 0-5.85-2.67-5.85-5.9s2.63-5.9 5.85-5.9c1.83 0 3.06.78 3.76 1.44l2.57-2.5C17.1 3.6 14.76 2.5 12 2.5 6.75 2.5 2.5 6.75 2.5 12s4.25 9.5 9.5 9.5c5.47 0 9.08-3.84 9.08-9.23 0-.62-.07-1.09-.15-1.57z"/>
          </svg>
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
};

export default SignIn; 