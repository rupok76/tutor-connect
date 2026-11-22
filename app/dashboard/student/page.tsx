'use client';
import imageCompression from 'browser-image-compression';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import DashboardLayout from '@/components/DashboardLayout';
import { motion } from 'framer-motion';

export default function StudentDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  
  // স্টুডেন্টের সাবজেক্ট ও অন্যান্য ডাটা
  const [mySubjects, setMySubjects] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'student') {
      router.push('/dashboard/teacher'); 
    }

    if (status === 'authenticated') {
      const studentId = (session?.user as any)?.id;
      
      // ডাটাবেস থেকে ইউজারের বেসিক ইনফো লোড
      supabaseClient.from('users').select('photo_url, education').eq('id', studentId).single()
        .then(({ data }) => {
          if (data?.photo_url) setPhotoUrl(data.photo_url);
          if (data) setUserData(data);
        });

      // স্টুডেন্টের সিলেক্ট করা সাবজেক্ট লোড করা
      fetch(`/api/student/subjects?studentId=${studentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.subjects) setMySubjects(data.subjects);
        });
    }
  }, [status, session, router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;

      const imageFile = e.target.files[0];

      const options = {
        maxSizeMB: 0.5,
        maxWidthOrHeight: 800,
        useWebWorker: true,
      };

      const compressedFile = await imageCompression(imageFile, options);

      const fileExt = compressedFile.name.split('.').pop();
      const fileName = `${(session?.user as any)?.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabaseClient.storage.from('profiles').upload(fileName, compressedFile);
      if (uploadError) throw uploadError;

      const { data } = supabaseClient.storage.from('profiles').getPublicUrl(fileName);
      
      const res = await fetch('/api/update-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: (session?.user as any)?.id, photoUrl: data.publicUrl })
      });

      if (!res.ok) throw new Error('সেভ করা যায়নি');
      setPhotoUrl(data.publicUrl);
      alert('ছবি সফলভাবে আপলোড হয়েছে!');
    }  catch (error: any) {
  alert('সমস্যা হয়েছে: ' + error.message);
} finally {
      setUploading(false);
    }
  };

  if (status === 'loading') return <div className="p-10 text-center text-white min-h-screen bg-[#03050a]">লোড হচ্ছে...</div>;

  return (
    <DashboardLayout>
      <div className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-6 md:p-10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-green-600 rounded-full mix-blend-screen filter blur-[120px] opacity-10 pointer-events-none"></div>

        {/* প্রোফাইল হেডার */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 pb-10 border-b border-white/5 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-6">
            
            {/* প্রোফাইল ছবি ও ক্যামেরা আইকন */}
            <div className="relative group">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-32 h-32 rounded-full border-4 border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)] overflow-hidden"
              >
                {photoUrl ? (
                  <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center text-5xl font-bold text-white">
                    {session?.user?.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </motion.div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 bg-green-600 text-white p-2.5 rounded-full border-4 border-[#0a0f1c] hover:bg-green-500 transition cursor-pointer shadow-xl"
                title="ছবি পরিবর্তন করুন"
              >
                📷
              </button>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} className="hidden" />
              {uploading && <span className="absolute -bottom-6 left-0 w-full text-center text-xs text-green-400 font-bold animate-pulse">আপলোড হচ্ছে...</span>}
            </div>

            <div className="text-center md:text-left">
              <h1 className="text-3xl font-extrabold text-white mb-2">স্বাগতম, {session?.user?.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-sm text-slate-300 flex items-center gap-1">
                  🎓 {userData?.education || 'ক্লাস উল্লেখ নেই'}
                </span>
                <span className="bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-lg text-sm text-green-400 flex items-center gap-1">
                  ✅ Verified Student
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* সাবজেক্ট লিস্ট এবং পরিবর্তন বাটন */}
        <div className="mb-10 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-bold text-xl text-white">আপনার প্রয়োজনীয় বিষয়সমূহ</h3>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {mySubjects.length > 0 ? (
              mySubjects.map((sub, idx) => (
                <span key={idx} className="bg-green-500/10 text-green-300 border border-green-500/20 px-4 py-2 rounded-xl text-sm font-medium">
                  {sub.subjects?.name}
                </span>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic">আপনি এখনো কোনো বিষয় সিলেক্ট করেননি।</p>
            )}
          </div>

          {/* ছোট সাবজেক্ট পরিবর্তন বাটন */}
          <button 
            onClick={() => { window.location.href = '/dashboard/student/subjects'; }} 
            className="bg-green-600/20 text-green-400 border border-green-500/30 px-5 py-2 rounded-lg font-bold text-sm hover:bg-green-600 hover:text-white transition shadow-sm"
          >
            সাবজেক্ট পরিবর্তন করুন
          </button>
        </div>

        {/* অন্যান্য অপশন (ব্রাউজ ও ইনবক্স) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <Link href="/browse/teachers" className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl hover:bg-white/[0.05] transition group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🔍</div>
            <h3 className="font-bold text-lg text-white mb-2">শিক্ষক ব্রাউজ করুন</h3>
            <p className="text-sm text-slate-400">আপনার পছন্দের শিক্ষক খুঁজে বের করুন এবং পড়া শুরু করুন।</p>
          </Link>
          
          <Link href="/dashboard/messages" className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl hover:bg-white/[0.05] transition group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📩</div>
            <h3 className="font-bold text-lg text-white mb-2">আপনার ইনবক্স</h3>
            <p className="text-sm text-slate-400">শিক্ষকদের পাঠানো মেসেজগুলো চেক করুন।</p>
          </Link>
        </div>

      </div>
    </DashboardLayout>
  );
}