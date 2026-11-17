'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-[#03050a] pt-24 pb-16 px-6 md:px-10 text-white relative overflow-hidden">
      
      {/* ব্যাকগ্রাউন্ড গ্লো */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-green-600 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        
        {/* হেডার */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
            TutorConnect BD কীভাবে কাজ করে?
          </h1>
          <p className="text-slate-400 text-lg">শিক্ষার্থী এবং শিক্ষকদের জন্য সহজ গাইডলাইন।</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          
          {/* শিক্ষার্থীদের জন্য */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-green-500/5 border border-green-500/20 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
            
            <div className="text-4xl mb-4">🎓</div>
            <h2 className="text-2xl font-bold text-green-400 mb-6">একজন শিক্ষার্থীর জন্য</h2>
            
            <ul className="space-y-6 text-slate-300 relative z-10">
              <li className="flex gap-4 items-start">
                <span className="bg-green-500 text-[#03050a] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">১</span> 
                <p><strong>শিক্ষক খুঁজুন:</strong> অ্যাকাউন্ট খোলার পর আপনার পছন্দের বিষয় পড়াতে পারে এমন শিক্ষক খুঁজে বের করুন। আপনি যে বিষয়ে পড়বেন, সেই বিষয়ে পড়াতে পারে এমন শিক্ষকের প্রোফাইল আপনি দেখতে পাবেন।</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="bg-green-500 text-[#03050a] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">২</span> 
                <p><strong>যোগাযোগ করুন:</strong> শিক্ষকের প্রোফাইলে ডেমো ক্লাস পছন্দ হলে তার সাথে ফোন, হোয়াটসঅ্যাপ অথবা ইমেইলের মাধ্যমে যোগাযোগ করতে পারেন।</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="bg-green-500 text-[#03050a] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">৩</span> 
                <p><strong>ক্লাসের বিষয়ে আলোচনা:</strong> যোগাযোগের সময় একটি ক্লাস আপনি কত টাকা দিয়ে করবেন, তা শিক্ষকের সাথে সরাসরি কথা বলে ঠিক করে নিন। ঠিক হলে গুগল মিট অথবা হোয়াটসঅ্যাপের মাধ্যমে ভিডিও কলে ক্লাসটি করে নিতে পারেন।</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="bg-green-500 text-[#03050a] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">৪</span> 
                <p><strong>পারিশ্রমিক প্রদান:</strong> ক্লাসের পর আপনার শিক্ষককে মোবাইল ব্যাংকিংয়ের (বিকাশ/নগদ) মাধ্যমে তার পারিশ্রমিকটি দিয়ে দিন।</p>
              </li>
            </ul>
          </motion.div>

          {/* শিক্ষকদের জন্য */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-blue-500/5 border border-blue-500/20 p-8 rounded-3xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-screen filter blur-[80px] opacity-20"></div>
            
            <div className="text-4xl mb-4">👨‍🏫</div>
            <h2 className="text-2xl font-bold text-blue-400 mb-6">একজন শিক্ষকের জন্য</h2>
            
            <ul className="space-y-6 text-slate-300 relative z-10">
              <li className="flex gap-4 items-start">
                <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">১</span> 
                <p><strong>প্রোফাইল তৈরি:</strong> এখানে আপনার একটি সুন্দর প্রোফাইল খুলুন এবং আপনার প্রোফাইলটি সম্পূর্ণ করুন।</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">২</span> 
                <p><strong>ডেমো ক্লাস যুক্ত করুন:</strong> আপনার একটি বা দুটি ডেমো ক্লাসের লিঙ্ক প্রোফাইলের মধ্যে দিন, যাতে একজন ছাত্র বুঝতে পারে আপনি কত ভালো পড়াতে পারেন।</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">৩</span> 
                <p><strong>মেসেজ পাঠান:</strong> আপনি যে বিষয়ে পড়াতে পারেন, সেই বিষয়ে পড়তে আগ্রহী ছাত্রদের মেসেজ পাঠান।</p>
              </li>
              <li className="flex gap-4 items-start">
                <span className="bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">৪</span> 
                <p><strong>সুনাম অর্জন করুন:</strong> আপনার পড়ানোর ধরন ভালো হলে আপনি অবশ্যই ভালো ফল পাবেন এবং ছাত্রদের কাছ থেকে ভালো রিভিউ পাবেন।</p>
              </li>
            </ul>
          </motion.div>

        </div>

        {/* নিচের কল টু অ্যাকশন */}
        <div className="text-center mt-12 bg-white/5 border border-white/10 p-8 rounded-3xl">
          <h3 className="text-2xl font-bold text-white mb-4">শুরু করতে প্রস্তুত?</h3>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <Link href="/signup/student" className="bg-green-500 text-[#03050a] px-8 py-3 rounded-xl font-bold hover:bg-green-400 transition shadow-lg">স্টুডেন্ট সাইনআপ</Link>
            <Link href="/signup/teacher" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition shadow-lg">টিচার সাইনআপ</Link>
          </div>
        </div>

      </div>
    </div>
  );
}