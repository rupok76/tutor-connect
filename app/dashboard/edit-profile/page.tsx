'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';

export default function EditProfile() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [role, setRole] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    education: '',
    phone: '',
    email: '', // ইমেইল স্টেট যোগ করা হলো
    bio: '',
    per_class_charge: ''
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      const userId = (session?.user as any)?.id;
      const userRole = (session?.user as any)?.role;
      setRole(userRole);

      fetch(`/api/user-profile?userId=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setFormData({
              name: data.user.name || '',
              education: data.user.education || '',
              phone: data.user.phone || '',
              email: data.user.email || '',
              bio: data.user.profile?.bio || '',
              per_class_charge: data.user.profile?.per_class_charge || ''
            });
          }
          setLoading(false);
        });
    }
  }, [status, session, router]);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/user-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: (session?.user as any)?.id,
          role,
          ...formData
        })
      });

      if (res.ok) {
        alert('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
        router.push(role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
      } else {
        alert('আপডেট করতে সমস্যা হয়েছে');
      }
    } catch (err) {
      alert('নেটওয়ার্ক এরর!');
    }
    setSaving(false);
  };

  if (loading) return <div className="p-10 text-center text-white min-h-screen bg-[#03050a]">লোড হচ্ছে...</div>;

  return (
    <DashboardLayout>
      <div className="bg-[#0a0f1c]/60 backdrop-blur-xl rounded-[2rem] border border-white/5 p-6 md:p-10 max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
        
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>

        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-6 pb-4 border-b border-white/10 relative z-10">
          Complete Your Profile
        </h1>

        {/* নির্দেশনা বক্স */}
        <div className="bg-blue-500/10 border border-blue-500/30 p-5 rounded-xl mb-8 relative z-10">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h3 className="font-bold text-blue-300 text-lg mb-1">গুরুত্বপূর্ণ নির্দেশনা</h3>
              <p className="text-sm text-blue-200/80 leading-relaxed">
                আপনার ফোন নম্বর, হোয়াটসঅ্যাপ নম্বর এবং ইমেইল সঠিকভাবে দিন। এই তথ্যগুলোর মাধ্যমে স্টুডেন্টরা আপনার সাথে সরাসরি যোগাযোগ করতে পারবে। 
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">পুরো নাম *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition" />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">শিক্ষাগত যোগ্যতা / ক্লাস *</label>
            <input type="text" name="education" value={formData.education} onChange={handleChange} required className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">ফোন / হোয়াটসঅ্যাপ নম্বর *</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition" placeholder="যেমন: 017XXXXXXXX" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-300 mb-2">ইমেইল এড্রেস *</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition" placeholder="example@mail.com" />
            </div>
          </div>

          {role === 'teacher' && (
            <>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">প্রতি ক্লাসের চার্জ (৳) *</label>
                <input type="number" name="per_class_charge" value={formData.per_class_charge} onChange={handleChange} required className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white transition" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-300 mb-2">আপনার সম্পর্কে (Bio)</label>
                <textarea name="bio" value={formData.bio} onChange={handleChange} rows={4} className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-white resize-none transition"></textarea>
              </div>
            </>
          )}

          <button type="submit" disabled={saving} className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-500 transition shadow-[0_0_20px_rgba(59,130,246,0.3)] disabled:opacity-50 mt-4">
            {saving ? 'সেভ হচ্ছে...' : 'আপডেট সেভ করুন'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}