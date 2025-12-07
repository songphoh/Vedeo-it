import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sparkles, UserCheck, Settings, AlertTriangle } from 'lucide-react';
import { parseJwt } from '../services/authService';

interface LoginScreenProps {
  onLoginSuccess: (user: any) => void;
}

declare const google: any;

const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [isHuman, setIsHuman] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isClientIdMissing, setIsClientIdMissing] = useState(false);

  useEffect(() => {
    // Check if Client ID is configured via Vite define replacement
    const clientId = process.env.GOOGLE_CLIENT_ID;
    
    if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID_PLACEHOLDER') {
        setIsClientIdMissing(true);
        return;
    }

    if (isHuman) {
      // Initialize Google Sign-In Button only after Human Check
      try {
        if (typeof google === 'undefined') {
            setError("Google Login scripts failed to load. Please refresh.");
            return;
        }

        google.accounts.id.initialize({
          client_id: clientId,
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
          { theme: "filled_black", size: "large", shape: "pill", width: "280" }
        );
      } catch (e) {
        console.error("Google Sign-in Error", e);
        setError("Sign-in initialization failed.");
      }
    }
  }, [isHuman, onLoginSuccess]);

  if (isClientIdMissing) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-[#0f172a] font-['Prompt'] p-6">
            <div className="max-w-lg w-full bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-2xl space-y-6">
                <div className="flex items-center gap-3 text-yellow-500">
                    <AlertTriangle size={32} />
                    <h2 className="text-2xl font-bold">Setup Required</h2>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl text-slate-300 text-sm space-y-4 border border-slate-700">
                    <p>ระบบ Google Login ยังไม่พร้อมใช้งานเนื่องจากยังไม่ได้ตั้งค่า <strong>Google Client ID</strong></p>
                    
                    <div className="space-y-2">
                        <p className="font-bold text-white">วิธีแก้ไข (สำหรับ Admin):</p>
                        <ol className="list-decimal list-inside space-y-1 text-slate-400">
                            <li>ไปที่ <a href="https://console.cloud.google.com/" target="_blank" className="text-indigo-400 underline">Google Cloud Console</a> สร้าง Project ใหม่</li>
                            <li>สร้าง <strong>OAuth Client ID</strong> (Web Application)</li>
                            <li>เพิ่ม Authorized Origin: <code className="bg-black/30 px-1 rounded">https://your-app.vercel.app</code></li>
                            <li>นำ Client ID ไปใส่ใน Environment Variables ของ Vercel:</li>
                        </ol>
                        <div className="bg-black/50 p-3 rounded-lg font-mono text-xs text-green-400 mt-2 break-all">
                            GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => window.location.reload()}
                    className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition"
                >
                    ตรวจสอบการตั้งค่าอีกครั้ง
                </button>
            </div>
        </div>
      );
  }

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
                      ฉันไม่ใช่โปรแกรมอัตโนมัติ
                   </span>
                </label>
             </div>

             {/* Step 2: Google Login */}
             <div className={`transition-all duration-700 transform flex flex-col items-center gap-2 min-h-[50px] ${isHuman ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                 {isHuman && <div id="googleSignInBtn"></div>}
             </div>
          </div>

          {error && (
             <div className="px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-xs">
                {error}
             </div>
          )}

          <div className="text-[10px] text-slate-600 mt-8 flex items-center gap-1">
             <ShieldCheck size={10} /> Secure Login powered by Google Identity Services
          </div>
       </div>
    </div>
  );
};

export default LoginScreen;