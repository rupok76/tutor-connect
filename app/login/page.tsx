'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError(res.error);
        setLoading(false);
      } else if (res?.ok) {
        // সেশন থেকে রোল চেক করে ড্যাশবোর্ডে পাঠানো
        const sessionRes = await fetch('/api/auth/session');
        const sessionData = await sessionRes.json();
        
        if (sessionData?.user?.role === 'teacher') {
          window.location.href = '/dashboard/teacher';
        } else if (sessionData?.user?.role === 'student') {
          window.location.href = '/dashboard/student';
        } else {
          window.location.href = '/';
        }
      } else {
        setError('লগইন করতে সমস্যা হচ্ছে, আবার চেষ্টা করুন।');
        setLoading(false);
      }
    } catch (err) {
      setError('সার্ভারে সমস্যা হয়েছে।');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড ইফেক্ট */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>

      <div className="z-10 bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-full max-w-md border border-white">
        
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-blue-700 tracking-tight">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-2 font-medium">আপনার অ্যাকাউন্টে লগইন করুন</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl mb-6 text-sm text-center font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ইমেইল</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-black font-medium" 
              placeholder="example@mail.com" 
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">পাসওয়ার্ড</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-black font-medium" 
              placeholder="********" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-xl hover:from-blue-700 hover:to-blue-600 shadow-md hover:shadow-lg transition-all duration-300 disabled:from-gray-400 disabled:to-gray-400 mt-2"
          >
            {loading ? 'লগইন হচ্ছে...' : 'লগইন করুন'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-8 font-medium">
          অ্যাকাউন্ট নেই? <Link href="/" className="text-blue-600 font-bold hover:underline">সাইনআপ করুন</Link>
        </p>
      </div>
    </div>
  );
}