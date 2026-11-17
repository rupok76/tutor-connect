'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function BrowseTeachers() {
  const { data: session, status } = useSession();
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStudent, setIsStudent] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('all');

  useEffect(() => {
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      
      if (userRole === 'student') {
        setIsStudent(true);
        const userGender = (session?.user as any)?.gender;
        
        if (userGender) {
          setLoading(true);
          fetch(`/api/browse/teachers?gender=${userGender}&subject=${selectedSubject}`)
            .then(res => res.json())
            .then(data => {
              if (data.teachers) setTeachers(data.teachers);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, session, selectedSubject]);

  if (loading) return <div className="p-10 text-center text-white min-h-screen bg-[#03050a]">লোড হচ্ছে...</div>;

  if (status === 'authenticated' && !isStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03050a] text-white">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center shadow-2xl">
          <h2 className="text-2xl font-bold text-red-400 mb-4">আপনি শিক্ষক হিসেবে লগইন আছেন!</h2>
          <p className="mb-6 text-slate-400">এই পেজটি শুধুমাত্র ছাত্র/ছাত্রীদের জন্য।</p>
          <Link href="/dashboard/teacher" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg">
            ড্যাশবোর্ডে ফিরে যান
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050a] pt-24 pb-10 px-6 md:px-10 text-white relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto z-10 relative">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">শিক্ষক ব্রাউজ করুন</h1>
            <Link href="/dashboard/student" className="text-slate-400 hover:text-white transition text-sm">← ড্যাশবোর্ডে ফিরে যান</Link>
          </div>
          
          <div className="flex items-center gap-3 bg-black/30 px-4 py-2 rounded-xl border border-white/10 w-full md:w-auto">
            <label className="font-bold text-slate-300 text-sm whitespace-nowrap">বিষয়:</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="bg-transparent text-white outline-none text-sm font-medium cursor-pointer w-full [&>option]:bg-gray-900"
            >
              <option value="all">সব বিষয়</option>
              <option value="গণিত (Math)">গণিত (Math)</option>
              <option value="পদার্থবিজ্ঞান (Physics)">পদার্থবিজ্ঞান (Physics)</option>
              <option value="রসায়ন (Chemistry)">রসায়ন (Chemistry)</option>
              <option value="ইংরেজি (English)">ইংরেজি (English)</option>
              <option value="কম্পিউটার সায়েন্স (CSE)">কম্পিউটার সায়েন্স (CSE)</option>
            </select>
          </div>
        </div>

        {teachers.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
             <span className="text-6xl mb-4 block">🔍</span>
             <p className="text-slate-400 text-lg">আপনার সমলিঙ্গের কোনো শিক্ষক পাওয়া যায়নি বা এই বিষয়ের কোনো শিক্ষক নেই।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher.id} className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    {teacher.photo_url ? (
                      <img src={teacher.photo_url} alt={teacher.name} className="w-16 h-16 rounded-full object-cover border-2 border-blue-500/30" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {teacher.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    
                    <div>
                      <Link href={`/profile/${teacher.id}`} className="text-xl font-bold text-white hover:text-blue-400 transition flex items-center gap-2">
                        {teacher.name}
                        {teacher.teacher_profiles[0]?.is_booked_badge && (
                          <span className="text-blue-400 text-sm" title="বুকড">✔️</span>
                        )}
                      </Link>
                      <p className="text-sm text-slate-400">{teacher.education}</p>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {teacher.teacher_profiles[0]?.bio || "কোনো বায়ো দেওয়া নেই।"}
                  </p>

                  {/* চার্জ ও রেটিং */}
                  <div className="flex flex-wrap gap-2 mb-5">
                    <div className="bg-green-500/10 text-green-400 border border-green-500/20 font-bold px-3 py-1.5 rounded-lg inline-block text-sm">
                      ৳ {teacher.teacher_profiles[0]?.per_class_charge} / ক্লাস
                    </div>
                    <div className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-bold px-3 py-1.5 rounded-lg inline-block text-sm flex items-center gap-1">
                      ⭐ {teacher.average_rating} 
                      <span className="text-xs text-slate-400 font-normal">({teacher.reviews?.length || 0})</span>
                    </div>
                  </div>
                </div>

                <Link href={`/profile/${teacher.id}`} className="mt-2 w-full bg-blue-600/20 text-blue-400 border border-blue-500/30 text-center py-3 rounded-xl text-sm font-bold hover:bg-blue-600 hover:text-white transition shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                  বিস্তারিত প্রোফাইল দেখুন →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}