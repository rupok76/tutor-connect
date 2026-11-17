'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function BrowseStudents() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (status === 'authenticated') {
      const userRole = (session?.user as any)?.role;
      if (userRole === 'teacher') {
        const userGender = (session?.user as any)?.gender;
        if (userGender) {
          fetch(`/api/browse/students?gender=${userGender}`)
            .then(res => res.json())
            .then(data => {
              if (data.students) setStudents(data.students);
              setLoading(false);
            })
            .catch(() => setLoading(false));
        } else setLoading(false);
      } else setLoading(false);
    } else if (status === 'unauthenticated') setLoading(false);
  }, [status, session]);

  const handleSendNotification = async () => {
    if (!message.trim()) return alert('মেসেজ লিখুন');
    setSending(true);
    
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId: (session?.user as any)?.id,
          studentId: selectedStudent.id,
          message: message
        })
      });

      if (res.ok) {
        alert('মেসেজ পাঠানো হয়েছে!');
        setSelectedStudent(null);
        setMessage('');
      } else {
        alert('পাঠাতে সমস্যা হয়েছে');
      }
    } catch (err) {
      alert('নেটওয়ার্ক এরর!');
    }
    setSending(false);
  };

  if (loading) return <div className="p-10 text-center text-white min-h-screen bg-[#03050a]">লোড হচ্ছে...</div>;
  
  if (status === 'authenticated' && (session?.user as any)?.role !== 'teacher') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03050a] text-white">
        <div className="bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-white/10 text-center">
          <h2 className="text-2xl font-bold text-red-400 mb-4">শুধুমাত্র শিক্ষকদের জন্য!</h2>
          <Link href="/browse/teachers" className="bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-green-500 transition shadow-lg">শিক্ষক ব্রাউজ করুন</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03050a] p-6 md:p-10 text-white relative overflow-hidden pt-24">
      
      <div className="max-w-6xl mx-auto z-10 relative">
        <div className="flex justify-between items-center mb-10 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">ছাত্র/ছাত্রী ব্রাউজ করুন</h1>
            <Link href="/dashboard/teacher" className="text-slate-400 hover:text-white transition text-sm">← ড্যাশবোর্ডে ফিরে যান</Link>
          </div>
        </div>

        {students.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-3xl p-12 text-center">
            <span className="text-6xl mb-4 block">👤</span>
            <p className="text-slate-400 text-lg">আপনার সমলিঙ্গের কোনো ছাত্র/ছাত্রী পাওয়া যায়নি।</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {students.map((student) => (
              <div key={student.id} className="bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 p-6 flex flex-col justify-between hover:bg-white/[0.05] transition-all duration-300 group">
                <div>
                  <div className="flex items-center gap-4 mb-5">
                    {student.photo_url ? (
                      <img src={student.photo_url} alt={student.name} className="w-16 h-16 rounded-full object-cover border-2 border-purple-500/30" />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h2 className="text-xl font-bold text-white">{student.name}</h2>
                      <p className="text-sm text-slate-400">{student.education}</p>
                    </div>
                  </div>
                  <div className="mb-5 bg-black/20 p-4 rounded-2xl border border-white/5">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">যেসব বিষয়ে সাহায্য চাই:</p>
                    <p className="text-sm text-slate-300 leading-relaxed">{student.student_topics?.map((st: any) => st.topics?.name).join(', ') || 'উল্লেখ করা নেই'}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedStudent(student)} className="mt-2 w-full bg-purple-600/20 text-purple-300 border border-purple-500/30 py-3 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                  মেসেজ পাঠান
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>
            <h3 className="text-xl font-bold mb-2 text-white">মেসেজ পাঠান</h3>
            <p className="text-sm text-slate-400 mb-6">প্রাপক: {selectedStudent.name}</p>
            
            <textarea 
              className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-purple-500 outline-none mb-6 resize-none"
              rows={4}
              placeholder="যেমন: আমি আপনার কাঙ্ক্ষিত বিষয়টি কম খরচে পড়াতে পারবো..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>
            
            <div className="flex gap-3">
              <button onClick={() => setSelectedStudent(null)} className="flex-1 bg-white/5 text-slate-300 py-3 rounded-xl font-bold hover:bg-white/10 transition">বাতিল</button>
              <button onClick={handleSendNotification} disabled={sending} className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-bold hover:from-purple-500 hover:to-pink-500 transition shadow-lg disabled:opacity-50">{sending ? 'পাঠানো হচ্ছে...' : 'পাঠান'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}