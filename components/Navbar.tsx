'use client';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';

function NavbarContent() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const role = (session?.user as any)?.role;
  const userId = (session?.user as any)?.id;
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (userId && role) {
      const fetchCount = () => {
        fetch(`/api/notifications/count?userId=${userId}&role=${role}`)
          .then(res => res.json())
          .then(data => { if (data.count) setNotifCount(data.count); })
          .catch(() => {});
      };

      fetchCount();
      const interval = setInterval(fetchCount, 10000);
      return () => clearInterval(interval);
    }
  }, [userId, role]);

  if (pathname.includes('/dashboard') || pathname === '/login') return null;

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#03050a]/40 backdrop-blur-xl border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        
        <Link href="/" className="text-2xl font-extrabold text-white tracking-tight">
          TutorConnect <span className="text-blue-500">BD</span>
        </Link>

        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <span className="text-slate-400 text-sm animate-pulse">লোড হচ্ছে...</span>
          ) : session ? (
            <>
              <span className="font-semibold text-slate-300 text-sm hidden md:block">
                স্বাগতম, <span className="text-blue-400">{session.user?.name}</span>
              </span>
              
              <Link href="/dashboard/messages" className="relative p-2 bg-white/5 rounded-full border border-white/10 hover:bg-white/10 transition">
                <span className="text-xl">🔔</span>
                {notifCount > 0 && (
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 border-2 border-[#03050a] rounded-full"></span>
                )}
              </Link>

              {role === 'teacher' && (
                <Link href="/dashboard/teacher" className="bg-white/10 text-white border border-white/20 px-5 py-2 rounded-xl text-sm font-bold hover:bg-white/20 transition">
                  ড্যাশবোর্ড
                </Link>
              )}
              {role === 'student' && (
                <Link href="/dashboard/student" className="bg-green-500/20 text-green-300 border border-green-500/30 px-5 py-2 rounded-xl text-sm font-bold hover:bg-green-500/30 transition">
                  ড্যাশবোর্ড
                </Link>
              )}

              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="text-slate-400 hover:text-red-400 text-sm font-bold transition"
              >
                লগআউট
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-blue-500 transition shadow-[0_0_15px_rgba(59,130,246,0.3)]">
              লগইন করুন
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<div className="h-16 bg-[#03050a]/40 backdrop-blur-xl border-b border-white/5"></div>}>
      <NavbarContent />
    </Suspense>
  );
}