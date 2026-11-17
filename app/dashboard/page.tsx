'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated' && (session?.user as any)?.role !== 'teacher') {
      router.push('/'); 
    }
  }, [status, session, router]);

  if (status === 'loading') return <div className="p-10 text-center text-black">লোড হচ্ছে...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 text-black">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h1 className="text-3xl font-bold text-blue-600">Teacher Dashboard</h1>
          <Link href="/" className="text-blue-500 hover:underline">হোমে ফিরে যান</Link>
        </div>
        
        <p className="text-lg text-gray-700 mb-8">
          স্বাগতম, <span className="font-bold">{session?.user?.name}</span>! এখান থেকে আপনার প্রোফাইল ম্যানেজ করতে পারবেন।
        </p>

        {/* সাবজেক্ট এবং টপিক সিলেক্ট করার সেকশন */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">আপনার পড়ানোর বিষয়সমূহ</h2>
          <p className="text-gray-600 mb-4">এই সেকশনে আপনি কোন কোন ক্লাসের কোন টপিক পড়াতে চান তা সিলেক্ট করবেন।</p>
          
          <Link href="/dashboard/teacher/subjects" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition">
            সাবজেক্ট ও টপিক সিলেক্ট করুন
          </Link>
          
        </div>

        {/* অন্যান্য অপশন */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border p-4 rounded-lg">
            <h3 className="font-bold text-gray-700">প্রোফাইল আপডেট</h3>
            <p className="text-sm text-gray-500 mb-2">ছবি, বায়ো, চার্জ আপডেট করুন।</p>
            <button className="text-blue-600 font-semibold text-sm hover:underline">এডিট করুন</button>
          </div>
          <div className="border p-4 rounded-lg">
            <h3 className="font-bold text-gray-700">ব্লু টিক (Badge)</h3>
            <p className="text-sm text-gray-500 mb-2">বর্তমানে বুকড আছেন কিনা সেটা দেখান।</p>
            <button className="text-blue-600 font-semibold text-sm hover:underline">ব্যাজ অন করুন</button>
          </div>
        </div>

      </div>
    </div>
  );
}