'use client';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = role === 'teacher' ? [
    { name: 'ড্যাশবোর্ড', path: '/dashboard/teacher', icon: '🏠' },
    { name: 'সাবজেক্ট সিলেক্ট', path: '/dashboard/teacher/subjects', icon: '📚' },
    { name: 'ইনবক্স', path: '/dashboard/messages', icon: '📩' },
    { name: 'ছাত্র ব্রাউজ', path: '/browse/students', icon: '🔍' },
    { name: 'পেমেন্ট হিস্ট্রি', path: '/dashboard/payment-history', icon: '💳' },
  ] : [
    { name: 'ড্যাশবোর্ড', path: '/dashboard/student', icon: '🏠' },
    { name: 'ইনবক্স', path: '/dashboard/messages', icon: '📩' },
    { name: 'শিক্ষক ব্রাউজ', path: '/browse/teachers', icon: '🔍' },
    { name: 'পেমেন্ট হিস্ট্রি', path: '/dashboard/payment-history', icon: '💳' },
  ];

  return (
    <div className="min-h-screen bg-[#03050a] flex text-white relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-10 pointer-events-none"></div>

      {/* ডেস্কটপ সাইডবার */}
      <aside className="w-64 bg-[#0a0f1c]/80 backdrop-blur-xl border-r border-white/5 hidden md:flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="text-2xl font-extrabold text-white tracking-tight">
            TutorConnect <span className="text-blue-500">BD</span>
          </Link>
          <p className="text-xs text-blue-400 mt-2 font-bold uppercase tracking-wider">{role} Panel</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link 
              key={item.path} 
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                pathname === item.path 
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 hover:border-red-500/20 border border-transparent transition-all"
          >
            <span className="text-xl">🚪</span> লগআউট
          </button>
        </div>
      </aside>

      {/* মোবাইল সাইডবার */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          
          <aside className="relative w-64 bg-[#0a0f1c] h-full flex flex-col border-l border-white/10 shadow-2xl animate-slide-in-right">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
              <Link href="/" className="text-xl font-extrabold text-white">
                TutorConnect
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            
            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <Link 
                  key={item.path} 
                  href={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all ${
                    pathname === item.path 
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' 
                      : 'text-slate-400 hover:bg-white/5'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {item.name}
                </Link>
              ))}
            </nav>
            
            <div className="p-4 border-t border-white/5">
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl font-semibold text-red-400 hover:bg-red-500/10 transition-all"
              >
                <span className="text-xl">🚪</span> লগআউট
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* মেইন কন্টেন্ট */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative z-10">
        
        <header className="md:hidden bg-[#0a0f1c]/90 backdrop-blur-md p-4 border-b border-white/5 flex justify-between items-center sticky top-0 z-40">
          <Link href="/" className="text-xl font-bold text-white">TutorConnect</Link>
          
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 bg-white/5 rounded-lg border border-white/10 text-white flex flex-col gap-1.5 items-end justify-center"
          >
            <span className="w-6 h-0.5 bg-white rounded-full"></span>
            <span className="w-6 h-0.5 bg-white rounded-full"></span>
            <span className="w-4 h-0.5 bg-white rounded-full"></span>
          </button>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>

    </div>
  );
}