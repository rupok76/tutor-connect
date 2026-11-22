'use client';
import imageCompression from 'browser-image-compression';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { supabaseClient } from '@/lib/supabaseClient';
import DashboardLayout from '@/components/DashboardLayout';

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isBooked, setIsBooked] = useState(false);
  const [badgeMessage, setBadgeMessage] = useState('');
  const [savingBadge, setSavingBadge] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [demoVideoUrl, setDemoVideoUrl] = useState('');
  
  // কন্টাক্ট ইনফো স্টেট
  const [contactInfo, setContactInfo] = useState({ phone: 'নম্বর দেওয়া নেই', email: 'ইমেইল দেওয়া নেই' });
  
  // সাবজেক্ট লিস্ট স্টেট
  const [mySubjects, setMySubjects] = useState<any[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'teacher') {
      router.push('/'); 
    }

    if (status === 'authenticated') {
      const teacherId = (session?.user as any)?.id;
      
      // ১. ডাটাবেস থেকে ছবি লোড করা
      supabaseClient.from('users').select('photo_url').eq('id', teacherId).single()
        .then(({ data }) => {
          if (data?.photo_url) setPhotoUrl(data.photo_url);
        });

      // ২. API থেকে ফোন এবং ইমেইল লোড করা
      fetch(`/api/user-profile?userId=${teacherId}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setContactInfo({ 
              phone: data.user.phone || 'নম্বর দেওয়া নেই', 
              email: data.user.email || 'ইমেইল দেওয়া নেই' 
            });
          }
        });

      // ৩. ব্যাজ ও ভিডিও লোড করা
      fetch(`/api/teacher/badge?teacherId=${teacherId}`)
        .then(res => res.json())
        .then(data => {
          if (data.profile) {
            setIsBooked(data.profile.is_booked_badge || false);
            setBadgeMessage(data.profile.badge_message || '');
            setDemoVideoUrl(data.profile.demo_video_url || '');
          }
        });
        
      // ৪. সিলেক্ট করা সাবজেক্ট লোড করা
      fetch(`/api/teacher/subjects?teacherId=${teacherId}`)
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

      // ছবি অটো-রিসাইজ করার অপশন
      const options = {
        maxSizeMB: 0.5, // সর্বোচ্চ ৫০০ কিলোবাইট
        maxWidthOrHeight: 800, // সর্বোচ্চ ৮০০ পিক্সেল
        useWebWorker: true,
      };

      // ছবি রিসাইজ করা
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
        }  finally {
      setUploading(false);
    }
  };

  const handleSaveBadge = async () => {
    setSavingBadge(true);
    try {
      const res = await fetch('/api/teacher/badge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherId: (session?.user as any)?.id, isBooked, badgeMessage, demoVideoUrl })
      });
      if (res.ok) alert('সেটিংস সেভ হয়েছে!');
    } catch (err) { alert('এরর!'); }
    setSavingBadge(false);
  };

  if (status === 'loading') return <div className="p-10 text-center text-white min-h-screen bg-[#03050a]">লোড হচ্ছে...</div>;

  return (
    <DashboardLayout>
      <div className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-6 md:p-10 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

        {/* হেডার এবং প্রোফাইল ছবি (ক্যামেরা আইকন সহ) */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 mb-8 pb-8 border-b border-white/5 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            
            {/* প্রোফাইল ছবি ও ক্যামেরা আইকন */}
            <div className="relative group">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover border-4 border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]" />
              ) : (
                <div className="w-28 h-28 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-4xl font-bold text-white shadow-lg">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              
              {/* ক্যামেরা আইকন */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-[#0a0f1c] hover:bg-blue-500 transition cursor-pointer shadow-lg"
                title="ছবি পরিবর্তন করুন"
              >
                📷
              </button>
              <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                className="hidden" 
              />
              {uploading && <span className="absolute -bottom-6 left-0 text-xs text-blue-400 font-bold animate-pulse whitespace-nowrap">আপলোড হচ্ছে...</span>}
            </div>

            <div className="text-center md:text-left mt-2">
              <h1 className="text-3xl font-extrabold text-white mb-1">স্বাগতম, {session?.user?.name}</h1>
              <p className="text-slate-400 font-medium">আপনার শিক্ষক প্রোফাইল ম্যানেজ করুন</p>
            </div>
          </div>

          <Link href="/dashboard/edit-profile" className="bg-blue-600 text-white border border-blue-500 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition shadow-[0_0_15px_rgba(59,130,246,0.3)] whitespace-nowrap">
            Complete Your Profile
          </Link>
        </div>

        {/* কন্টাক্ট ইনফো ডিসপ্লে কার্ড */}
        <div className="mb-8 bg-blue-500/5 border border-blue-500/20 p-6 rounded-2xl relative z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg text-white">আপনার যোগাযোগের মাধ্যমসমূহ</h3>
          </div>
          
          <p className="text-sm text-blue-300 mb-4 bg-blue-500/10 p-3 rounded-lg border border-blue-500/20">
            ℹ️ এই তথ্যগুলো স্টুডেন্টদের প্রোফাইলে দেখানো হবে। তথ্য আপডেট করতে "Complete Your Profile" বাটনে ক্লিক করুন।
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-3">
              <span className="text-2xl">📞</span>
              <div>
                <p className="text-xs text-slate-400 mb-1">ফোন / হোয়াটসঅ্যাপ নম্বর</p>
                <p className="font-bold text-white tracking-wide">{contactInfo.phone}</p>
              </div>
            </div>
            <div className="bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-3">
              <span className="text-2xl">✉️</span>
              <div>
                <p className="text-xs text-slate-400 mb-1">ইমেইল এড্রেস</p>
                <p className="font-bold text-white break-all">{contactInfo.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* সাবজেক্ট লিস্ট এবং সিলেক্ট বাটন */}
        <div className="mb-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-white/10 pb-4">
            <div>
              <h2 className="text-xl font-bold text-white mb-1">আপনার পড়ানোর বিষয়সমূহ</h2>
            </div>
            <button onClick={() => { window.location.href = '/dashboard/teacher/subjects'; }} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition shadow-[0_0_15px_rgba(59,130,246,0.4)] whitespace-nowrap">
              সাবজেক্ট পরিবর্তন করুন
            </button>
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-lg font-bold text-blue-300">সাবজেক্ট সিলেক্ট করুন:</p>
              
              {/* নতুন যোগ করা সাবজেক্ট সিলেক্ট করুন বাটন */}
              <button onClick={() => { window.location.href = '/dashboard/teacher/subjects'; }} className="bg-green-600 text-white px-5 py-2 rounded-xl font-bold text-sm hover:bg-green-500 transition shadow-[0_0_15px_rgba(34,197,94,0.3)] whitespace-nowrap">
                + সাবজেক্ট সিলেক্ট করুন
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {mySubjects.length > 0 ? (
                mySubjects.map((sub, idx) => (
                  <span key={idx} className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-xl text-sm font-medium shadow-sm">
                    {sub.subjects?.name}
                  </span>
                ))
              ) : (
                <p className="text-slate-400 text-sm italic">আপনি এখনো কোনো বিষয় সিলেক্ট করেননি। উপরের বাটনে ক্লিক করে বিষয় সিলেক্ট করুন।</p>
              )}
            </div>
          </div>
        </div>

        {/* ভিডিও ও ব্যাজ সেটিংস */}
        <div className="bg-white/[0.02] border border-white/10 p-6 rounded-2xl relative z-10">
          <h3 className="font-bold text-lg text-white mb-5">ডেমো ক্লাস ও ব্যাজ সেটিংস</h3>
          
          <div className="mb-5">
            <label className="block text-sm font-bold text-slate-300 mb-2">ডেমো ক্লাসের ভিডিও লিংক (YouTube)</label>
            <input type="text" value={demoVideoUrl} onChange={(e) => setDemoVideoUrl(e.target.value)} className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500 transition" placeholder="যেমন: https://youtube.com/watch?v=..." />
          </div>

          <div className="flex items-center gap-3 mb-5 bg-white/5 p-3 rounded-xl border border-white/5">
            <input type="checkbox" id="booked" checked={isBooked} onChange={(e) => setIsBooked(e.target.checked)} className="w-5 h-5 text-blue-600 rounded bg-black/50 border-white/20 focus:ring-blue-500 focus:ring-offset-gray-900 cursor-pointer" />
            <label htmlFor="booked" className="font-bold text-white cursor-pointer select-none">বর্তমানে আমি বুকড আছি ✔️</label>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-300 mb-2">স্টুডেন্টদের জন্য মেসেজ</label>
            <input type="text" value={badgeMessage} onChange={(e) => setBadgeMessage(e.target.value)} className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white placeholder-slate-500 transition" placeholder="যেমন: এই মাসে আমার ২টি সিট ফাঁকা আছে..." />
          </div>

          <button onClick={handleSaveBadge} disabled={savingBadge} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:from-blue-500 hover:to-purple-500 transition shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 w-full md:w-auto">
            {savingBadge ? 'সেভ হচ্ছে...' : 'সব সেটিংস সেভ করুন'}
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}