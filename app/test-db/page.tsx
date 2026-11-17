import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
      
      {/* হেডিং */}
      <h1 className="text-5xl font-extrabold text-blue-600 mb-4">
        TuitionConnect BD
      </h1>
      <p className="text-lg text-gray-600 mb-12 max-w-lg">
        বাংলাদেশের সেরা টিউশন প্ল্যাটফর্ম। শিক্ষক এবং শিক্ষার্থীদের সরাসরি যুক্ত করার সহজ মাধ্যম।
      </p>

      {/* অপশন কার্ড */}
      <div className="flex flex-col md:flex-row gap-6">
        
        {/* Student Card */}
        <Link href="/signup/student" className="w-80 p-8 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-green-500 transition-all group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👨‍🎓</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">আমি ছাত্র/ছাত্রী</h2>
          <p className="text-gray-500 text-sm">আমি একজন শিক্ষক খুঁজছি যিনি আমাকে পড়াতে পারবেন।</p>
          <button className="mt-6 w-full py-2 bg-green-500 text-white rounded-lg font-semibold group-hover:bg-green-600 transition">
            Student Sign Up
          </button>
        </Link>

        {/* Teacher Card */}
        <Link href="/signup/teacher" className="w-80 p-8 bg-white rounded-2xl shadow-lg border-2 border-transparent hover:border-blue-500 transition-all group">
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">👨‍🏫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">আমি শিক্ষক</h2>
          <p className="text-gray-500 text-sm">আমি টিউশন করতে চাই এবং ছাত্র খুঁজছি।</p>
          <button className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg font-semibold group-hover:bg-blue-700 transition">
            Teacher Sign Up
          </button>
        </Link>

      </div>
    </div>
  );
}