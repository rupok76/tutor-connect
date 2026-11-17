'use client';
import { useState, useEffect, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

const getEmbedUrl = (url: string) => {
  if (!url) return '';
  let videoId = '';
  try {
    if (url.includes('youtu.be/')) videoId = url.split('youtu.be/')[1].split(/[?#]/)[0];
    else if (url.includes('youtube.com/watch')) videoId = url.split('v=')[1].split(/[&?]/)[0];
    else if (url.includes('youtube.com/embed/')) videoId = url.split('youtube.com/embed/')[1].split(/[?#]/)[0];
  } catch (error) { return url; }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

function TeacherProfileContent() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const teacherId = params.id;
  
  const [teacher, setTeacher] = useState<any>(null);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // রিভিউ ফর্ম স্টেট
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = () => {
    if (teacherId) {
      Promise.all([
        fetch(`/api/profile/teacher/${teacherId}`).then(res => res.json()),
        fetch(`/api/reviews?teacherId=${teacherId}`).then(res => res.json())
      ]).then(([profileData, reviewData]) => {
        if (profileData.teacher) setTeacher(profileData.teacher);
        if (profileData.subjects) setSubjects(profileData.subjects);
        if (reviewData.reviews) setReviews(reviewData.reviews);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  };

  useEffect(() => { fetchData(); }, [teacherId]);

  const handleReviewSubmit = async (e: any) => {
    e.preventDefault();
    if (!session) return alert('রিভিউ দিতে লগইন করুন');
    setSubmitting(true);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          teacherId,
          studentId: (session?.user as any)?.id,
          rating,
          comment
        })
      });

      if (res.ok) {
        alert('রিভিউ সফলভাবে দেওয়া হয়েছে!');
        setComment('');
        fetchData(); // রিভিউ লিস্ট রিফ্রেশ
      } else {
        alert('রিভিউ দিতে সমস্যা হয়েছে');
      }
    } catch (err) { alert('নেটওয়ার্ক এরর!'); }
    setSubmitting(false);
  };

  if (loading) return <div className="min-h-screen bg-[#03050a] flex items-center justify-center text-white">লোড হচ্ছে...</div>;
  if (!teacher) return <div className="min-h-screen bg-[#03050a] flex items-center justify-center text-white">শিক্ষক পাওয়া যায়নি।</div>;

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-[#03050a] flex justify-center p-4 md:p-10 relative overflow-hidden text-white pt-24">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-4xl bg-white/[0.02] backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative z-10 my-8">
        
        <div className="h-40 bg-gradient-to-r from-blue-900/50 to-purple-900/50 relative"></div>
        
        <div className="p-6 md:p-10 relative">
          <div className="absolute -top-20 left-6 md:left-10 w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#03050a] shadow-2xl overflow-hidden bg-[#0a0f1c]">
            {teacher.photo_url ? <img src={teacher.photo_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-5xl font-bold bg-blue-600">{teacher.name.charAt(0)}</div>}
          </div>
          
          <div className="mt-16 md:mt-20">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">{teacher.name}</h1>
            <p className="text-lg text-blue-400 font-medium">{teacher.education}</p>
            <div className="flex flex-wrap items-center gap-4 mt-3">
              <div className="bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-xl font-bold text-lg">৳ {teacher.profile?.per_class_charge} / ক্লাস</div>
              <div className="flex items-center text-yellow-400 font-bold text-lg bg-yellow-500/10 px-4 py-1.5 rounded-xl border border-yellow-500/20">
                ⭐ {avgRating} <span className="text-slate-400 text-sm font-normal ml-2">({reviews.length} রিভিউ)</span>
              </div>
            </div>
          </div>

          {teacher.profile?.demo_video_url && (
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">ডেমো ক্লাস</h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                <iframe width="100%" height="100%" src={getEmbedUrl(teacher.profile.demo_video_url)} title="Demo" frameBorder="0" allowFullScreen></iframe>
              </div>
            </div>
          )}

          <div className="mt-10">
            <h2 className="text-2xl font-bold text-white mb-4 border-b border-white/10 pb-2">শিক্ষক সম্পর্কে</h2>
            <p className="text-slate-300 leading-relaxed text-lg">{teacher.profile?.bio || "কোনো বায়ো দেওয়া নেই।"}</p>
          </div>

          {/* রিভিউ সেকশন */}
          <div className="mt-12 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-bold text-white mb-6">স্টুডেন্টদের রিভিউ</h2>
            
            {/* রিভিউ ফর্ম (শুধু স্টুডেন্টরা দেখবে) */}
            {(session?.user as any)?.role === 'student' && (
              <form onSubmit={handleReviewSubmit} className="bg-white/5 border border-white/10 p-6 rounded-2xl mb-8">
                <h3 className="font-bold text-lg mb-4 text-white">আপনার মতামত দিন</h3>
                <div className="flex items-center gap-2 mb-4">
                  <label className="text-slate-300 font-medium">রেটিং:</label>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button type="button" key={star} onClick={() => setRating(star)} className={`text-2xl transition ${rating >= star ? 'text-yellow-400' : 'text-slate-600'}`}>★</button>
                  ))}
                </div>
                <textarea value={comment} onChange={e => setComment(e.target.value)} required rows={3} className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-blue-500 mb-4 resize-none" placeholder="শিক্ষকের পড়ানোর স্টাইল কেমন লাগলো?" />
                <button type="submit" disabled={submitting} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-500 transition">{submitting ? 'পাঠানো হচ্ছে...' : 'রিভিউ সাবমিট করুন'}</button>
              </form>
            )}

            <div className="space-y-4">
              {reviews.length === 0 ? <p className="text-slate-500">এখনো কোনো রিভিউ নেই।</p> : reviews.map(review => (
                <div key={review.id} className="bg-white/5 border border-white/5 p-5 rounded-2xl">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center font-bold">{review.student?.name?.charAt(0)}</div>
                    <div>
                      <span className="font-bold text-white block">{review.student?.name}</span>
                      <span className="text-yellow-400 text-sm">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                    </div>
                  </div>
                  <p className="text-slate-300 text-sm mt-3">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a href={`tel:${teacher.phone}`} className="bg-blue-600 text-white text-center py-4 rounded-2xl font-bold hover:bg-blue-500 transition shadow-[0_0_20px_rgba(59,130,246,0.3)]">📞 Call করুন</a>
              <a href={`https://wa.me/${teacher.phone}`} target="_blank" className="bg-green-500 text-[#03050a] text-center py-4 rounded-2xl font-bold hover:bg-green-400 transition shadow-[0_0_20px_rgba(34,197,94,0.3)]">💬 WhatsApp</a>
              <a href={`mailto:${teacher.email}`} className="bg-white/10 text-white text-center py-4 rounded-2xl font-bold hover:bg-white/20 transition border border-white/10">✉️ Email</a>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <button onClick={() => router.back()} className="text-slate-400 hover:text-white transition font-medium">← পিছনে ফিরে যান</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function TeacherProfilePage() {
  return <Suspense fallback={<div className="min-h-screen bg-[#03050a]"></div>}><TeacherProfileContent /></Suspense>;
}