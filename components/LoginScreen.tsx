import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, UserCheck } from 'lucide-react';
import { parseJwt } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

declare const google: any;

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isHuman, setIsHuman] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isHuman) {
      // Initialize Google Sign-In Button only after Human Check
      try {
        if (typeof google === 'undefined') {
            setError("Google Login scripts failed to load. Please refresh.");
            return;
        }

        google.accounts.id.initialize({
          client_id: process.env.GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER", // Fallback or Env
          callback: (response: any) => {
            const user = parseJwt(response.credential);
            if (user) {
              localStorage.setItem('user_token', response.credential);
              onLoginSuccess(user);
            } else {
              setError("Failed to decode user information.");
            }
          }
        });

        google.accounts.id.renderButton(
          document.getElementById("googleSignInBtn"),
          { theme: "filled_black", size: "large", shape: "pill", width: "250" }
        );
      } catch (e) {
        console.error("Google Sign-in Error", e);
        setError("Sign-in initialization failed.");
      }
    }
  }, [isHuman, onLoginSuccess]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[#0f172a] relative overflow-hidden font-['Prompt']">
       {/* Ambient Background */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px]"></div>
       </div>

       <div className="relative z-10 max-w-md w-full p-8 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col items-center text-center space-y-8 animate-fade-in">
          
          <div className="flex flex-col items-center gap-4">
             <div className="w-20 h-20 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mb-2">
                <Sparkles className="text-white w-10 h-10" />
             </div>
             <h1 className="text-3xl font-bold text-white tracking-tight">
                Nithan<span className="text-indigo-400">AI</span>
             </h1>
             <p className="text-slate-400 text-sm">เข้าสู่ระบบเพื่อเริ่มสร้างนิทานของคุณ</p>
          </div>

          <div className="w-full space-y-6">
             {/* Step 1: Anti-Bot Check */}
             <div className={`transition-all duration-500 ${isHuman ? 'opacity-50 pointer-events-none grayscale' : 'opacity-100'}`}>
                <label className="flex items-center gap-4 p-4 bg-slate-800/50 border border-slate-600 rounded-xl cursor-pointer hover:bg-slate-800 transition group select-none">
                   <div className="relative">
                      <input 
                        type="checkbox" 
                        checked={isHuman} 
                        onChange={(e) => setIsHuman(e.target.checked)}
                        className="peer sr-only"
                      />
                      <div className="w-6 h-6 border-2 border-slate-400 rounded-md peer-checked:bg-green-500 peer-checked:border-green-500 flex items-center justify-center transition-all">
                         <UserCheck size={16} className="text-white opacity-0 peer-checked:opacity-100" />
                      </div>
                   </div>
                   <span className="text-slate-300 font-medium text-sm group-hover:text-white">
                      ฉันไม่ใช่โปรแกรมอัตโนมัติ (I am human)
                   </span>
                </label>
             </div>

             {/* Step 2: Google Login */}
             <div className={`transition-all duration-700 transform ${isHuman ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 <div className="relative flex flex-col items-center gap-3">
                    <div id="googleSignInBtn" className="h-[44px]"></div>
                    {process.env.GOOGLE_CLIENT_ID ? null : (
                      <p className="text-xs text-yellow-500/80 mt-2 max-w-[250px]">
                        *Environment Variable 'GOOGLE_CLIENT_ID' is missing. Button may not appear.
                      </p>
                    )}
                 </div>
             </div>
          </div>

          {error && (
             <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {error}
             </div>
          )}

          <div className="text-[10px] text-slate-600 mt-8">
             Secure Login powered by Google Identity Services
          </div>
       </div>
    </div>
  );
};

export default LoginScreen;