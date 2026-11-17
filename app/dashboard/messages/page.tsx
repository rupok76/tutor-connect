'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';

export default function MessagesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // রিপ্লাই পাঠানোর স্টেট
  const [replyMessage, setReplyMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [sendingReply, setSendingReply] = useState(false);

  const fetchMessages = () => {
    if (status === 'authenticated') {
      const userId = (session?.user as any)?.id;
      const role = (session?.user as any)?.role;

      fetch(`/api/messages?userId=${userId}&role=${role}`)
        .then(res => res.json())
        .then(data => {
          if (data.messages) setMessages(data.messages);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
    fetchMessages();

    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [status, session, router]);

  // রিপ্লাই সাবমিট ফাংশন
  const handleReplySubmit = async (e: any) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;
    setSendingReply(true);

    try {
      // এখানে আমরা চ্যাটের জন্য একটি নতুন API বা বর্তমান notifications API ব্যবহার করতে পারি
      const res = await fetch('/api/notifications/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notificationId: replyingTo.id,
          senderId: (session?.user as any)?.id,
          senderRole: (session?.user as any)?.role,
          receiverId: (session?.user as any)?.role === 'student' ? replyingTo.teacher_id : replyingTo.student_id,
          message: replyMessage
        })
      });

      if (res.ok) {
        alert('রিপ্লাই পাঠানো হয়েছে!');
        setReplyMessage('');
        setReplyingTo(null);
        fetchMessages(); // চ্যাট রিফ্রেশ
      } else {
        alert('রিপ্লাই পাঠাতে সমস্যা হয়েছে');
      }
    } catch (err) {
      alert('নেটওয়ার্ক এরর!');
    }
    setSendingReply(false);
  };

  if (loading) return <div className="p-10 text-center text-white min-h-screen bg-[#03050a]">লোড হচ্ছে...</div>;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-md flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
              আপনার ইনবক্স
            </h1>
            <p className="text-slate-400 text-sm">আপনার কাছে আসা মেসেজগুলো এখানে দেখতে পাবেন।</p>
          </div>
          <span className="text-4xl">📩</span>
        </div>

        {messages.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center">
            <span className="text-6xl mb-4 block">📭</span>
            <h2 className="text-xl font-bold text-white mb-2">কোনো মেসেজ নেই</h2>
            <p className="text-slate-400">আপনার ইনবক্স এখন খালি।</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-white/[0.03] backdrop-blur-xl p-6 rounded-3xl border border-white/10 hover:bg-white/[0.05] transition-all duration-300 group">
                <div className="flex justify-between items-start mb-4 border-b border-white/5 pb-4">
                  
                  {/* নামের উপর ক্লিক করলে প্রোফাইলে যাবে */}
                  <Link 
                    href={`/profile/${(session?.user as any)?.role === 'student' ? msg.teacher_id : msg.student_id}`}
                    className="flex items-center gap-3 group-hover:opacity-80 transition cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {(session?.user as any)?.role === 'student' 
                        ? msg.teacher?.name?.charAt(0) 
                        : msg.student?.name?.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-white block hover:text-blue-400 transition">
                        {(session?.user as any)?.role === 'student' 
                          ? `শিক্ষক: ${msg.teacher?.name}` 
                          : `ছাত্র/ছাত্রী: ${msg.student?.name}`}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(msg.created_at).toLocaleString('bn-BD')}
                      </span>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">
                      নতুন
                    </span>
                    {/* রিপ্লাই বাটন */}
                    <button 
                      onClick={() => setReplyingTo(msg)}
                      className="text-xs font-bold bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/20 hover:bg-green-500/40 transition"
                    >
                      Reply
                    </button>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed text-sm md:text-base bg-black/20 p-4 rounded-xl">"{msg.message}"</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* রিপ্লাই মডাল (পপ-আপ) */}
      {replyingTo && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0a0f1c] border border-white/10 rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-blue-500"></div>
            <h3 className="text-xl font-bold mb-2 text-white">রিপ্লাই দিন</h3>
            <p className="text-sm text-slate-400 mb-6">
              {(session?.user as any)?.role === 'student' ? `শিক্ষক: ${replyingTo.teacher?.name}` : `ছাত্র: ${replyingTo.student?.name}`}
            </p>
            
            <form onSubmit={handleReplySubmit}>
              <textarea 
                className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-green-500 outline-none mb-6 resize-none"
                rows={4}
                placeholder="আপনার উত্তর লিখুন..."
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                required
              ></textarea>
              
              <div className="flex gap-3">
                <button type="button" onClick={() => setReplyingTo(null)} className="flex-1 bg-white/5 text-slate-300 py-3 rounded-xl font-bold hover:bg-white/10 transition">বাতিল</button>
                <button type="submit" disabled={sendingReply} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-500 transition shadow-lg disabled:opacity-50">{sendingReply ? 'পাঠানো হচ্ছে...' : 'রিপ্লাই পাঠান'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}